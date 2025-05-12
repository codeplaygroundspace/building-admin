"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { DashboardData } from "@/types/expense";
import { fetchExpenses } from "@/helpers/fetchExpenses";
import { filterUniqueMonth } from "@/helpers/filterUniqueMonth";
import dayjs from "dayjs";

interface MonthContextType {
  months: string[];
  selectedMonth: string | null;
  displayMonth: string | null;
  setSelectedMonth: (month: string) => void;
  isLoading: boolean;
  error: string | null;
}

// Define a type for the params object
interface FetchExpensesParams {
  buildingId?: string;
  forDropdown?: boolean;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export function MonthProvider({
  children,
  buildingId,
}: {
  children: ReactNode;
  buildingId?: string;
}) {
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [displayMonth, setDisplayMonth] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all available months on component mount or when buildingId changes
  useEffect(() => {
    const fetchMonths = async () => {
      try {
        setIsLoading(true);

        // Fetch expenses data with buildingId parameter if available
        const params: FetchExpensesParams = {};
        if (buildingId) params.buildingId = buildingId;
        params.forDropdown = true; // Special flag to get all expenses for dropdown

        const data: DashboardData = await fetchExpenses(params);

        // Process expenses to extract unique months
        console.log(
          "Month Context - Processing expenses for months:",
          data.expenses.length
        );
        const availableMonths = filterUniqueMonth(data.expenses);

        // Add current month if not already included
        const currentMonth = dayjs().format("MMMM YYYY");
        if (!availableMonths.includes(currentMonth)) {
          availableMonths.push(currentMonth);
        }

        // Sort months chronologically
        const sortedMonths = availableMonths.sort((a, b) =>
          dayjs(a, "MMMM YYYY").diff(dayjs(b, "MMMM YYYY"))
        );

        console.log("Month Context - Available months:", sortedMonths);
        setMonths(sortedMonths);

        // Set default selected month if none selected yet
        if (!selectedMonth && sortedMonths.length > 0) {
          // Default to current month if available, otherwise most recent
          if (sortedMonths.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
          } else {
            setSelectedMonth(sortedMonths[sortedMonths.length - 1]);
          }
        }
      } catch (err) {
        console.error("Error fetching months:", err);
        setError("Failed to load month options.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonths();
  }, [buildingId, selectedMonth]);

  // Update display month whenever selected month changes
  useEffect(() => {
    if (selectedMonth) {
      // Display month is typically the previous month of the selected month
      const selectedMonthDate = dayjs(selectedMonth, "MMMM YYYY");
      const previousMonthDate = selectedMonthDate.subtract(1, "month");
      const displayMonthString = previousMonthDate.format("MMMM YYYY");
      setDisplayMonth(displayMonthString);
    } else {
      setDisplayMonth(null);
    }
  }, [selectedMonth]);

  return (
    <MonthContext.Provider
      value={{
        months,
        selectedMonth,
        displayMonth,
        setSelectedMonth,
        isLoading,
        error,
      }}
    >
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);
  if (context === undefined) {
    throw new Error("useMonth must be used within a MonthProvider");
  }
  return context;
}
