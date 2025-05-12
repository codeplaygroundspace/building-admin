import { useState, useEffect } from "react";
import { Expense, DashboardData } from "@/types/expense";
import { fetchExpenses } from "../helpers/fetchExpenses";
import { calcTotalExpenses } from "../helpers/calcTotalExpenses";
import dayjs from "dayjs";

// Custom hook to fetch and filter expenses by selected month
export const useExpenses = (
  selectedMonth: string | null,
  buildingId?: string
) => {
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses for the selected month
  useEffect(() => {
    if (selectedMonth) {
      const fetchMonthData = async () => {
        try {
          setLoading(true);

          // Fetch expenses with the month parameter and building ID
          const data: DashboardData = await fetchExpenses({
            month: selectedMonth,
            previousMonth: true,
            buildingId,
          });

          setFilteredExpenses(data.expenses);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Unknown error occurred"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchMonthData();
    } else {
      setFilteredExpenses([]);
    }
  }, [selectedMonth, buildingId]);

  const totalExpenses = calcTotalExpenses({ expenses: filteredExpenses });

  return {
    filteredExpenses,
    totalExpenses,
    loading,
    error,
  };
};
