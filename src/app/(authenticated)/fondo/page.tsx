"use client";

import { useState, useEffect } from "react";
import InfoDebt from "@/components/FinDebt";
import CreditsDebitsBreakdown from "@/components/FinCreditsDebitsBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import { useExpenses } from "@/lib/tanstack/expenses";
import { useBuilding } from "@/contexts/building-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { MonthFilter } from "@/components/MonthFilter";
import { Expense } from "@/types/expense";
import { calcTotalExpenses } from "@/helpers/calcTotalExpenses";

export default function Savings() {
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const { building } = useBuilding();

  // Fetch all expenses using TanStack Query
  const {
    data: allExpenses = [],
    isLoading,
    error: queryError,
  } = useExpenses({
    buildingId: building?.id,
  });

  const error = queryError ? String(queryError) : null;

  // Extract unique months from expenses and select the most recent month
  useEffect(() => {
    if (allExpenses && allExpenses.length > 0) {
      // Extract unique months
      const months = allExpenses
        .map((expense: Expense) => expense.expense_reporting_month)
        .filter((month: string | null): month is string => month !== null)
        .filter(
          (value: string, index: number, self: string[]) =>
            self.indexOf(value) === index
        )
        .sort()
        .reverse(); // Newest first

      setAvailableMonths(months);

      // Auto-select the most recent month if we haven't selected one yet
      if (!selectedMonth && months.length > 0) {
        setSelectedMonth(months[0]);
      }
    }
  }, [allExpenses, selectedMonth]);

  // Filter expenses when month selection changes
  useEffect(() => {
    let filtered;

    if (!selectedMonth) {
      // If no month is selected yet, don't filter
      filtered = allExpenses;
    } else if (selectedMonth === "all") {
      // Show all months if specifically selected
      filtered = allExpenses;
    } else {
      // Filter by the selected month
      filtered = allExpenses.filter(
        (expense: Expense) => expense.expense_reporting_month === selectedMonth
      );
    }

    // Calculate total expenses for the filtered set
    const total = calcTotalExpenses({ expenses: filtered });
    setTotalExpenses(total);
  }, [selectedMonth, allExpenses]);

  // Handle month change from the filter
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner text="Cargando datos financieros..." size="large" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} fullScreen />;
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fondo de Reserva</h1>
        <MonthFilter
          allMonths={availableMonths}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
        />
      </div>

      <ExpenseSummary totalExpenses={totalExpenses} />
      <InfoDebt />
      <CreditsDebitsBreakdown />
    </>
  );
}
