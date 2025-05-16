import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";

interface Category {
  id: string;
  name: string;
}

export async function GET() {
  try {
    // Get all providers
    const { data: providers, error } = await supabase
      .from("providers")
      .select("id, name, provider_category_id");

    if (error) {
      console.error("Error fetching providers:", error);
      return NextResponse.json(
        { error: `Error fetching providers: ${error.message}` },
        { status: 500 }
      );
    }

    // Get all categories for reference
    const { data: categories, error: categoriesError } = await supabase
      .from("provider_categories")
      .select("id, name");

    if (categoriesError) {
      console.error("Error fetching provider categories:", categoriesError);
    }

    // Create a map of category IDs to names
    const categoryMap: Record<string, string> = {};
    if (categories) {
      (categories as Category[]).forEach((category) => {
        categoryMap[category.id] = category.name;
      });
    }

    // Format the response safely
    const formattedProviders = (providers || []).map((provider) => {
      return {
        id: provider.id,
        name: provider.name,
        category_id: provider.provider_category_id,
        category_name:
          provider.provider_category_id &&
          categoryMap[provider.provider_category_id]
            ? categoryMap[provider.provider_category_id]
            : "Uncategorized",
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
