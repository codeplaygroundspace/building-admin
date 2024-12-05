import { useState, useEffect } from "react";

export const useBuildingAddress = (buildingId: string) => {
  const [buildingAddress, setBuildingAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buildingId) {
      setError("Invalid building ID");
      setLoading(false);
      return;
    }

    const fetchBuildingAddress = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error("Error fetching expenses data");
        }

        const data = await response.json();

        console.log("Data from useBuildingAddress page:", data);

        // Find the building address for the given building ID
        const expenseWithBuilding = data.expenses.find(
          (expense: { building_id: string }) =>
            expense.building_id === buildingId
        );

        if (expenseWithBuilding) {
          setBuildingAddress(
            expenseWithBuilding.building_address || "Dirección no encontrada"
          );
        } else {
          setBuildingAddress("Edificio no encontrado");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Un error desconocido ha ocurrido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBuildingAddress();
  }, [buildingId]);

  return { buildingAddress, loading, error };
};
