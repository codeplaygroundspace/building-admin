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

  // Always set the current month as default
  useEffect(() => {
    if (!isLoading && !selectedMonth && months.length > 0) {
      const currentMonth = dayjs().format("MMMM YYYY");

      // First try to select the current month
      if (months.includes(currentMonth)) {
        setSelectedMonth(currentMonth);
      }
      // If current month isn't available yet, use the most recent month
      else {
        const sortedMonths = [...months].sort((a, b) =>
          dayjs(b, "MMMM YYYY").diff(dayjs(a, "MMMM YYYY"))
        );
        setSelectedMonth(sortedMonths[0]);
      }
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
