import { DashboardData } from "./types/expense";

let cachedExpenses: DashboardData | null = null;

export const fetchExpenses = async (): Promise<DashboardData> => {
  if (cachedExpenses) {
    return cachedExpenses; // Return cached data if available
  }

  const response = await fetch("/api/expenses");
  if (!response.ok) {
    throw new Error("Error fetching expenses");
  }

  const data: DashboardData = await response.json();
  cachedExpenses = data; // Cache the data
  return data;
};
