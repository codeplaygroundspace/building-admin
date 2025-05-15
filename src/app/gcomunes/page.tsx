"use client";

import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import BarChartComponent from "@/components/charts/BarChart";
import { useExpenses } from "../../hooks/useExpenses";
import ExpensesHeader from "@/components/ExpensesHeader";
import { useBuilding } from "@/contexts/building-context";
import { useMonth } from "@/contexts/month-context";

export default function ExpensesPage() {
  const { selectedMonth } = useMonth();
  const { building } = useBuilding();

  // Use the backward-compatible properties
  const { filteredExpenses, totalExpenses, loading, error } = useExpenses({
    month: selectedMonth,
    buildingId: building?.id,
  });

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

  // Convert the selected month to a display format (previous month)
  const displayText = selectedMonth
    ? getPreviousMonthDisplayText(selectedMonth)
    : null;

  return (
    <>
      {selectedMonth && displayText && (
        <ExpensesHeader
          selectedMonth={selectedMonth}
          displayMonth={displayText}
        />
      )}
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

// Helper function to get the previous month display text in "Month YYYY" format
function getPreviousMonthDisplayText(monthStr: string): string {
  if (!monthStr) return "";

  const [year, monthNum] = monthStr.split("-");
  let prevMonthNum = parseInt(monthNum) - 1;
  let prevYear = parseInt(year);

  if (prevMonthNum === 0) {
    prevMonthNum = 12;
    prevYear -= 1;
  }

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

  return `${monthNames[prevMonthNum - 1]} ${prevYear}`;
}
