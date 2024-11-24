"use client";
import CardWrapper from "./ui-custom/CardWrapper";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ExpenseSummary() {
  const expensesSummary = [
    {
      category: "Gastos comunes",
      items: [
        { label: "Saldo anterior", amount: 59138.77 },
        { label: "Cobranza", amount: 8691.01 },
        { label: "Gastos", amount: 27376.74 },
        { label: "Créditos", amount: 0.0 },
        { label: "Débitos", amount: 10549.4 },
      ],
    },
  ];
  return (
    <CardWrapper title="Resumen de gastos">
      {expensesSummary.map((fund, index) => (
        <div key={index} className="mb-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-2">
            {fund.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
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
