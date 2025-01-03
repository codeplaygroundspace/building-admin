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
    return <p>No se encontraron gastos comunes.</p>; // Handle the case where no expenses are available
  }

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
            key={index}
            category_name={el.category_name}
            description={el.description}
            amount={el.amount}
            colour={el.colour}
          />
        ))}
      </ul>
    </CardWrapper>
  );
}
