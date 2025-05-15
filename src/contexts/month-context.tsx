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
  const { months, isLoading, error } = useAvailableMonths(buildingId);

  // Set default selected month if none selected yet and months are loaded
  if (!selectedMonth && months.length > 0 && !isLoading) {
    setSelectedMonth(months[0]); // Select most recent month by default
  }

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
