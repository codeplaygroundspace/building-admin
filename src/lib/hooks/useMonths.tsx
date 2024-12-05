import { useState, useEffect } from "react";
import { DashboardData } from "../types/expense";
import { fetchExpenses } from "../../lib/expensesService";
import { getUniqueMonths } from "../uniqueMonthUtils";

//The useMonths custom hook is designed to fetch and process a list of unique months from the expenses data and make it available to components. The hook returns an array of strings representing the unique months and an error message if the fetch operation fails. The responsibility for setting the default selectedMonth has been moved to the parent component (SelectMonth).

export const useMonths = () => {
  const [months, setMonths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: DashboardData = await fetchExpenses();

        const uniqueMonths = getUniqueMonths(data.expenses);
        setMonths(uniqueMonths);
      } catch (err) {
        setError("Failed to load months. Please try again later.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return { months, error };
};
