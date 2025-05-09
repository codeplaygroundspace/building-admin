//The SelectMonth component itself does NOT fetch or filter data—it only passes the selected month to its parent.
"use client";
import { useEffect } from "react";
import { useMonths } from "../hooks/useMonths";
import { Dropdown } from "./Dropdown";
import dayjs from "dayjs";

interface SelectMonthProps {
  selectedMonth: string | null;
  setSelectedMonth: (month: string) => void;
}

export default function SelectMonth({
  selectedMonth,
  setSelectedMonth,
}: SelectMonthProps) {
  const { months, error, isLoading } = useMonths();

  // Set the most recent month as the default based on user preference
  useEffect(() => {
    if (!isLoading && !selectedMonth && months.length > 0) {
      const currentMonth = dayjs().format("MMMM YYYY");
      const fallbackMonth = dayjs().subtract(1, "month").format("MMMM YYYY");

      const defaultMonth = months.includes(currentMonth)
        ? currentMonth
        : months.includes(fallbackMonth)
        ? fallbackMonth
        : months[months.length - 1];

      console.log("Default Selected Month:", defaultMonth); // Add this log
      setSelectedMonth(defaultMonth);
    }
  }, [months, selectedMonth, setSelectedMonth, isLoading]);

  return (
    <Dropdown
      items={months}
      selectedItem={selectedMonth}
      onSelect={setSelectedMonth}
      error={error}
      isLoading={isLoading}
    />
  );
}
