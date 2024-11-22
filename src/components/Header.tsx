"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [selectedMonth, setSelectedMonth] = useState("Noviembre 2024");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const months: string[] = [
    "Enero 2024",
    "Febrero 2024",
    "Marzo 2024",
    "Abril 2024",
    "Mayo 2024",
    "Junio 2024",
    "Julio 2024",
    "Agosto 2024",
    "Septiembre 2024",
    "Octubre 2024",
    "Noviembre 2024",
    "Diciembre 2024",
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <h1 className="text-3xl font-bold">Ejido 123...</h1>
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
