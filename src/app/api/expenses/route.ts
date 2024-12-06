import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase/supabaseClient";

export async function GET() {
  try {
    // Fetch data from the "expenses" table Supabase
    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
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
