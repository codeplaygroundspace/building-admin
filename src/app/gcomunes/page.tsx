"use client";

import { useState, useEffect } from "react";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import PieChartComponent from "@/components/charts/PieChart";
import { useExpenses } from "../../hooks/useExpenses";
import { useMonths } from "../../hooks/useMonths";
import SelectMonth from "@/components/SelectMonth";
import ExpensesHeader from "@/components/ExpensesHeader";

export default function ExpensesPage() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { months } = useMonths();
  const { filteredExpenses, totalExpenses, loading, error, displayMonth } =
    useExpenses(selectedMonth);

  // Set default month when months are loaded
  useEffect(() => {
    if (months.length > 0 && !selectedMonth) {
      // Default to current month
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (months.includes(currentMonth)) {
        setSelectedMonth(currentMonth);
      } else {
        setSelectedMonth(months[months.length - 1]);
      }
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

  return (
    <>
      <div className="mb-6">
        <SelectMonth
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <ExpensesHeader
          selectedMonth={selectedMonth}
          displayMonth={displayMonth}
        />
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="bg-amber-50 p-4 rounded-lg text-amber-800 mb-6">
          <p>No se encontraron gastos para {displayMonth}</p>
        </div>
      ) : (
        <>
          <ExpenseSummary totalExpenses={totalExpenses} />
          <ExpenseBreakdown
            expenses={filteredExpenses}
            totalExpenses={totalExpenses}
          />
          <PieChartComponent expenses={filteredExpenses} />
        </>
      )}
    </>
  );
}
