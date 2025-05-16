import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";

export async function GET() {
  try {
    console.log("API Request - Providers");

    // Query without joined data to simplify the response structure
    const { data, error } = await supabase
      .from("providers")
      .select("id, name, provider_category_id")
      .order("name");

    if (error) {
      console.error("Error fetching providers:", error);
      return NextResponse.json(
        { error: `Error fetching providers: ${error.message}`, providers: [] },
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

    // Since we're not joining provider_categories, just provide a default category_name
    const transformedProviders = data.map((provider) => ({
      id: provider.id,
      name: provider.name,
      provider_category_id: provider.provider_category_id,
      category_name: "General", // Default category name - simpler than joining
    }));

    console.log(
      `Successfully fetched ${transformedProviders.length || 0} providers`
    );

    // Cache the response for 5 minutes
    return NextResponse.json(
      { providers: transformedProviders || [] },
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
    console.error("Error processing providers request:", err);
    return NextResponse.json(
      { error: "Error processing providers request", providers: [] },
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
