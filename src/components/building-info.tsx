"use client";

import { useBuilding } from "@/contexts/building-context";

interface BuildingInfoProps {
  showAddress?: boolean;
}

export default function BuildingInfo({
  showAddress = true,
}: BuildingInfoProps) {
  const { building, isLoading, error } = useBuilding();

  if (isLoading) {
    return <div className="animate-pulse h-6 w-full bg-gray-200 rounded"></div>;
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading building information</div>
    );
  }

  if (!building) {
    return <div>No building information available</div>;
  }

  return (
    <div className="space-y-2">
      {showAddress && (
        <div>
          <span className="font-semibold">Address: </span>
          <span>{building.address}</span>
        </div>
      )}
    </div>
  );
}
