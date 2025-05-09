"use client";

import { useState, useEffect } from "react";
import BuildingName from "@/components/BuildingName";
import SelectMonth from "@/components/SelectMonth";
import { useMonths } from "@/hooks/useMonths";

interface HeaderWrapperProps {
  buildingId: string;
}

export default function HeaderWrapper({ buildingId }: HeaderWrapperProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { months, error, isLoading } = useMonths();

  // Set default month when months are loaded
  useEffect(() => {
    if (!isLoading && months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[months.length - 1]); // Use the most recent month
    }
  }, [months, selectedMonth, isLoading]);

  return (
    <header className="flex justify-between items-center p-4 shadow-md mb-8">
      <BuildingName buildingId={buildingId} />
      <SelectMonth
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </header>
  );
}
