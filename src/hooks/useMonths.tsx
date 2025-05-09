import { useState, useEffect } from "react";
import { DashboardData } from "@/types/expense";
import { fetchExpenses } from "@/helpers/fetchExpenses";
import { filterUniqueMonth } from "@/helpers/filterUniqueMonth";
import dayjs from "dayjs";

// The useMonths custom hook fetches and processes a list of unique months from expense data
// and makes it available to components. It returns an array of months and loading/error states.

// Generate a list of months including existing months and current month
const getMonthOptions = (existingMonths: string[] = []): string[] => {
  const months = [...existingMonths]; // Start with existing months
  const currentDate = dayjs();

  // Add current month if not already included
  const currentMonth = currentDate.format("MMMM YYYY");
  if (!months.includes(currentMonth)) {
    months.push(currentMonth);
  }

  // Sort months chronologically
  return months.sort((a, b) =>
    dayjs(a, "MMMM YYYY").diff(dayjs(b, "MMMM YYYY"))
  );
};

export const useMonths = () => {
  const [months, setMonths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all expenses to determine available months
        const data: DashboardData = await fetchExpenses();

        // Extract unique months from expenses data
        const expenseMonths = filterUniqueMonth(data.expenses);

        // Combine with existing months and current month
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
