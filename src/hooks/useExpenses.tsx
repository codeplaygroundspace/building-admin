import { useState, useEffect } from "react";
import { Expense, DashboardData } from "@/types/expense";
import { fetchExpenses } from "../helpers/fetchExpenses";
import { calcTotalExpenses } from "../helpers/calcTotalExpenses";
import dayjs from "dayjs";
import { useMonth } from "@/contexts/month-context";

// Custom hook to fetch and filter expenses by selected month
export const useExpenses = (
  selectedMonth: string | null,
  buildingId?: string
) => {
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { displayMonth } = useMonth();

  // Fetch expenses for the selected month
  useEffect(() => {
    if (selectedMonth && displayMonth) {
      const fetchMonthData = async () => {
        try {
          setLoading(true);

          // Fetch all expenses for this building
          const data: DashboardData = await fetchExpenses({
            buildingId,
          });

          // Convert displayMonth from "Month YYYY" to "YYYY-MM" format for comparison
          const displayMonthDate = dayjs(displayMonth, "MMMM YYYY");
          const formattedDisplayMonth = displayMonthDate.format("YYYY-MM");

          // Filter expenses by display month using expense_reporting_month field
          const filteredByMonth = data.expenses.filter(
            (expense) =>
              expense.expense_reporting_month === formattedDisplayMonth
          );

          console.log(
            `Filtered ${data.expenses.length} expenses to ${filteredByMonth.length} for month ${displayMonth} (${formattedDisplayMonth})`
          );

          setFilteredExpenses(filteredByMonth);
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
  }, [selectedMonth, buildingId, displayMonth]);

  const totalExpenses = calcTotalExpenses({ expenses: filteredExpenses });

  return {
    filteredExpenses,
    totalExpenses,
    loading,
    error,
  };
};
