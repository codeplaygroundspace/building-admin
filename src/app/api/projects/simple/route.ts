import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseClient";

// Define provider interface
interface Provider {
  id: string;
  name: string;
  provider_category_id?: string;
  provider_categories?: { name: string } | Array<{ name: string }>;
}

// Define project interface
interface Project {
  id: string | number;
  provider_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

export async function GET() {
  try {
    console.log("Simple projects API called");

    // Direct SQL for fetching all projects
    const { data: sqlData, error: sqlError } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT p.*, pr.name as provider_name, pc.name as provider_category 
        FROM projects p
        LEFT JOIN providers pr ON p.provider_id = pr.id
        LEFT JOIN provider_categories pc ON pr.provider_category_id = pc.id
        LIMIT 100;
      `,
    });

    if (sqlError) {
      console.error("SQL error:", sqlError);

      // Fallback to regular query
      console.log("Trying regular query as fallback");
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .limit(10);

      if (error) {
        console.error("Regular query error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Get all provider IDs from projects
      const providerIds = data.map((p) => p.provider_id).filter((id) => !!id);

      // Get all providers in a single query
      const { data: providers } = await supabase
        .from("providers")
        .select("id, name, provider_category_id, provider_categories(id, name)")
        .in(
          "id",
          providerIds.length > 0
            ? providerIds
            : ["00000000-0000-0000-0000-000000000000"]
        );

      // Create a map of providers for faster lookup
      const providerMap = (providers || []).reduce(
        (
          map: Record<string, { name: string; category: string }>,
          provider: Provider
        ) => {
          // Get the category name, handling different possible structures
          let categoryName = "Unknown";
          const providerCategories = provider.provider_categories;

          if (providerCategories) {
            if (
              typeof providerCategories === "object" &&
              !Array.isArray(providerCategories)
            ) {
              // Direct object reference
              categoryName = providerCategories.name || "Unknown";
            } else if (
              Array.isArray(providerCategories) &&
              providerCategories.length > 0
            ) {
              // Array of categories
              categoryName = providerCategories[0].name || "Unknown";
            }
          }

          map[provider.id] = {
            name: provider.name,
            category: categoryName,
          };
          return map;
        },
        {}
      );

      // Return basic data with provider information from database
      return NextResponse.json({
        projects: data.map((p: Project) => {
          const provider = p.provider_id ? providerMap[p.provider_id] : null;

          return {
            ...p,
            id: p.id.toString(),
            provider_name: provider?.name || "Unknown",
            provider_category: provider?.category || "Unknown",
          };
        }),
      });
    }

    console.log("SQL data:", sqlData);

    // If we have SQL data, use it
    const projects = (sqlData || []).map((p: Project) => ({
      ...p,
      id: p.id.toString(),
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error in simple projects endpoint:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
