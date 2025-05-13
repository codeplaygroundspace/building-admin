import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseClient";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { expenses } = await request.json();

    // Validate the expenses array
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid request format. Expected an array of expenses.",
        },
        { status: 400 }
      );
    }

    // Validate each expense object
    const validatedExpenses = expenses.map((expense) => {
      // Check required fields
      if (!expense.amount || !expense.building_id) {
        throw new Error("All expenses must have amount and building_id");
      }

      // Format amount as a number
      const amount =
        typeof expense.amount === "string"
          ? parseFloat(expense.amount)
          : expense.amount;

      // Check that amount is a valid number
      if (isNaN(amount)) {
        throw new Error("Amount must be a valid number");
      }

      // Return the validated expense record
      return {
        description: expense.description || null,
        amount: amount,
        building_id: expense.building_id,
        provider_id: expense.provider_id || null,
        provider_name: expense.provider_name || null,
        provider_category: expense.provider_category || null,
        expense_reporting_month: expense.expense_reporting_month || null,
      };
    });

    console.log(`Processing ${validatedExpenses.length} expenses`);

    // Insert all expenses into the database
    const { data, error } = await supabase
      .from("expenses")
      .insert(validatedExpenses)
      .select();

    if (error) {
      console.error("Error inserting expenses:", error);
      return NextResponse.json(
        { error: `Error inserting expenses: ${error.message}` },
        { status: 500 }
      );
    }

    // Return the newly created expenses
    return NextResponse.json({
      success: true,
      message: `${data.length} expenses added successfully`,
      expenses: data,
    });
  } catch (err) {
    console.error("Error processing add bulk expenses request:", err);

    return NextResponse.json(
      {
        error: "Error processing add bulk expenses request",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
