"use client";

interface BuildingNameProps {
  buildingName: string;
}

export default function BuildingName({ buildingName }: BuildingNameProps) {
  return <h1 className="text-lg font-bold">{buildingName}</h1>;
}
