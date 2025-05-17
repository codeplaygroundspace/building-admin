import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/supabaseServer";

// Define interfaces for the data structure from Supabase
interface ProviderCategory {
  name: string;
}

interface Provider {
  name: string;
  provider_category_id: string;
  provider_categories: ProviderCategory | ProviderCategory[] | null;
}

interface RawExpense {
  id: string;
  amount: number;
  description: string;
  created_at: string;
  expense_reporting_month: string;
  building_id: string;
  provider_id: string | null;
  providers: Provider | Provider[] | null;
}

// Define the transformed expense structure
interface TransformedExpense {
  id: string;
  amount: number;
  description: string;
  created_at: string;
  expense_reporting_month: string;
  building_id: string;
  provider_id: string | null;
  provider_name: string;
  provider_category: string;
}

export async function GET(request: Request) {
  try {
    // Get server-side Supabase client
    const supabase = getServerSupabaseClient();

    // Parse URL and get query parameters
    const url = new URL(request.url);
    const buildingId = url.searchParams.get("building_id");
    const month = url.searchParams.get("month");
    const forDropdown = url.searchParams.get("forDropdown") === "true";

    console.log(
      `API Request - Building ID: ${buildingId}, Month: ${month}, forDropdown: ${forDropdown}`
    );

    // For dropdown, just get unique months
    if (forDropdown) {
      const { data, error } = await supabase
        .from("expenses")
        .select("expense_reporting_month")
        .eq("building_id", buildingId || "")
        .order("expense_reporting_month", { ascending: false });

      if (error) {
        console.error("Error fetching months:", error);
        return NextResponse.json(
          { error: `Error fetching months: ${error.message}`, months: [] },
          {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      }

      // Extract unique months
      const uniqueMonths = [
        ...new Set(
          (data || [])
            .map((item) => item.expense_reporting_month)
            .filter(Boolean)
        ),
      ];

      console.log(`Returning ${uniqueMonths.length} unique months`);

      return NextResponse.json(
        { months: uniqueMonths },
        {
          headers: {
            "Cache-Control": "public, max-age=300", // 5 minutes
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Standard expenses query with joined provider data
    let query = supabase.from("expenses").select(`
        id, 
        amount, 
        description, 
        created_at, 
        expense_reporting_month, 
        building_id, 
        provider_id,
        providers(
          name,
          provider_category_id,
          provider_categories(name)
        )
      `);

    // Apply filters
    if (buildingId) {
      query = query.eq("building_id", buildingId);
    }

    if (month) {
      query = query.eq("expense_reporting_month", month);
    }

    // Add sorting
    query = query.order("created_at", { ascending: false });

    const { data: rawExpenses, error } = await query;

    if (error) {
      console.error("Error fetching expenses:", error);
      // Return empty array with error for backwards compatibility
      return NextResponse.json(
        { error: `Error fetching expenses: ${error.message}`, expenses: [] },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Transform the data to include provider information
    const expenses = ((rawExpenses as unknown as RawExpense[]) || []).map(
      (expense): TransformedExpense => {
        // Extract provider data safely
        let provider_name = "Desconocida";
        let provider_category = "General";

        try {
          // Handle if providers is null or undefined
          if (expense.providers) {
            // Handle both single object and array cases
            const provider = Array.isArray(expense.providers)
              ? expense.providers[0]
              : expense.providers;

            provider_name = provider?.name || "Desconocida";

            // Handle category - might come from nested providers.provider_categories object
            if (provider?.provider_categories) {
              const categories = provider.provider_categories;
              if (Array.isArray(categories) && categories.length > 0) {
                provider_category = categories[0].name || "General";
              } else if (categories && typeof categories === "object") {
                provider_category =
                  (categories as ProviderCategory).name || "General";
              }
            }
          }
        } catch (err) {
          console.error("Error processing provider data for expense:", err);
        }

        // Return the transformed expense with flattened provider data
        return {
          id: expense.id,
          amount: expense.amount,
          description: expense.description,
          created_at: expense.created_at,
          expense_reporting_month: expense.expense_reporting_month,
          building_id: expense.building_id,
          provider_id: expense.provider_id,
          provider_name,
          provider_category,
        };
      }
    );

    console.log(
      `Successfully fetched and processed ${expenses.length || 0} expenses`
    );

    // Ensure we always return an expenses array for backward compatibility
    return NextResponse.json(
      { expenses: expenses || [] },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // 5 minutes
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {
    console.error("Error processing request:", err);
    // Return empty array with error for backwards compatibility
    return NextResponse.json(
      { error: "Internal server error", expenses: [] },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
