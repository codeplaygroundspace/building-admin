"use client";

import { useEffect, useState, useCallback } from "react";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import PieChartComponent from "@/components/charts/PieChart";
import Header from "@/components/Header";
import { DashboardData } from "../../lib/definitions";

export default function ExpensesPage() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleMonthChange = useCallback(
    async (month: string) => {
      if (month === selectedMonth) return; // Prevent refetching the same month
      setSelectedMonth(month);
      setLoading(true);
      try {
        const response = await fetch(
          `/api/expenses?month=${encodeURIComponent(month)}`
        );
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data: DashboardData = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setExpenses(null);
      } finally {
        setLoading(false);
      }
    },
    [selectedMonth]
  );

  useEffect(() => {
    if (!selectedMonth && !expenses) {
      const initialMonth = new Intl.DateTimeFormat("es-ES", {
        month: "long",
        year: "numeric",
      }).format(new Date());
      handleMonthChange(initialMonth);
    }
  }, [selectedMonth, expenses, handleMonthChange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!expenses) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error loading dashboard data</p>
      </div>
    );
  }

  // Calculate total expenses
  const totalExpenses: number = expenses.expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  return (
    <>
      <Header onMonthChange={handleMonthChange} />
      <ExpenseSummary totalExpenses={totalExpenses} />
      <ExpenseBreakdown expenses={expenses} totalExpenses={totalExpenses} />
      <PieChartComponent expenses={expenses} />
    </>
  );
}
