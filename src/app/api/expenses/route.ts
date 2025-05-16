import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";

export async function GET(request: Request) {
  try {
    // Parse URL and get query parameters
    const url = new URL(request.url);
    const buildingId = url.searchParams.get("building_id");
    const month = url.searchParams.get("month");
    const forDropdown = url.searchParams.get("forDropdown") === "true";

    console.log(
      `API Request - Building ID: ${buildingId}, Month: ${month}, forDropdown: ${forDropdown}`
    );

    // More efficient query with only the fields we need
    let query = supabase
      .from("expenses")
      .select(
        "id, amount, description, created_at, expense_reporting_month, building_id, provider_id"
      );

    // If building ID is provided, filter by it
    if (buildingId) {
      query = query.eq("building_id", buildingId);
    }

    // Filter by month if provided
    if (month && !forDropdown) {
      query = query.eq("expense_reporting_month", month);
    }

    // Add order by to get newest expenses first
    query = query.order("created_at", { ascending: false });

    // For dropdown, we may only need unique months
    if (forDropdown) {
      // Get distinct months
      const { data: monthsData, error: monthsError } = await supabase
        .from("expenses")
        .select("expense_reporting_month")
        .eq("building_id", buildingId || "")
        .order("expense_reporting_month", { ascending: false });

      if (monthsError) {
        console.error("Error fetching months:", monthsError);
        return NextResponse.json(
          { error: `Error fetching months: ${monthsError.message}` },
          { status: 500 }
        );
      }

      // Extract unique months
      const uniqueMonths = [
        ...new Set(monthsData.map((item) => item.expense_reporting_month)),
      ];
      return NextResponse.json({ months: uniqueMonths });
    }

    const { data: expenses, error } = await query;

    if (error) {
      console.error("Query error:", error);
      return NextResponse.json(
        { error: `Error fetching expenses: ${error.message}` },
        { status: 500 }
      );
    }

    // Cache the response for 5 minutes
    return NextResponse.json(
      { expenses: expenses || [] },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // 5 minutes
        },
      }
    );
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
