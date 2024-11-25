import { supabase } from "../supabase/supabaseClient";

// Define types for your tables
interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  created_at: string;
}

// Define the combined data type
export interface DashboardData {
  expenses: Expense[];
}

// Fetch data from multiple tables
export async function fetchData(): Promise<DashboardData> {
  const expensesPromise = supabase
    .from("expenses")
    .select("*")
    .order("created_at", { ascending: false });
  console.log(expensesPromise);
  // Fetch both tables concurrently
  const [{ data: expenses, error: expensesError }] = await Promise.all([
    expensesPromise,
  ]);
  console.log(expenses);

  // Handle errors
  if (expensesError) {
    throw new Error(`Failed to fetch expenses: ${expensesError.message}`);
  }

  // Return the combined data
  return {
    expenses: expenses || [],
  };
}
