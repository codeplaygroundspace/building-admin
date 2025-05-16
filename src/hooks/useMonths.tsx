"use client";

import { useAvailableMonths } from "./useAvailableMonths";
import dayjs from "dayjs";
import { BaseFetchedExpense } from "@/types/expense";

// The useMonths custom hook fetches and processes a list of unique months from expense data
// and makes it available to components. It returns an array of months and loading/error states.

// Generate a list of months in Month YYYY format (like "January 2025") from YYYY-MM format (like "2025-01")
const convertMonthsFormat = (
  months: (string | BaseFetchedExpense)[]
): string[] => {
  return months.map((month) => {
    // Handle case where month might be an object with expense_reporting_month
    const monthStr =
      typeof month === "object" && month?.expense_reporting_month
        ? month.expense_reporting_month
        : String(month);

    const [year, monthNum] = monthStr.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Convert 1-based month number to array index (0-based)
    const monthIndex = parseInt(monthNum) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  });
};

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
  // Use the TanStack Query implementation
  const { months: monthsInYYYYMM, isLoading, error } = useAvailableMonths();

  // Convert months from YYYY-MM to Month YYYY format
  const formattedMonths = convertMonthsFormat(monthsInYYYYMM);

  // Add current month and sort
  const allMonths = getMonthOptions(formattedMonths);

  return {
    months: allMonths,
    error: error,
    isLoading,
  };
};
