import { DashboardData } from "@/types/expense";

let cachedExpenses: DashboardData | null = null;

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

export const fetchExpenses = async (): Promise<DashboardData> => {
  if (cachedExpenses) {
    return cachedExpenses; // Return cached data if available
  }

  try {
    const response = await fetch("/api/expenses");

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`Error fetching expenses: ${response.statusText}`);
    }

    const data: DashboardData = await response.json();

    if (!data.expenses || !Array.isArray(data.expenses)) {
      console.error("Invalid data format received from API:", data);
      throw new Error("Invalid data format received from API");
    }

    cachedExpenses = data; // Cache the data
    return data;
  } catch (error) {
    console.error("Error in fetchExpenses:", error);

    // Use fallback data if API call fails
    return fallbackData;
  }
};
