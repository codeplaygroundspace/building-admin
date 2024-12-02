"use client";
import CardWrapper from "./CardWrapper";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../lib/formatCurrency";
import { DashboardData } from "@/lib/hooks/useDataFetcher";
import ExpenseListItem from "./ExpenseListItem";

interface ExpenseBreakdownProps {
  expenses: DashboardData;
  totalExpenses: number;
}
export default function ExpenseBreakdown({
  expenses,
  totalExpenses,
}: ExpenseBreakdownProps) {
  // Check if data is defined
  if (!expenses || !expenses.expenses) {
    return <p>No data available.</p>; // Handle the case where data is undefined
  }

  return (
    <CardWrapper title="Detalle de gastos ↗️">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Total</h2>
        <p>{formatCurrency(totalExpenses)}</p>
      </div>
      <Separator className="my-4" />
      {expenses.expenses.length === 0 ? (
        <p>No se encontraron gastos comunes.</p>
      ) : (
        <ul className="space-y-4">
          {expenses.expenses.map((el, i) => (
            <ExpenseListItem
              key={i}
              category_name={el.category_name}
              description={el.description}
              amount={el.amount}
              colour={el.colour}
            />
          ))}
        </ul>
      )}
    </CardWrapper>
  );
}
