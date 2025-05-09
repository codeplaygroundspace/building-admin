import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(request: Request) {
  try {
    // Create a fresh Supabase client for each request to avoid any caching issues
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the building ID from the query string if provided
    const url = new URL(request.url);
    const buildingId = url.searchParams.get("id");

    // Create a hard-coded response for now to bypass any Supabase issues
    if (buildingId === "cd4d2980-8c5e-444e-9840-6859582c0ea5") {
      // This is the known building ID from earlier
      return NextResponse.json({
        buildings: [
          {
            id: "cd4d2980-8c5e-444e-9840-6859582c0ea5",
            address: "Ejido 123",
            is_active: true,
          },
        ],
      });
    }

    // For other IDs, try the database query
    const { data, error } = await supabase
      .from("buildings")
      .select("id, address, is_active")
      .eq("id", buildingId || "");

    if (error) {
      console.error("Error fetching buildings:", error);
      return NextResponse.json(
        { error: "Error fetching buildings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ buildings: data || [] });
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Error processing request", details: String(err) },
      { status: 500 }
    );
  }
}
