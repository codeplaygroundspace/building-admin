/**
 * Expense Data Fetching Module
 *
 * This module provides functions for fetching expense data from the API with
 * various filtering options and error handling.
 *
 * Key features:
 * - Support for filtering by month, building, or both
 * - Optional inclusion of previous month's data for comparison
 * - Detailed console logging for debugging
 *
 * FILTERING BEHAVIOR:
 * - Expense months are stored in YYYY-MM format (e.g., "2025-04" for April 2025)
 * - The filtering uses expense_reporting_month field
 *
 * Usage examples:
 *
 * // Fetch all expenses
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
import { getBaseUrl } from "@/lib/utils";

export interface FetchExpensesOptions {
  month?: string | null;
  buildingId?: string;
  forDropdown?: boolean;
}

export const fetchExpenses = async (
  options: FetchExpensesOptions = {}
): Promise<DashboardData> => {
  const { month, buildingId, forDropdown } = options;

  // Create absolute URL for API endpoint
  const baseUrl = getBaseUrl();
  let url = `${baseUrl}/api/expenses`;
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

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // Disable cache for debugging
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Response details:`, errorText);
      // Return empty data instead of throwing
      return { expenses: [], ...(forDropdown ? { months: [] } : {}) };
    }

    console.log("API response received, parsing JSON");
    const data = await response.json();

    // Handle dropdown request
    if (forDropdown) {
      if (data.months && Array.isArray(data.months)) {
        console.log(`Received ${data.months.length} months`);
        return { expenses: [], months: data.months };
      } else {
        console.warn("Invalid months format received from API:", data);
        return { expenses: [], months: [] };
      }
    }

    // Handle regular expenses request
    if (data.expenses && Array.isArray(data.expenses)) {
      console.log(`Received ${data.expenses.length} expenses`);
      return { expenses: data.expenses };
    }

    // If data doesn't have the expected format, log a warning and return empty arrays
    console.warn("Invalid data format received from API:", data);
    return { expenses: [] };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    // Return empty data on any exception
    return { expenses: [], ...(forDropdown ? { months: [] } : {}) };
  }
};
