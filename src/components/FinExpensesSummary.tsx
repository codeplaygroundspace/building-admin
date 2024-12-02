"use client";
import CardWrapper from "./CardWrapper";
import { formatCurrency } from "../lib/formatCurrency";

interface ExpenseSummaryProps {
  totalExpenses: number;
}

export default function ExpenseSummary({ totalExpenses }: ExpenseSummaryProps) {
  const expensesSummary = [
    {
      category: "Gastos comunes",
      items: [
        { label: "Saldo anterior", amount: 59138.77 },
        { label: "Cobranza", amount: 8691.01 },
        { label: "Gastos", amount: totalExpenses },
        { label: "Créditos", amount: 0.0 },
        { label: "Débitos", amount: 10549.4 },
      ],
    },
  ];
  return (
    <CardWrapper title="Resumen de gastos">
      {expensesSummary.map((fund, index) => (
        <div key={index}>
          <div className="space-y-4">
            {fund.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <p className="text-lg">{item.label}</p>
                <p>{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </CardWrapper>
  );
}
