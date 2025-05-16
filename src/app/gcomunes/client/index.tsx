"use client";

import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import BarChartComponent from "@/components/charts/BarChart";
import { useExpenses } from "../../../hooks/useExpenses";
import ExpensesHeader from "@/components/ExpensesHeader";
import { useBuilding } from "@/contexts/building-context";
import { useMonth } from "@/contexts/month-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

export default function ClientPage() {
  const { selectedMonth } = useMonth();
  const { building } = useBuilding();

  // Use the hook with modern property names
  const {
    data: filteredExpenses,
    isLoading,
    error,
    totalExpenses,
  } = useExpenses({
    month: selectedMonth,
    buildingId: building?.id,
  });

  if (isLoading) {
    return <LoadingSpinner text="Cargando gastos..." size="large" fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} fullScreen />;
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

// Helper function for month display formatting
function getPreviousMonthDisplayText(month: string): string {
  const [year, monthStr] = month.split("-");
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Convert to previous month
  let prevMonthIndex = parseInt(monthStr, 10) - 2; // -1 for 0-index, -1 for previous month
  let prevYear = parseInt(year, 10);

  if (prevMonthIndex < 0) {
    prevMonthIndex = 11; // December
    prevYear -= 1;
  }

  return `${monthNames[prevMonthIndex]} ${prevYear}`;
}
