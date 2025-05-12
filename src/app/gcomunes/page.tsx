"use client";

import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import BarChartComponent from "@/components/charts/BarChart";
import { useExpenses } from "../../hooks/useExpenses";
import ExpensesHeader from "@/components/ExpensesHeader";
import { useBuilding } from "@/contexts/building-context";
import { useMonth } from "@/contexts/month-context";

export default function ExpensesPage() {
  const { selectedMonth, displayMonth } = useMonth();
  const { building } = useBuilding();

  // Pass building ID to useExpenses hook
  const { filteredExpenses, totalExpenses, loading, error } = useExpenses(
    selectedMonth,
    building?.id
  );

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

  return (
    <>
      {displayMonth && (
        <ExpensesHeader
          selectedMonth={selectedMonth}
          displayMonth={displayMonth}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseSummary totalExpenses={totalExpenses} />
        <ExpenseBreakdown
          expenses={filteredExpenses}
          totalExpenses={totalExpenses}
        />
      </div>
      <BarChartComponent expenses={filteredExpenses} />
    </>
  );
}
