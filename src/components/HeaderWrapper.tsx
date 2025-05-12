"use client";

import BuildingName from "@/components/BuildingName";
import SelectMonth from "@/components/SelectMonth";
import { useBuilding } from "@/contexts/building-context";

export default function HeaderWrapper() {
  const { building, isLoading: isBuildingLoading } = useBuilding();

  return (
    <header className="flex justify-between items-center p-4 shadow-md mb-8">
      {building && <BuildingName buildingName={building.address} />}
      {isBuildingLoading && (
        <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
      )}
      <SelectMonth />
    </header>
  );
}
