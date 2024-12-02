import { supabase } from "../../supabase/supabaseClient";
import { DashboardData } from "../definitions";

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
