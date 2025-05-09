"use client";

import { useState, useEffect } from "react";
import BuildingName from "@/components/BuildingName";
import SelectMonth from "@/components/SelectMonth";
import { useMonths } from "@/hooks/useMonths";
import { useBuilding } from "@/contexts/building-context";

export default function HeaderWrapper() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { months, error, isLoading } = useMonths();
  const { building, isLoading: isBuildingLoading } = useBuilding();

  // Set default month when months are loaded
  useEffect(() => {
    if (!isLoading && months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[months.length - 1]); // Use the most recent month
    }
  }, [months, selectedMonth, isLoading]);

  return (
    <header className="flex justify-between items-center p-4 shadow-md mb-8">
      {building && <BuildingName buildingName={building.address} />}
      {isBuildingLoading && (
        <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
      )}
      <SelectMonth
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </header>
  );
}
