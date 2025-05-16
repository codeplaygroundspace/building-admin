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

  return (
    <>
      {selectedMonth && <ExpensesHeader />}
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
