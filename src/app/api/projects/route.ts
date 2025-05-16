import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";

export async function GET(request: Request) {
  try {
    // Parse URL and get query parameters
    const url = new URL(request.url);
    const buildingId = url.searchParams.get("building_id");

    console.log(`API Request - Projects - Building ID: ${buildingId}`);

    // Standard query attempt
    let query = supabase.from("projects").select("*");

    // If building ID is provided, filter by it
    if (buildingId) {
      query = query.eq("building_id", buildingId);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json(
        { error: `Error fetching projects: ${error.message}`, projects: [] },
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

    console.log(`Successfully fetched ${projects?.length || 0} projects`);

    // Cache the response for 5 minutes
    return NextResponse.json(
      { projects: projects || [] },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // 5 minutes
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects data", projects: [] },
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
