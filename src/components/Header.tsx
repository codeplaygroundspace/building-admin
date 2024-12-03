"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import dayjs from "dayjs";
import { DashboardData, Expense } from "../lib/definitions"; // Importing the interfaces from definitions.ts

export default function Header({
  onMonthChange,
}: {
  onMonthChange?: (month: string) => void;
}) {
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch the available months from the API
  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error("Error fetching months");
        }
        const data: DashboardData = await response.json();

        // Extract unique months from the expenses data
        const uniqueMonths = Array.from(
          new Set(
            data.expenses
              .filter((expense) => expense.created_at !== null)
              .map((expense: Expense) =>
                dayjs(expense.created_at as string).format("MMMM YYYY")
              )
          )
        ).sort((a, b) =>
          dayjs(a, "MMMM YYYY").isAfter(dayjs(b, "MMMM YYYY")) ? 1 : -1
        );

        if (uniqueMonths.length > 0) {
          setMonths(uniqueMonths);
          // Set the latest month as the default selected month
          setSelectedMonth(uniqueMonths[uniqueMonths.length - 1]);
        } else {
          console.warn("No months data found"); // Warn if no months data
        }
      } catch (error) {
        console.error("Error fetching months:", error);
      }
    };

    fetchMonths();
  }, []);

  useEffect(() => {
    // Only call onMonthChange if this is not the initial setting of selectedMonth
    if (onMonthChange && selectedMonth && months.length > 0) {
      onMonthChange(selectedMonth);
    }
  }, [selectedMonth, onMonthChange, months]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <h1 className="text-lg font-bold">Ejido 123...</h1>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-white border rounded-full px-4 py-2 shadow-sm flex items-center"
        >
          {selectedMonth || "Cargando..."}{" "}
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
        {isDropdownOpen && months.length > 0 && (
          <ul className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg w-48 z-10">
            {months.map((month) => (
              <li
                key={month}
                onClick={() => handleMonthSelect(month)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  month === selectedMonth ? "font-bold bg-gray-100" : ""
                }`}
              >
                {month}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
