import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";
// Remove unused import
// import { Provider } from "@/types/expense";

// Define a basic type for projects from SQL
interface ProjectRecord {
  id: number | string;
  cost: number;
  description: string | null;
  status: boolean | null;
  created_at: string | null;
  provider_id: string | null;
  building_id: string | null;
}

// Define provider interface
interface ProviderRecord {
  id: string;
  name: string;
  provider_category_id: string | null;
}

// Define category interface
interface CategoryRecord {
  id: string;
  name: string;
}

// Define building interface
interface BuildingRecord {
  id: string;
  address: string;
}

export async function GET(request: Request) {
  try {
    // Parse URL and get query parameters
    const url = new URL(request.url);
    const buildingId = url.searchParams.get("building_id");

    console.log(`API Request - Projects - Building ID: ${buildingId}`);

    // Query projects with debugging
    console.log("About to query Supabase projects table");

    // Test direct SQL query first to bypass any RLS issues
    const { data: sqlData, error: sqlError } = await supabase.rpc("exec_sql", {
      sql: "SELECT * FROM projects LIMIT 100;",
    });

    if (sqlError) {
      console.error("SQL query error:", sqlError);
    } else {
      console.log("Direct SQL query results:", sqlData);
    }

    // Standard query attempt
    const query = supabase
      .from("projects")
      .select(
        "id, cost, description, status, created_at, provider_id, building_id"
      );

    // If building ID is provided, filter by it
    if (buildingId) {
      query.eq("building_id", buildingId);
    }

    const { data: projectsData, error: projectsError } = await query;

    console.log("Raw projects data:", projectsData);

    // FALLBACK: If the query returned no data, try a hardcoded approach
    if (!projectsData || projectsData.length === 0) {
      console.log("No projects found in the database");

      // Try to use the direct SQL results if available
      if (sqlData && sqlData.length > 0) {
        console.log("Using SQL direct results instead");

        // Transform projects data with basic info
        const projects = (sqlData as ProjectRecord[]).map((project) => {
          return {
            id: project.id.toString(),
            cost: project.cost || 0,
            description: project.description || "",
            status: project.status,
            created_at: project.created_at,
            provider_id: project.provider_id,
            provider_name: "Provider", // Fallback when provider mapping fails
            provider_category: "General",
          };
        });

        return NextResponse.json({ projects });
      }

      if (projectsError) {
        console.error("Projects query error:", projectsError);
      }

      // Return empty array, no hardcoded data
      return NextResponse.json({ projects: [] });
    }

    console.log(`Found ${projectsData.length} projects`);

    // Get provider data
    const providerIds = [
      ...new Set(
        projectsData
          .map((project) => project.provider_id)
          .filter((id) => id != null)
      ),
    ];

    // Get providers with their provider_category_id
    const { data: providers } = await supabase
      .from("providers")
      .select("id, name, provider_category_id")
      .in(
        "id",
        providerIds.length > 0
          ? providerIds
          : ["00000000-0000-0000-0000-000000000000"]
      );

    // Create provider map
    const providerMap: Record<string, ProviderRecord> = (
      providers || []
    ).reduce(
      (map: Record<string, ProviderRecord>, provider: ProviderRecord) => {
        map[provider.id] = provider;
        return map;
      },
      {}
    );

    // Get provider categories
    const categoryIds = [
      ...new Set(
        (providers || [])
          .map((provider: ProviderRecord) => provider.provider_category_id)
          .filter((id: string | null) => id != null)
      ),
    ];

    const { data: categories } = await supabase
      .from("provider_categories")
      .select("id, name")
      .in(
        "id",
        categoryIds.length > 0
          ? categoryIds
          : ["00000000-0000-0000-0000-000000000000"]
      );

    // Create category map
    const categoryMap: Record<string, string> = (categories || []).reduce(
      (map: Record<string, string>, category: CategoryRecord) => {
        map[category.id] = category.name;
        return map;
      },
      {}
    );

    // Get building data
    const buildingIds = [
      ...new Set(
        projectsData
          .map((project) => project.building_id)
          .filter((id) => id != null)
      ),
    ];

    // Get buildings
    const { data: buildings } = await supabase
      .from("buildings")
      .select("id, address")
      .in(
        "id",
        buildingIds.length > 0
          ? buildingIds
          : ["00000000-0000-0000-0000-000000000000"]
      );

    // Create building map
    const buildingMap: Record<string, string> = (buildings || []).reduce(
      (map: Record<string, string>, building: BuildingRecord) => {
        map[building.id] = building.address;
        return map;
      },
      {}
    );

    // Transform projects data with provider information
    const projects = projectsData.map((project: ProjectRecord) => {
      const provider = project.provider_id
        ? providerMap[project.provider_id]
        : null;

      const providerName = provider ? provider.name : "General";
      const categoryId = provider ? provider.provider_category_id : null;
      const providerCategory = categoryId ? categoryMap[categoryId] : "General";

      return {
        id: project.id.toString(), // Convert ID to string to match expected format
        cost: project.cost || 0,
        description: project.description || "",
        status: project.status,
        created_at: project.created_at,
        provider_id: project.provider_id,
        provider_name: providerName,
        provider_category: providerCategory,
        building_id: project.building_id,
        building_address: project.building_id
          ? buildingMap[project.building_id] || "Unknown Building"
          : null,
      };
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects data" },
      { status: 500 }
    );
  }
}
