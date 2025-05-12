//The SelectMonth component itself does NOT fetch or filter data—it only displays the dropdown.
"use client";
import { Dropdown } from "./Dropdown";
import { useMonth } from "../contexts/month-context";

export default function SelectMonth() {
  const { months, selectedMonth, setSelectedMonth, error, isLoading } =
    useMonth();

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
