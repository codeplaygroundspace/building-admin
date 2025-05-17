"use client";

import React from "react";
import { Dropdown } from "@/components/Dropdown";

interface MonthFilterProps {
  allMonths: string[];
  selectedMonth: string | null;
  onMonthChange: (month: string) => void;
}

export function MonthFilter({
  allMonths,
  selectedMonth,
  onMonthChange,
}: MonthFilterProps) {
  // Format month for display (YYYY-MM to Month Year)
  const formatMonth = (month: string) => {
    if (!month || month === "all") return "Todos los meses";

    try {
      const [year, monthNum] = month.split("-");

      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      const monthIndex = parseInt(monthNum, 10) - 1;
      if (isNaN(monthIndex) || monthIndex < 0 || monthIndex >= 12) {
        return month;
      }

      return `${monthNames[monthIndex]} ${year}`;
    } catch (error) {
      console.error(`Error formatting month ${month}:`, error);
      return month;
    }
  };

  // Handle dropdown items including All Months option
  const dropdownItems = ["all", ...allMonths];
  const effectiveSelectedItem = selectedMonth || "all";

  return (
    <div className="flex items-center">
      <label htmlFor="month-filter" className="mr-2 text-sm font-medium">
        Filtrar por mes:
      </label>
      <div className="w-56">
        <Dropdown
          items={dropdownItems}
          selectedItem={effectiveSelectedItem}
          onSelect={(month) => onMonthChange(month)}
          itemFormatter={(month) =>
            month === "all" ? "Todos los meses" : formatMonth(month)
          }
        />
      </div>
    </div>
  );
}
