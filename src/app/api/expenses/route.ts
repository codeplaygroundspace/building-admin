import { NextResponse } from "next/server";
import { supabase } from "../../../supabase/supabaseClient";

export async function GET() {
  try {
    // Get today's date
    const today = new Date();

    // Calculate start date for the most recent 12 months
    const startOfPeriod = new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      1
    );
    const startOfPeriodISO = startOfPeriod.toISOString();

    // Get the end date, which is the end of the current month
    const endOfPeriod = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59
    );
    const endOfPeriodISO = endOfPeriod.toISOString();

    console.log("Start of 12 months ago:", startOfPeriodISO);
    console.log("End of current month:", endOfPeriodISO);

    // Fetch data from Supabase
    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", startOfPeriodISO)
      .lte("created_at", endOfPeriodISO)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json(
        { error: "Error fetching data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ expenses: expenses || [] });
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
