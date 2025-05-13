import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";

export async function GET() {
  try {
    // Get all providers
    const { data: providers, error } = await supabase
      .from("providers")
      .select("id, name, provider_category_id, provider_categories(id, name)")
      .order("name");

    if (error) {
      console.error("Error fetching providers:", error);
      return NextResponse.json(
        { error: `Error fetching providers: ${error.message}` },
        { status: 500 }
      );
    }

    // Format the response safely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedProviders = (providers || []).map((provider: any) => {
      let categoryName = "Uncategorized";

      // Handle both possible structures that Supabase might return
      if (provider.provider_categories) {
        if (
          Array.isArray(provider.provider_categories) &&
          provider.provider_categories.length > 0
        ) {
          // If it's an array, take the first item's name
          categoryName =
            provider.provider_categories[0].name || "Uncategorized";
        } else if (
          typeof provider.provider_categories === "object" &&
          provider.provider_categories.name
        ) {
          // If it's an object with name property
          categoryName = provider.provider_categories.name;
        }
      }

      return {
        id: provider.id,
        name: provider.name,
        category_id: provider.provider_category_id,
        category_name: categoryName,
      };
    });

    return NextResponse.json({ providers: formattedProviders });
  } catch (err) {
    console.error("Error processing providers request:", err);
    return NextResponse.json(
      { error: "Error processing providers request" },
      { status: 500 }
    );
  }
}
