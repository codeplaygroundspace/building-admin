"use client";
import CardWrapper from "@/components/CardWrapper";
import { formatCurrency } from "@/helpers/formatCurrency";

interface ExpenseItemProps {
  label: string;
  amount: number;
  description?: string;
}

interface ExpenseCategoryProps {
  category: string;
  items: ExpenseItemProps[];
}

interface ExpenseSummaryProps {
  totalExpenses: number;
}

export default function ExpenseSummary({ totalExpenses }: ExpenseSummaryProps) {
  const expensesSummary: ExpenseCategoryProps[] = [
    {
      category: "Gastos comunes",
      items: [
        {
          label: "Saldo anterior",
          amount: 59138.77,
          description: "Saldo del mes anterior",
        },
        {
          label: "Cobranza",
          amount: 8691.01,
          description: "Ingresos por pagos de expensas",
        },
        {
          label: "Gastos",
          amount: totalExpenses,
          description: "Total de gastos del mes anterior",
        },
        {
          label: "Créditos",
          amount: 0.0,
          description:
            "Ingresos extraordinarios no relacionados con la cobranza regular",
        },
        {
          label: "Débitos",
          amount: 10549.4,
          description:
            "Salidas de dinero extraordinarias no consideradas gastos operativos regulares",
        },
      ],
    },
  ];
  return (
    <CardWrapper title="Resumen de gastos">
      {expensesSummary.map((fund, index) => (
        <div key={index}>
          <div className="space-y-4">
            {fund.items.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-lg">{item.label}</p>
                  <p>{formatCurrency(item.amount)}</p>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </CardWrapper>
  );
}
