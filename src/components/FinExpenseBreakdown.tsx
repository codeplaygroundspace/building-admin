"use client";
import CardWrapper from "./ui-custom/CardWrapper";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../utils/formatCurrency";

// Define the type for Expense
interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  created_at: string;
}

export default function ExpenseBreakdown({ data = [] }: { data: Expense[] }) {
  // Calculate total expenses
  const totalExpenses: number = data.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  return (
    <CardWrapper title="Detalle de gastos ↗️">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Total</h2>
        <p>{formatCurrency(totalExpenses)}</p>
      </div>
      <Separator className="my-4" />
      {data.length === 0 ? (
        <p>No se encontraron gastos comunes.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((expense, index) => (
            <li key={index} className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold">{expense.category}</h3>
                <p className="text-neutral-500">{expense.description}</p>
              </div>
              <p className="whitespace-nowrap ">
                {formatCurrency(expense.amount)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </CardWrapper>
  );
}
