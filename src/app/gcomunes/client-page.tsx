"use client";

import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import BarChartComponent from "@/components/charts/BarChart";
import ExpensesHeader from "@/components/ExpensesHeader";
import { useBuilding } from "@/contexts/building-context";
import { useMonth } from "@/contexts/month-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAppData } from "@/context/AppDataProvider";
import { ErrorMessage } from "@/components/ui/error-message";

export default function ClientPage() {
  const { selectedMonth } = useMonth();
  const { building } = useBuilding();
  const { expenses, isLoading, error } = useAppData();

  // Filter expenses for the current month and building
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.expense_reporting_month === selectedMonth &&
      expense.building_id === building?.id
  );

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce(
    (total, expense) => total + (expense.amount || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner text="Cargando gastos..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ErrorMessage message={`Error: ${error}`} fullScreen />
      </div>
    );
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
