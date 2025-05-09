/**
 * Expense Data Fetching Module
 *
 * This module provides functions for fetching expense data from the API with
 * various filtering options, caching, and error handling.
 *
 * Key features:
 * - Client-side caching to reduce redundant API calls
 * - Support for filtering by month, building, or both
 * - Optional inclusion of previous month's data for comparison
 * - Fallback data mechanism for error resilience
 * - Detailed console logging for debugging
 *
 * IMPORTANT FILTERING BEHAVIOR:
 * - When a month is specified, the app actually shows data from the PREVIOUS month
 * - For example, passing { month: "March 2023" } shows data from February 2023
 * - The filtering uses date_from and date_to fields, not created_at
 * - Expenses are included if their date range overlaps with the target month
 *
 * Usage examples:
 *
 * // Fetch all expenses (with caching)
 * const data = await fetchExpenses();
 *
 * // Fetch expenses for a specific month
 * // Note: This will return data from January 2023, not February 2023
 * const februaryData = await fetchExpenses({ month: "February 2023" });
 *
 * // Fetch expenses for a specific building
 * const buildingData = await fetchExpenses({ buildingId: "building-uuid" });
 *
 * // Fetch expenses for a specific month and building without previous month data
 * const filteredData = await fetchExpenses({
 *   month: "March 2023",
 *   buildingId: "building-uuid",
 *   previousMonth: false
 * });
 */

import { DashboardData } from "@/types/expense";
import dayjs from "dayjs";

let cachedExpenses: DashboardData | null = null;
let cachedMonth: string | null = null;

// Fallback data in case the API fails
const fallbackData: DashboardData = {
  expenses: [
    {
      id: "fallback-1",
      amount: 0,
      category_name: "Sin categoría",
      created_at: new Date().toISOString(),
      description: "Fallback data",
      building_id: "cd4d2980-8c5e-444e-9840-6859582c0ea5",
      building_address: "Ejido 123",
    },
  ],
};

interface FetchExpensesOptions {
  month?: string;
  previousMonth?: boolean;
  buildingId?: string;
}

export const fetchExpenses = async (
  options: FetchExpensesOptions = {}
): Promise<DashboardData> => {
  const { month, previousMonth = true, buildingId } = options;

  // Only use cache if not specifying a month and we have cached data
  if (!month && cachedExpenses && !buildingId) {
    console.log("Using cached expenses");
    return cachedExpenses;
  }

  // If we're requesting the same month that's cached, return cached data
  if (month && month === cachedMonth && cachedExpenses && !buildingId) {
    console.log(`Using cached expenses for month: ${month}`);
    return cachedExpenses;
  }

  try {
    // Start with relative path for API endpoint
    let url = "/api/expenses";
    const params = new URLSearchParams();

    console.log(`Fetching expenses with options:`, JSON.stringify(options));

    if (month) {
      // Convert from "Month YYYY" format to "YYYY-MM" format for API
      const monthDate = dayjs(month, "MMMM YYYY");
      const formattedMonth = monthDate.format("YYYY-MM");
      params.append("month", formattedMonth);
      console.log(`Month parameter: ${month} -> ${formattedMonth}`);

      // Whether to fetch previous month's expenses
      if (previousMonth) {
        params.append("previousMonth", "true");
        console.log("Including previousMonth=true parameter");
      }
    }

    if (buildingId) {
      params.append("building_id", buildingId);
      console.log(`Building ID parameter: ${buildingId}`);
    }

    // Append params to URL if there are any
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // Disable cache for debugging
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      console.error(`Response details:`, await response.text());
      throw new Error(`Error fetching expenses: ${response.statusText}`);
    }

    console.log("API response received, parsing JSON");
    const data: DashboardData = await response.json();
    console.log(`Received ${data.expenses?.length || 0} expenses`);

    if (!data.expenses || !Array.isArray(data.expenses)) {
      console.error("Invalid data format received from API:", data);
      throw new Error("Invalid data format received from API");
    }

    // Only cache if not specifying a month or building
    if (!month && !buildingId) {
      cachedExpenses = data;
      console.log("Caching all expenses");
    }

    // Save which month was cached
    if (month && !buildingId) {
      cachedMonth = month;
      cachedExpenses = data;
      console.log(`Caching expenses for month: ${month}`);
    }

    return data;
  } catch (error) {
    console.error("Error in fetchExpenses:", error);
    console.warn("Using fallback data due to error");

    // Use fallback data if API call fails
    return fallbackData;
  }
};
