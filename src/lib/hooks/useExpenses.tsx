import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DashboardData, Expense } from "../../lib/definitions";
import { calcTotalExpenses } from "../../lib/calcTotalExpenses";

export const useExpenses = (selectedMonth: string | null) => {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Handle errors gracefully

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error("Error fetching expenses");
        }

        const data: DashboardData = await response.json();
        console.log("Fetched expenses in useExpenses hook 🔴:", data);

        setAllExpenses(data.expenses);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error fetching expenses:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      // Normalize selectedMonth for filtering
      const currentMonth = dayjs(selectedMonth, "MMMM YYYY").startOf("month");
      const previousMonth = currentMonth.subtract(1, "month");

      console.log(
        "Selected Month (Current):",
        currentMonth.format("MMMM YYYY")
      );
      console.log(
        "Selected Month (Previous):",
        previousMonth.format("MMMM YYYY")
      );

      const filtered = allExpenses.filter((expense) => {
        const expenseDate = dayjs(expense.created_at).startOf("month");
        return (
          expenseDate.isSame(currentMonth, "month") ||
          expenseDate.isSame(previousMonth, "month")
        );
      });

      console.log("Filtered Expenses 🟢:", filtered);
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses([]);
    }
  }, [selectedMonth, allExpenses]);

  const totalExpenses = calcTotalExpenses({ expenses: filteredExpenses });

  return { filteredExpenses, totalExpenses, loading, error };
};
