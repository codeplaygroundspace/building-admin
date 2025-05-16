import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";
import { Expense } from "@/types/expense";
import { Building } from "@/types/building";

// Provider-related interfaces (consider moving these to types/provider.ts)
interface Provider {
  id: string;
  name: string;
  provider_category_id: string;
}

interface ProviderCategory {
  id: string;
  name: string;
}

interface BuildingMap {
  [key: string]: string;
}

export async function GET(request: Request) {
  try {
    // Parse URL and get query parameters
    const url = new URL(request.url);
    const buildingId = url.searchParams.get("building_id");
    const month = url.searchParams.get("month");
    const forDropdown = url.searchParams.get("forDropdown") === "true";

    console.log(
      `API Request - Building ID: ${buildingId}, Month: ${month}, forDropdown: ${forDropdown}`
    );

    // Direct query approach - simplified
    let query = supabase
      .from("expenses")
      .select(
        "id, amount, description, created_at, expense_reporting_month, building_id, provider_id"
      );

    // If building ID is provided, filter by it
    if (buildingId) {
      query = query.eq("building_id", buildingId);
    }

    // Filter by month if provided
    if (month && !forDropdown) {
      query = query.eq("expense_reporting_month", month);
    }

    const { data: directData, error: directError } = await query;

    if (directError) {
      console.error("Query error:", directError);
      return NextResponse.json(
        { error: `Error fetching expenses: ${directError.message}` },
        { status: 500 }
      );
    }

    if (directData && directData.length > 0) {
      console.log(`Found ${directData.length} expenses with direct query`);

      // Get building addresses
      const buildingIds = [
        ...new Set(directData.map((expense) => expense.building_id)),
      ];
      const { data: buildings } = await supabase
        .from("buildings")
        .select("id, address")
        .in("id", buildingIds);

      const buildingMap: BuildingMap = (buildings || []).reduce(
        (map: BuildingMap, building: Building) => {
          map[building.id] = building.address;
          return map;
        },
        {}
      );

      // Get provider data
      const providerIds = [
        ...new Set(
          directData
            .map((expense) => expense.provider_id)
            .filter((id) => id != null)
        ),
      ];

      // Get providers with their provider_category_id
      const { data: providers } = await supabase
        .from("providers")
        .select("id, name, provider_category_id")
        .in("id", providerIds);

      // Create provider map
      const providerMap: Record<string, Provider> = (
        (providers || []) as Provider[]
      ).reduce((map: Record<string, Provider>, provider: Provider) => {
        map[provider.id] = provider;
        return map;
      }, {});

      // Get provider categories
      const categoryIds = [
        ...new Set(
          (providers || [])
            .map((provider: Provider) => provider.provider_category_id)
            .filter((id: string | undefined) => id != null)
        ),
      ];

      const { data: categories } = await supabase
        .from("provider_categories")
        .select("id, name")
        .in("id", categoryIds);

      // Create category map
      const categoryMap: Record<string, string> = (
        (categories || []) as ProviderCategory[]
      ).reduce((map: Record<string, string>, category: ProviderCategory) => {
        map[category.id] = category.name;
        return map;
      }, {});

      // First transformation
      const expenses: Expense[] = directData.map((expense) => {
        const provider = expense.provider_id
          ? providerMap[expense.provider_id]
          : null;

        const providerName = provider ? provider.name : "General";
        const categoryId = provider ? provider.provider_category_id : null;
        const providerCategory = categoryId
          ? categoryMap[categoryId]
          : "General";

        return {
          id: expense.id,
          amount: expense.amount,
          provider_name: providerName,
          created_at: expense.created_at,
          description: expense.description,
          building_id: expense.building_id,
          building_address:
            buildingMap[expense.building_id] || "Unknown Building",
          provider_id: expense.provider_id,
          provider_category: providerCategory,
          expense_reporting_month: expense.expense_reporting_month,
        };
      });

      return NextResponse.json({ expenses });
    } else {
      // Return empty expenses array if no data was found
      return NextResponse.json({ expenses: [] });
    }
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
