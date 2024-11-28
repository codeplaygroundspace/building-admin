import { supabase } from "../supabase/supabaseClient";

// Declares a TypeScript interface to represent the structure of an expense object as stored in the expense table.
interface Expense {
  id: number;
  category_name: string;
  description: string;
  amount: number;
  colour: string;
  created_at: string | null;
}

// Define the combined data type, an array of Expense objects. expenses: [{},{}]
export interface DashboardData {
  expenses: Expense[];
}

/**
 * Fetches expense data from Supabase
 * @returns {Promise<DashboardData>} Object containing expenses array
 * @throws {Error} If database query fails
 */
export async function fetchData(): Promise<DashboardData> {
  try {
    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Better debugging with formatted output
    console.log("dd", expenses);

    return {
      // Return {key:pair} object or empty array
      expenses: expenses || [],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
