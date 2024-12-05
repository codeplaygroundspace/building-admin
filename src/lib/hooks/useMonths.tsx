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

        console.log("Fetched data in useMonths hook file 🟢:", data);

        // Extract unique ISO months
        const uniqueMonths = Array.from(
          new Set(
            data.expenses
              .filter((expense) => expense.created_at !== null)
              .map((expense: Expense) =>
                dayjs(expense.created_at).startOf("month").toISOString()
              )
          )
        ).sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1));

        // Map the unique ISO months to display-friendly format
        const displayUniqueMonths = uniqueMonths.map((isoDate) =>
          dayjs(isoDate).format("MMMM YYYY")
        );

        setMonths(displayUniqueMonths);
      } catch (error) {
        setError("Failed to load months. Please try again later.");
        console.error(error);
      }
    };

    fetchMonths();
  }, []);

  return { months, error };
};
