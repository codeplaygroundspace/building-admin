"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Building } from "@/types/building";
import { useBuildingAddress } from "@/hooks/useBuildingAddress";

interface BuildingContextProps {
  building: Building | null;
  isLoading: boolean;
  error: Error | null;
  setBuildingId: (id: string) => void;
}

const BuildingContext = createContext<BuildingContextProps | undefined>(
  undefined
);

export const useBuilding = () => {
  const context = useContext(BuildingContext);

  if (context === undefined) {
    throw new Error("useBuilding must be used within a BuildingProvider");
  }

  return context;
};

type BuildingProviderProps = {
  children: ReactNode;
  initialBuildingId?: string;
};

export const BuildingProvider = ({
  children,
  initialBuildingId,
}: BuildingProviderProps) => {
  const [buildingId, setBuildingId] = useState<string | null>(
    initialBuildingId || null
  );

  const {
    buildingAddress,
    loading: isLoading,
    error: addressError,
  } = useBuildingAddress(buildingId || "");

  const building = buildingId
    ? {
        id: buildingId,
        address: buildingAddress,
      }
    : null;

  const error = addressError ? new Error(addressError) : null;

  const value = {
    building,
    isLoading,
    error,
    setBuildingId: (id: string) => setBuildingId(id),
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
};
