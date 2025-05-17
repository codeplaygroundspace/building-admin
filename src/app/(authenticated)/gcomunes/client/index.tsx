"use client";

import { useState, useEffect } from "react";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import BarChartComponent from "@/components/charts/BarChart";
import { useBuilding } from "@/contexts/building-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { MonthFilter } from "@/components/MonthFilter";
import { Expense } from "@/types/expense";
import { calcTotalExpenses } from "@/helpers/calcTotalExpenses";
import { useExpenses } from "@/lib/tanstack/expenses";

export default function ClientPage() {
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const { building } = useBuilding();

  // Use the TanStack Query hook - same one used in admin pages
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
    // Only proceed if we have expenses to filter
    if (!allExpenses || allExpenses.length === 0) return;

    let filtered;

    if (!selectedMonth) {
      // If no month is selected yet, don't filter
      filtered = [...allExpenses];
    } else if (selectedMonth === "all") {
      // Show all months if specifically selected
      filtered = [...allExpenses];
    } else {
      // Filter by the selected month
      filtered = allExpenses.filter(
        (expense: Expense) => expense.expense_reporting_month === selectedMonth
      );
    }

    setFilteredExpenses(filtered);

    // Calculate total expenses for the filtered set
    const total = calcTotalExpenses({ expenses: filtered });
    setTotalExpenses(total);
  }, [selectedMonth, allExpenses]);

  // Handle month change from the filter
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  if (isLoading) {
    return <LoadingSpinner text="Cargando datos..." size="large" fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} fullScreen />;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gastos Comunes</h1>
        <div className="flex ">
          <MonthFilter
            allMonths={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <ExpenseSummary totalExpenses={totalExpenses} />
        <ExpenseBreakdown
          expenses={filteredExpenses}
          totalExpenses={totalExpenses}
        />
        <BarChartComponent expenses={filteredExpenses} />
      </div>
    </>
  );
}
