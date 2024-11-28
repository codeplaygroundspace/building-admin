"use client";
import CardWrapper from "./ui-custom/CardWrapper";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../utils/formatCurrency";
import { DashboardData } from "@/hooks/useDataFetcher";

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
            <li key={i} className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full`}
                    style={{ backgroundColor: el.colour || "black" }}
                    aria-hidden="true"
                  />
                  <h3 className="text-lg font-semibold">{el.category_name}</h3>
                </div>
                <p className="text-neutral-500">{el.description}</p>
              </div>
              <p className="whitespace-nowrap ">{formatCurrency(el.amount)}</p>
            </li>
          ))}
        </ul>
      )}
    </CardWrapper>
  );
}
