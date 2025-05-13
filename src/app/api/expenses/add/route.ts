import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseClient";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const expenseData = await request.json();

    // Validate required fields
    if (!expenseData.amount || !expenseData.building_id) {
      return NextResponse.json(
        {
          error: "Missing required fields: amount or building_id",
        },
        { status: 400 }
      );
    }

    // Format amount as a number
    const amount =
      typeof expenseData.amount === "string"
        ? parseFloat(expenseData.amount)
        : expenseData.amount;

    // Check that amount is a valid number
    if (isNaN(amount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number" },
        { status: 400 }
      );
    }

    // Prepare the expense record
    const expenseRecord = {
      description: expenseData.description || null,
      amount: amount,
      building_id: expenseData.building_id,
      provider_id: expenseData.provider_id || null, // Use the provider_id from the form
      expense_reporting_month: expenseData.expense_reporting_month || null,
    };

    console.log("Creating expense with data:", expenseRecord);

    // Insert the expense into the database
    const { data, error } = await supabase
      .from("expenses")
      .insert(expenseRecord)
      .select();

    if (error) {
      console.error("Error inserting expense:", error);

      return NextResponse.json(
        { error: `Error inserting expense: ${error.message}` },
        { status: 500 }
      );
    }

    // Return the newly created expense
    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
      expense: data[0],
    });
  } catch (err) {
    console.error("Error processing add expense request:", err);

    return NextResponse.json(
      { error: "Error processing add expense request" },
      { status: 500 }
    );
  }
}
