import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";

export async function GET() {
  try {
    // More efficient query with only the needed fields
    const { data, error } = await supabase
      .from("providers")
      .select("id, name, provider_category_id")
      .order("name");

    if (error) {
      console.error("Error fetching providers:", error);
      return NextResponse.json(
        { error: `Error fetching providers: ${error.message}` },
        { status: 500 }
      );
    }

    // Also get provider categories for a better user experience
    const { data: categories, error: categoriesError } = await supabase
      .from("provider_categories")
      .select("id, name");

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      // Continue with providers only
    }

    const result = {
      providers: data || [],
      categories: categories || [],
    };

    // Cache the response for 15 minutes (providers change less frequently)
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=900", // 15 minutes
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err) {
    console.error("Error processing providers request:", err);
    return NextResponse.json(
      { error: "Error processing providers request" },
      { status: 500 }
    );
  }
}
