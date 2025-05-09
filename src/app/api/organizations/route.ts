import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";

export async function GET(request: Request) {
  try {
    // Get the building ID from the query string if provided
    const url = new URL(request.url);
    const buildingId = url.searchParams.get("id");

    let query = supabase.from("buildings").select("*");

    // If an ID is provided, filter to just that building
    if (buildingId) {
      query = query.eq("id", buildingId);
    }

    const { data: buildings, error } = await query;

    if (error) {
      console.error("Error fetching buildings:", error);
      return NextResponse.json(
        { error: "Error fetching buildings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ organizations: buildings || [] });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error processing request:", err.message);
      return NextResponse.json(
        { error: "Error processing request" },
        { status: 500 }
      );
    } else {
      console.error("Unknown error occurred:", err);
      return NextResponse.json(
        { error: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
