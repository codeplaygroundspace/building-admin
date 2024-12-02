import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../supabase/supabaseClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json({ error: "Month is required" }, { status: 400 }); // Return error if month is not provided
  }

  const year = 2024; // Adjust dynamically if needed
  const date = new Date(`${month} 1, ${year}`);
  const startOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1
  ).toISOString();
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    0,
    23,
    59,
    59
  ).toISOString();

  console.log({ startOfMonth, endOfMonth });

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }

  // Better debugging with formatted output
  console.log("dd", expenses);
  console.log("Start of Month:", startOfMonth);
  console.log("End of Month:", endOfMonth);

  return NextResponse.json({ expenses: expenses || [] });
}
