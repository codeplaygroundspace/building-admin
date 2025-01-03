import { useState, useEffect } from "react";
import { fetchExpenses } from "@/helpers/fetchExpenses";
import { Expense } from "@/types/expense";

export const useBuildingAddress = (buildingId: string) => {
  const [buildingAddress, setBuildingAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchExpenses();

        // Find the building address for the given building ID
        const expenseWithBuilding: Expense | undefined = data.expenses.find(
          (expense: Expense) => expense.building_id === buildingId
        );

        setBuildingAddress(
          expenseWithBuilding?.building_address || "Dirección no encontrada"
        );
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

    if (buildingId) fetchData();
  }, [buildingId]);

  return { buildingAddress, loading, error };
};
