"use client";

import { useState, useEffect } from "react";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import PieChartComponent from "@/components/charts/PieChart";
import { useExpenses } from "../../hooks/useExpenses";
import { useMonths } from "../../hooks/useMonths";
import SelectMonth from "@/components/SelectMonth";

export default function ExpensesPage() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { months } = useMonths();
  const { filteredExpenses, totalExpenses, loading, error } =
    useExpenses(selectedMonth);

  // Set default month when months are loaded
  useEffect(() => {
    if (months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">No expenses found for the selected month</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <SelectMonth
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>
      <ExpenseSummary totalExpenses={totalExpenses} />
      <ExpenseBreakdown
        expenses={filteredExpenses}
        totalExpenses={totalExpenses}
      />
      <PieChartComponent expenses={filteredExpenses} />
    </>
  );
}
