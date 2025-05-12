"use client";

import CardWrapper from "./CardWrapper";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/formatCurrency";
import { Expense } from "@/types/expense";
import ExpenseListItem from "@/components/ExpenseListItem";

interface ExpenseBreakdownProps {
  expenses: Expense[]; // Updated to accept an array of Expense objects
  totalExpenses: number;
}

export default function ExpenseBreakdown({
  expenses,
  totalExpenses,
}: ExpenseBreakdownProps) {
  // Check if data is defined
  if (!expenses || expenses.length === 0) {
    return <p>No se encontraron gastos comunes.</p>;
  }

  // Debug logging
  console.log("FinExpenseBreakdown received expenses:", expenses);

  return (
    <CardWrapper title="Detalle de gastos ↗️">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Total</h2>
        <p>{formatCurrency(totalExpenses)}</p>
      </div>
      <Separator className="my-4" />
      <ul className="space-y-4">
        {expenses.map((el, index) => (
          <ExpenseListItem
            key={el.id || index}
            provider_name={el.provider_name}
            provider_id={el.provider_id}
            provider_category={el.provider_category}
            description={el.description}
            amount={el.amount}
            date_from={el.date_from}
            date_to={el.date_to}
          />
        ))}
      </ul>
    </CardWrapper>
  );
}
