import { useState, useEffect } from "react";
import { DashboardData, Expense } from "../../lib/definitions";
import dayjs from "dayjs";
//The useMonths hook now only fetches and provides the months array. The responsibility for setting the default selectedMonth has been moved to the parent component (SelectMonth).

export const useMonths = () => {
  const [months, setMonths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error("Error fetching months");
        }

        const data: DashboardData = await response.json();

        console.log("Fetched data in useMonths file:", data);

        const uniqueMonths = Array.from(
          new Set(
            data.expenses
              .filter((expense) => expense.created_at !== null)
              .map((expense: Expense) =>
                dayjs(expense.created_at as string).format("MMMM YYYY")
              )
          )
        ).sort((a, b) =>
          dayjs(a, "MMMM YYYY").isAfter(dayjs(b, "MMMM YYYY")) ? 1 : -1
        );

        setMonths(uniqueMonths);
      } catch (error) {
        setError("Failed to load months. Please try again later.");
        console.error(error);
      }
    };

    fetchMonths();
  }, []);

  return { months, error };
};
