"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import CardWrapper from "@/components/CardWrapper";
import { formatCurrency } from "@/helpers/formatCurrency";
import { Expense } from "@/types/expense";
import { getCategoryColor } from "@/helpers/getCategoryColor";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { formatUppercase } from "@/helpers/formatters";

interface ExpenseChartProps {
  expenses: Expense[]; // Updated to accept an array of Expense objects
}

// Define a set of fallback colors in case getCategoryColor fails
const fallbackColors = [
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

export default function BarChartComponent({ expenses }: ExpenseChartProps) {
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {}
  );

  // Load CSS colors on component mount
  useEffect(() => {
    const loadCategoryColors = () => {
      const categories = [
        "agua",
        "comision-bancaria",
        "seguridad",
        "emergencia",
        "sanitaria",
        "administracion",
        "limpieza",
        "otros",
        "electricista",
        "electricidad",
      ];

      const colors: Record<string, string> = {};

      categories.forEach((category) => {
        // Create a temporary element with the category class
        const tempElement = document.createElement("div");
        // Set both classes to access text color directly
        tempElement.className = `badge-${category}`;
        document.body.appendChild(tempElement);

        // Get the computed text color instead of background
        const computedStyle = window.getComputedStyle(tempElement);
        colors[`badge-${category}`] = computedStyle.color;

        // Remove the temporary element
        document.body.removeChild(tempElement);
      });

      setCategoryColors(colors);
    };

    loadCategoryColors();
  }, []);

  // Check if data is defined
  if (!expenses || expenses.length === 0) {
    return (
      <CardWrapper title="Gráfica de gastos ↗️">
        <div className="p-4 text-center h-[350px] flex items-center justify-center">
          <p className="text-gray-500">
            No hay información para mostrar la gráfica.
          </p>
        </div>
      </CardWrapper>
    );
  }

  // Function to get category color from CSS
  const getCategoryColorForChart = (
    category: string,
    index: number
  ): string => {
    // Map our CSS category badge classes to actual CSS colors
    const badgeClass = getCategoryColor(category);

    // If we have loaded the color from CSS, use it
    if (categoryColors[badgeClass]) {
      return categoryColors[badgeClass];
    }

    // Fallback mapping with more vibrant text colors
    const fallbackColorMap: Record<string, string> = {
      "badge-agua": "#0078A0", // Darker blue
      "badge-comision-bancaria": "#B01C7C", // Darker purple
      "badge-seguridad": "#D87300", // Darker orange
      "badge-emergencia": "#CC0000", // Darker red
      "badge-sanitaria": "#00856F", // Darker teal
      "badge-administracion": "#007D3D", // Darker green
      "badge-limpieza": "#6200C9", // Darker purple
      "badge-otros": "#515A69", // Darker gray
      "badge-electricista": "#1A56BD", // Darker blue
      "badge-electricidad": "#D06000", // Darker orange
    };

    // Return the color from the map or fall back to the old color system
    return (
      fallbackColorMap[badgeClass] ||
      fallbackColors[index % fallbackColors.length]
    );
  };

  // Transform the expenses data into chart-friendly format
  const chartData = expenses.map((expense, index) => ({
    amount: expense.amount,
    category: expense.provider_name || "Sin categoría",
    categoryDisplay: formatUppercase(expense.provider_name || "Sin categoría"),
    provider_category: expense.provider_category,
    formattedAmount: formatCurrency(expense.amount),
    fill: getCategoryColorForChart(expense.provider_category, index),
  }));

  return (
    <CardWrapper title="Gráfica de gastos ↗️">
      <ChartContainer config={chartConfig} className="mx-auto h-[350px] w-full">
        <BarChart
          width={514}
          height={350}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="categoryDisplay"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number), "Monto"]}
            labelFormatter={(label) =>
              `Proveedor: ${formatUppercase(label.toString())}`
            }
            labelStyle={{ fontWeight: "bold" }}
            contentStyle={{
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
            }}
          />
          <Bar
            dataKey="amount"
            name="Monto"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.8}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardWrapper>
  );
}
