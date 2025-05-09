import { useState, useEffect } from "react";

export const useBuildingAddress = (buildingId: string) => {
  const [buildingAddress, setBuildingAddress] = useState<string>("Cargando...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      if (!buildingId) {
        setBuildingAddress("ID de edificio no proporcionado");
        setLoading(false);
        return;
      }

      console.log("Fetching building with ID:", buildingId);

      try {
        setLoading(true);

        // Use the buildings API endpoint
        const response = await fetch(`/api/buildings?id=${buildingId}`);
        console.log("API response status:", response.status);

        if (!response.ok) {
          throw new Error(`Error fetching building: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API response data:", data);

        if (data.buildings && data.buildings.length > 0) {
          const building = data.buildings[0];
          console.log("Building data:", building);

          // Just use the address field
          const displayAddress = building.address || "Sin dirección";
          console.log("Display address:", displayAddress);
          setBuildingAddress(displayAddress);
        } else {
          console.log("No buildings found in response");
          setBuildingAddress("Edificio no encontrado");
          console.warn(`No building found with ID: ${buildingId}`);
        }
      } catch (err) {
        console.error("Error fetching building:", err);
        // Set a fallback address even on error
        setBuildingAddress("Edificio");
        setError(
          err instanceof Error
            ? err.message
            : "Un error desconocido ha ocurrido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [buildingId]);

  return { buildingAddress, loading, error };
};
