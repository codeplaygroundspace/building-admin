import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchExpenses } from "../helpers/fetchExpenses";
import { calcTotalExpenses } from "../helpers/calcTotalExpenses";
import { Expense, DashboardData } from "../types/expense";

export const useExpenses = (
  selectedMonth: string | null,
  buildingId?: string
) => {
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [displayMonth, setDisplayMonth] = useState<string | null>(null);

  // Fetch all expenses initially (for backward compatibility)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Pass building ID when fetching all expenses
        await fetchExpenses({ buildingId });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [buildingId]);

  // Fetch expenses for the selected month
  useEffect(() => {
    if (selectedMonth) {
      const fetchMonthData = async () => {
        try {
          setLoading(true);

          // Calculate the display month (previous month)
          const selectedMonthDate = dayjs(selectedMonth, "MMMM YYYY");
          const previousMonthDate = selectedMonthDate.subtract(1, "month");
          const displayMonthString = previousMonthDate.format("MMMM YYYY");
          setDisplayMonth(displayMonthString);

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
      setDisplayMonth(null);
    }
  }, [selectedMonth, buildingId]);

  const totalExpenses = calcTotalExpenses({ expenses: filteredExpenses });

  return {
    filteredExpenses,
    totalExpenses,
    loading,
    error,
    displayMonth,
  };
};
