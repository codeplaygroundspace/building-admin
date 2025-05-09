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
      category: "Fallback",
      created_at: new Date().toISOString(),
      description: "Fallback data",
      building_id: "b5097257-046d-409d-ad44-c68efa4f1081",
      building_address: "Edificio (datos de respaldo)",
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
    return cachedExpenses;
  }

  // If we're requesting the same month that's cached, return cached data
  if (month && month === cachedMonth && cachedExpenses && !buildingId) {
    return cachedExpenses;
  }

  try {
    let url = "/api/expenses";
    const params = new URLSearchParams();

    if (month) {
      // Convert from "Month YYYY" format to "YYYY-MM" format for API
      const monthDate = dayjs(month, "MMMM YYYY");
      params.append("month", monthDate.format("YYYY-MM"));

      // Whether to fetch previous month's expenses
      if (previousMonth) {
        params.append("previousMonth", "true");
      }
    }

    if (buildingId) {
      params.append("building_id", buildingId);
    }

    // Append params to URL if there are any
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`Error fetching expenses: ${response.statusText}`);
    }

    const data: DashboardData = await response.json();

    if (!data.expenses || !Array.isArray(data.expenses)) {
      console.error("Invalid data format received from API:", data);
      throw new Error("Invalid data format received from API");
    }

    // Only cache if not specifying a month or building
    if (!month && !buildingId) {
      cachedExpenses = data;
    }

    // Save which month was cached
    if (month && !buildingId) {
      cachedMonth = month;
      cachedExpenses = data;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchExpenses:", error);

    // Use fallback data if API call fails
    return fallbackData;
  }
};
