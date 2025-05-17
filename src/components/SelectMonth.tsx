//The SelectMonth component itself does NOT fetch or filter data—it only displays the dropdown.
"use client";
import { Dropdown } from "./Dropdown";
import { useMonth } from "@/contexts/month-context";
import { useAppData } from "@/contexts/app-data-context";

export default function SelectMonth() {
  const { months: contextMonths, selectedMonth, setSelectedMonth } = useMonth();
  const { expenseMonths, isLoadingMonths, error } = useAppData();

  // Extract month strings from expenseMonths objects if available
  const appDataMonths = expenseMonths?.map((m) => m.month) || [];

  // Use months from AppDataProvider if available, otherwise fall back to context
  const months = appDataMonths?.length > 0 ? appDataMonths : contextMonths;

  // Format the month for display (YYYY-MM to display format)
  const formatMonth = (month: string) => {
    // Safety check for null or undefined
    if (!month) return "Mes no seleccionado";

    // Ensure month is a string
    const monthStr = String(month);

    // Check if month matches the expected format YYYY-MM
    if (!/^\d{4}-\d{1,2}$/.test(monthStr)) {
      console.warn(`Invalid month format: ${monthStr}`);
      return monthStr; // Return the original string if it doesn't match the pattern
    }

    try {
      const parts = monthStr.split("-");
      if (parts.length !== 2) {
        return monthStr; // Return original if not in expected format
      }

      const [year, monthNum] = parts;

      // Extra validation to prevent issues
      if (!year || !monthNum) {
        return monthStr;
      }

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

      // Convert 1-based month number to array index (0-based), with bounds checking
      const monthIndex = parseInt(monthNum, 10) - 1;
      if (isNaN(monthIndex) || monthIndex < 0 || monthIndex >= 12) {
        console.warn(
          `Month index out of range: ${monthIndex} for month ${monthStr}`
        );
        return monthStr; // Return the original string if the month is out of range
      }

      return `${monthNames[monthIndex]} ${year}`;
    } catch (error) {
      console.error(`Error formatting month ${monthStr}:`, error);
      return monthStr; // Return the original string if there's an error
    }
  };

  return (
    <Dropdown
      items={Array.isArray(months) ? months : []}
      selectedItem={selectedMonth}
      onSelect={setSelectedMonth}
      error={error}
      isLoading={isLoadingMonths}
      itemFormatter={formatMonth}
    />
  );
}
