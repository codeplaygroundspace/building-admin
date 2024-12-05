import { useBuildingAddress } from "@/lib/hooks/useBuildingAddress";

interface BuildingNameProps {
  buildingId: string; // Pass the `building_id` as a prop
}

export default function BuildingName({ buildingId }: BuildingNameProps) {
  const { buildingAddress, loading, error } = useBuildingAddress(buildingId);

  if (loading) {
    return <h1 className="text-lg font-bold">Cargando...</h1>;
  }

  if (error) {
    return <h1 className="text-lg font-bold text-red-500">Error: {error}</h1>;
  }

  return <h1 className="text-lg font-bold">{buildingAddress}</h1>;
}
