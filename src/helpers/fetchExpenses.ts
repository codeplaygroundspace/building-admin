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
 * FILTERING BEHAVIOR:
 * - Expense months are stored in YYYY-MM format (e.g., "2025-04" for April 2025)
 * - The filtering uses expense_reporting_month field
 *
 * Usage examples:
 *
 * // Fetch all expenses (with caching)
 * const data = await fetchExpenses();
 *
 * // Fetch expenses for a specific month
 * const aprilData = await fetchExpenses({ month: "2025-04" });
 *
 * // Fetch expenses for a specific building
 * const buildingData = await fetchExpenses({ buildingId: "building-uuid" });
 *
 * // Fetch expenses for a specific month and building
 * const filteredData = await fetchExpenses({
 *   month: "2025-04",
 *   buildingId: "building-uuid"
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
      provider_name: "General",
      provider_category: "Sin categoría",
      created_at: new Date().toISOString(),
      description: "Fallback data",
      building_id: "cd4d2980-8c5e-444e-9840-6859582c0ea5",
      building_address: "Ejido 123",
      expense_reporting_month: dayjs().format("YYYY-MM"),
    },
  ],
};

interface FetchExpensesOptions {
  month?: string;
  buildingId?: string;
  forDropdown?: boolean;
}

export const fetchExpenses = async (
  options: FetchExpensesOptions = {}
): Promise<DashboardData> => {
  const { month, buildingId, forDropdown } = options;

  // Only use cache if not specifying a month and we have cached data
  if (!month && cachedExpenses && !buildingId && !forDropdown) {
    console.log("Using cached expenses");
    return cachedExpenses;
  }

  // If we're requesting the same month that's cached, return cached data
  if (
    month &&
    month === cachedMonth &&
    cachedExpenses &&
    !buildingId &&
    !forDropdown
  ) {
    console.log(`Using cached expenses for month: ${month}`);
    return cachedExpenses;
  }

  try {
    // Start with relative path for API endpoint
    let url = "/api/expenses";
    const params = new URLSearchParams();

    console.log(`Fetching expenses with options:`, JSON.stringify(options));

    if (month) {
      // Use the YYYY-MM format directly
      params.append("month", month);
      console.log(`Month parameter: ${month}`);
    }

    if (buildingId) {
      params.append("building_id", buildingId);
      console.log(`Building ID parameter: ${buildingId}`);
    }

    if (forDropdown) {
      params.append("forDropdown", "true");
      console.log("Fetching all months for dropdown");
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

    // Only cache if not specifying a month or building and not for dropdown
    if (!month && !buildingId && !forDropdown) {
      cachedExpenses = data;
      console.log("Caching all expenses");
    }

    // Save which month was cached
    if (month && !buildingId && !forDropdown) {
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
