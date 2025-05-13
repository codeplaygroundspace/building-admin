"use client";

import BuildingName from "@/components/BuildingName";
import SelectMonth from "@/components/SelectMonth";
import { useBuilding } from "@/contexts/building-context";
import { usePathname } from "next/navigation";

export default function HeaderWrapper() {
  const { building, isLoading: isBuildingLoading } = useBuilding();
  const pathname = usePathname();

  // Hide header on info and admin pages
  if (pathname === "/info" || pathname === "/admin") {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm mb-8">
      <div className="flex justify-between items-center p-4">
        {building && <BuildingName buildingName={building.address} />}
        {isBuildingLoading && (
          <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
        )}
        <SelectMonth />
      </div>
    </header>
  );
}
