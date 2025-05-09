import { useState, useEffect } from "react";
import { DashboardData } from "@/types/expense";
import { fetchExpenses } from "@/helpers/fetchExpenses";
import { filterUniqueMonth } from "@/helpers/filterUniqueMonth";
import dayjs from "dayjs";

//The useMonths custom hook is designed to fetch and process a list of unique months from the expenses data and make it available to components. The hook returns an array of strings representing the unique months and an error message if the fetch operation fails. The responsibility for setting the default selectedMonth has been moved to the parent component (SelectMonth).

// Generate a list of months including current month and future months
const getMonthOptions = (existingMonths: string[] = []): string[] => {
  const months = [...existingMonths]; // Start with existing months
  const currentDate = dayjs();

  // Add current month if not already included
  const currentMonth = currentDate.format("MMMM YYYY");
  if (!months.includes(currentMonth)) {
    months.push(currentMonth);
  }

  // Add next 2 future months
  for (let i = 1; i <= 2; i++) {
    const futureMonth = currentDate.add(i, "month").format("MMMM YYYY");
    if (!months.includes(futureMonth)) {
      months.push(futureMonth);
    }
  }

  // Sort months chronologically
  return months.sort((a, b) =>
    dayjs(a, "MMMM YYYY").diff(dayjs(b, "MMMM YYYY"))
  );
};

export const useMonths = () => {
  const [months, setMonths] = useState<string[]>(getMonthOptions());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data: DashboardData = await fetchExpenses();

        // Get unique months from expenses data
        const expenseMonths = filterUniqueMonth(data.expenses);

        // Combine with current and future months
        const allMonths = getMonthOptions(expenseMonths);

        setMonths(allMonths);
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
