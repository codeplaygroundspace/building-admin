//The SelectMonth component itself does NOT fetch or filter data—it only displays the dropdown.
"use client";
import { Dropdown } from "./Dropdown";
import { useMonth } from "../contexts/month-context";

export default function SelectMonth() {
  const { months, selectedMonth, setSelectedMonth, error, isLoading } =
    useMonth();

  // Format the month for display (YYYY-MM to display format)
  const formatMonth = (month: string) => {
    if (!month) return "";

    const [year, monthNum] = month.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Convert 1-based month number to array index (0-based)
    const monthIndex = parseInt(monthNum) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  };

  return (
    <Dropdown
      items={months}
      selectedItem={selectedMonth}
      onSelect={setSelectedMonth}
      error={error}
      isLoading={isLoading}
      itemFormatter={formatMonth}
    />
  );
}
