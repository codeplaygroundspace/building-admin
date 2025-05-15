"use client";

import { useExpenses } from "@/hooks/useExpenses";
import { useMonth } from "@/contexts/month-context";
import { Expense } from "@/types/expense";
import { calcTotalExpenses } from "@/helpers/calcTotalExpenses";

export default function ExpensesList({ buildingId }: { buildingId: string }) {
  const { selectedMonth } = useMonth();
  const {
    data: expenses,
    isLoading,
    error,
  } = useExpenses({
    month: selectedMonth,
    buildingId,
  });

  const totalExpenses = calcTotalExpenses({ expenses });

  if (isLoading) {
    return <div className="p-4 text-center">Loading expenses...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading expenses: {error}
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="p-4 text-center">
        No expenses found for the selected month.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            Expenses for {formatMonth(selectedMonth)}
          </h2>
          <p className="text-gray-500">
            Total: ${totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="divide-y">
          {expenses.map((expense: Expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpenseItem({ expense }: { expense: Expense }) {
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">
            {expense.description || "No description"}
          </h3>
          <p className="text-sm text-gray-500">{expense.provider_name}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">${expense.amount.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{expense.provider_category}</p>
        </div>
      </div>
    </div>
  );
}

function formatMonth(monthStr: string | null): string {
  if (!monthStr) return "Unknown";

  const [year, monthNum] = monthStr.split("-");
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

  // Convert 1-based month number to array index (0-based)
  const monthIndex = parseInt(monthNum) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}
