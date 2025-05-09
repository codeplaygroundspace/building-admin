"use client";

import { Pie, PieChart } from "recharts";
import CardWrapper from "../CardWrapper";
import { formatCurrency } from "../../helpers/formatCurrency";
import { Expense } from "@/types/expense";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ExpenseChartProps {
  expenses: Expense[]; // Updated to accept an array of Expense objects
}

// Define a set of colors to use for the chart
const chartColors = [
  "#4299E1", // blue
  "#48BB78", // green
  "#F56565", // red
  "#ED8936", // orange
  "#9F7AEA", // purple
  "#667EEA", // indigo
  "#F687B3", // pink
  "#38B2AC", // teal
  "#ECC94B", // yellow
];

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

  // Function to generate a color based on category name (consistent hash)
  const getCategoryColor = (categoryName: string, index: number): string => {
    // Use index as fallback if no category name
    if (!categoryName) return chartColors[index % chartColors.length];

    // Simple hash function to generate a consistent index based on category name
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use the hash to select a color from our array
    const colorIndex = Math.abs(hash) % chartColors.length;
    return chartColors[colorIndex];
  };

  // Transform the expenses data into chart-friendly format
  const chartData = expenses.map((expense, index) => ({
    amount: expense.amount,
    category: expense.category_name || "Sin categoría",
    formattedAmount: formatCurrency(expense.amount),
    fill: getCategoryColor(expense.category_name, index),
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
