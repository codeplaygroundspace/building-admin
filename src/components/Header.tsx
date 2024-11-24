"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Header() {
  // Generate the formatted month string for a given date
  const formatMonth = (date: Date): string => {
    return new Intl.DateTimeFormat("es-ES", {
      month: "short",
      year: "numeric",
    })
      .format(date)
      .replace(/^\w/, (c) => c.toLocaleUpperCase());
  };

  // Get the current month using the formatMonth function
  const getCurrentMonth = () => formatMonth(new Date());

  // Generate an array of the previous 12 months
  const getPreviousMonths = () => {
    const months: string[] = [];
    const currentDate = new Date();

    months.push(getCurrentMonth());

    for (let i = 1; i < 13; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      months.push(formatMonth(date));
    }

    return months;
  };

  const months = getPreviousMonths();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsDropdownOpen(false);
  };
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <h1 className="text-lg font-bold">Ejido 123...</h1>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-white border rounded-full px-4 py-2 shadow-sm flex items-center"
        >
          {selectedMonth} <ChevronDown className="ml-2 h-4 w-4" />
        </button>
        {isDropdownOpen && (
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
