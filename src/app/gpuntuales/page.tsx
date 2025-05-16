"use client";

import { useAppData } from "@/context/AppDataProvider";
import CardWrapper from "@/components/CardWrapper";
import { formatCurrency } from "@/helpers/formatCurrency";
import ExpenseListItem from "@/components/ExpenseListItem";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function GastosPuntualesPage() {
  const { projects, isLoading } = useAppData();

  // Calculate total budget
  const totalBudget = projects.reduce(
    (sum, project) => sum + (project.cost || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner text="Cargando gastos puntuales..." size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <CardWrapper title="Gastos puntuales">
        <div className="mb-4 flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Total</h2>
          <p>{formatCurrency(totalBudget)}</p>
        </div>

        <Separator className="my-4" />

        {projects.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500">No se encontraron gastos puntuales.</p>
          </div>
        ) : (
          <ul className="space-y-4 p-4">
            {projects.map((project) => (
              <ExpenseListItem
                key={project.id}
                provider_name={project.provider_name || "General"}
                provider_category={project.provider_category || "Varios"}
                description={project.description || "Sin descripción"}
                amount={project.cost || 0}
              />
            ))}
          </ul>
        )}
      </CardWrapper>
    </div>
  );
}
