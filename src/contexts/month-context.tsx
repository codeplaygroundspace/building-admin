"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAvailableMonths } from "@/hooks/useAvailableMonths";

interface MonthContextType {
  months: string[];
  selectedMonth: string | null;
  setSelectedMonth: (month: string) => void;
  isLoading: boolean;
  error: string | null;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export function MonthProvider({
  children,
  buildingId,
}: {
  children: ReactNode;
  buildingId?: string;
}) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { months = [], isLoading, error } = useAvailableMonths(buildingId);

  // Safely handle month selection when data becomes available
  React.useEffect(() => {
    // Only set the default month if:
    // 1. We don't already have a selected month
    // 2. We have at least one month in the array
    // 3. Loading has completed
    if (
      !selectedMonth &&
      Array.isArray(months) &&
      months.length > 0 &&
      !isLoading
    ) {
      // Ensure we're setting a string value
      const firstMonth =
        typeof months[0] === "string"
          ? months[0]
          : months[0]?.expense_reporting_month || null;

      if (firstMonth) {
        setSelectedMonth(firstMonth);
      }
    }
  }, [selectedMonth, months, isLoading]);

  // Ensure months is always a valid array of strings
  const safeMonths = Array.isArray(months)
    ? months
        .map((month) =>
          typeof month === "string"
            ? month
            : month?.expense_reporting_month || ""
        )
        .filter(Boolean)
    : [];

  return (
    <MonthContext.Provider
      value={{
        months: safeMonths,
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
