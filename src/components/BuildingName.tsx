"use client";

import { useBuildingAddress } from "@/hooks/useBuildingAddress";

interface BuildingNameProps {
  buildingId: string;
}

export default function BuildingName({ buildingId }: BuildingNameProps) {
  const { buildingAddress, loading, error } = useBuildingAddress(buildingId);

  console.log("BuildingName rendering:", {
    buildingId,
    buildingAddress,
    loading,
    error,
  });

  // Always render something, even in error or loading states
  return (
    <h1 className={`text-lg font-bold ${error ? "text-red-500" : ""}`}>
      {loading ? "Cargando..." : buildingAddress}
    </h1>
  );
}
