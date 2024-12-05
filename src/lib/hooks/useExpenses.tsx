import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { fetchExpenses } from "../../lib/expensesService";
import { calcTotalExpenses } from "../calcTotalExpensesUtils";
import { Expense, DashboardData } from "../types";

export const useExpenses = (selectedMonth: string | null) => {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: DashboardData = await fetchExpenses();
        setAllExpenses(data.expenses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const currentMonth = dayjs(selectedMonth, "MMMM YYYY").startOf("month");
      const previousMonth = currentMonth.subtract(1, "month");

      const filtered = allExpenses.filter((expense) => {
        const expenseDate = dayjs(expense.created_at).startOf("month");
        return (
          expenseDate.isSame(currentMonth, "month") ||
          expenseDate.isSame(previousMonth, "month")
        );
      });

      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses([]);
    }
  }, [selectedMonth, allExpenses]);

  const totalExpenses = calcTotalExpenses({ expenses: filteredExpenses });

  return { filteredExpenses, totalExpenses, loading, error };
};
