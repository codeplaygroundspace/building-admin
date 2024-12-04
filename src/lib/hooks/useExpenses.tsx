import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DashboardData, Expense } from "../../lib/definitions";
import { calcTotalExpenses } from "../../lib/calcTotalExpenses";

export const useExpenses = (selectedMonth: string | null) => {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error("Error fetching expenses");
        }
        const data: DashboardData = await response.json();
        console.log("Fetched Expenses:", data.expenses);
        setAllExpenses(data.expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const filtered = allExpenses.filter((expense) => {
        const expenseMonth = dayjs(expense.created_at).format("MMMM YYYY");
        const previousMonth = dayjs(selectedMonth)
          .subtract(1, "month")
          .format("MMMM YYYY");

        console.log(
          "Expense Month:",
          expenseMonth,
          "Selected Month:",
          selectedMonth,
          "Previous Month:",
          previousMonth
        );

        return expenseMonth === selectedMonth || expenseMonth === previousMonth;
      });

      console.log("Filtered Expenses:", filtered);
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses([]);
    }
  }, [selectedMonth, allExpenses]);

  const totalExpenses = calcTotalExpenses({ expenses: filteredExpenses });

  return { filteredExpenses, totalExpenses, loading };
};
