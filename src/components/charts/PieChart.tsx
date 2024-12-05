"use client";

import { Pie, PieChart } from "recharts";
import CardWrapper from "../CardWrapper";
import { formatCurrency } from "../../lib/formatCurrencyUtils";
import { Expense } from "../../lib/types";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ExpenseChartProps {
  expenses: Expense[]; // Updated to accept an array of Expense objects
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function PieChartComponent({ expenses }: ExpenseChartProps) {
  // Check if data is defined
  if (!expenses || expenses.length === 0) {
    return <p>No hay información para mostrar la gráfica.</p>;
  }

  // Transform the expenses data into chart-friendly format
  const chartData = expenses.map((expense) => ({
    amount: expense.amount,
    category: expense.category_name,
    formattedAmount: formatCurrency(expense.amount),
    fill: expense.colour || "var(--color-default)", // Default fill if no colour
  }));

  return (
    <CardWrapper title="Gráfica de gastos ↗️">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            nameKey="category"
            dataKey="amount"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            label={({ category, amount }) =>
              `${category}: ${formatCurrency(amount)}`
            }
          />
        </PieChart>
      </ChartContainer>
    </CardWrapper>
  );
}
