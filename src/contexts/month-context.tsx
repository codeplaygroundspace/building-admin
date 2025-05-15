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

interface MonthContextType {
  months: string[];
  selectedMonth: string | null;
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

        // Extract unique expense_reporting_month values
        const uniqueMonths = Array.from(
          new Set(
            data.expenses
              .map((expense) => expense.expense_reporting_month)
              .filter(Boolean)
          )
        );

        // Sort months chronologically (YYYY-MM format)
        const sortedMonths = [...uniqueMonths].sort((a, b) =>
          b.localeCompare(a)
        );

        console.log("Month Context - Available months:", sortedMonths);
        setMonths(sortedMonths);

        // Set default selected month if none selected yet
        if (!selectedMonth && sortedMonths.length > 0) {
          setSelectedMonth(sortedMonths[0]); // Select most recent month by default
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

  return (
    <MonthContext.Provider
      value={{
        months,
        selectedMonth,
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
