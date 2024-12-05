import { useState, useEffect } from "react";
import { DashboardData, Expense } from "../../lib/definitions";
import dayjs from "dayjs";
import { fetchExpenses } from "../../lib/expensesService";

//The useMonths hook now only fetches and provides the months array. The responsibility for setting the default selectedMonth has been moved to the parent component (SelectMonth).

export const useMonths = () => {
  const [months, setMonths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: DashboardData = await fetchExpenses();

        const uniqueMonths = Array.from(
          new Set(
            data.expenses
              .filter((expense: Expense) => expense.created_at !== null)
              .map((expense: Expense) =>
                dayjs(expense.created_at).startOf("month").toISOString()
              )
          )
        ).sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1));

        const displayUniqueMonths = uniqueMonths.map((isoDate) =>
          dayjs(isoDate).format("MMMM YYYY")
        );

        setMonths(displayUniqueMonths);
      } catch (err) {
        setError("Failed to load months. Please try again later.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return { months, error };
};
