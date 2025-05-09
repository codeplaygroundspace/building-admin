import { useState, useEffect } from "react";
import { DashboardData } from "@/types/expense";
import { fetchExpenses } from "@/helpers/fetchExpenses";
import { filterUniqueMonth } from "@/helpers/filterUniqueMonth";
import dayjs from "dayjs";

//The useMonths custom hook is designed to fetch and process a list of unique months from the expenses data and make it available to components. The hook returns an array of strings representing the unique months and an error message if the fetch operation fails. The responsibility for setting the default selectedMonth has been moved to the parent component (SelectMonth).

// Fallback months in case no data is available
const getFallbackMonths = (): string[] => {
  const currentMonth = dayjs().format("MMMM YYYY");
  const lastMonth = dayjs().subtract(1, "month").format("MMMM YYYY");
  return [lastMonth, currentMonth];
};

export const useMonths = () => {
  const [months, setMonths] = useState<string[]>(getFallbackMonths());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data: DashboardData = await fetchExpenses();

        const uniqueMonths = filterUniqueMonth(data.expenses);

        // Only update months if we got valid data
        if (uniqueMonths && uniqueMonths.length > 0) {
          setMonths(uniqueMonths);
        }
      } catch (err) {
        console.error("Error fetching months:", err);
        setError("Failed to load months. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { months, error, isLoading };
};
