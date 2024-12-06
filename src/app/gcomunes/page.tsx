"use client";

import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import PieChartComponent from "@/components/charts/PieChart";
import { useExpenses } from "../../hooks/useExpenses";

export default function ExpensesPage({
  selectedMonth,
}: {
  selectedMonth: string | null;
}) {
  const { filteredExpenses, totalExpenses, loading } =
    useExpenses(selectedMonth);

  console.log("Selected Month:", selectedMonth);
  console.log("Filtered Expenses:", filteredExpenses);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
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
      <ExpenseSummary totalExpenses={totalExpenses} />
      <ExpenseBreakdown
        expenses={filteredExpenses}
        totalExpenses={totalExpenses}
      />
      <PieChartComponent expenses={filteredExpenses} />
    </>
  );
}
