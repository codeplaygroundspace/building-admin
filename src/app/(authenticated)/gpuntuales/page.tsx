"use client";

import { useState, useEffect, useMemo } from "react";
import CardWrapper from "@/components/CardWrapper";
import { formatCurrency } from "@/helpers/formatCurrency";
import ExpenseListItem from "@/components/ExpenseListItem";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { MonthFilter } from "@/components/MonthFilter";
import { useProjects } from "@/lib/tanstack/projects";
import { FetchedProject } from "@/types/project";

export default function GastosPuntualesPage() {
  const [filteredProjects, setFilteredProjects] = useState<FetchedProject[]>(
    []
  );
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  // Initialize with null and set to latest month when data arrives
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Use the same TanStack Query hook that's used in admin pages
  const {
    data: allProjects = [],
    isLoading,
    error: queryError,
  } = useProjects();

  const error = queryError ? String(queryError) : null;

  // Extract unique months and select the most recent month
  useEffect(() => {
    if (allProjects && allProjects.length > 0) {
      // Extract unique months from projects if they have a month field
      const months = allProjects
        .map((project: FetchedProject) => project.project_month || null)
        .filter((month: string | null): month is string => month !== null)
        .filter(
          (value: string, index: number, self: string[]) =>
            self.indexOf(value) === index
        )
        .sort()
        .reverse(); // Newest first

      setAvailableMonths(months);

      // Auto-select the most recent month if we haven't selected one yet
      if (!selectedMonth && months.length > 0) {
        setSelectedMonth(months[0]);
      } else if (!selectedMonth) {
        // If no months available, default to showing all projects
        setSelectedMonth("all");
      }

      // Initialize filtered projects based on available data
      updateFilteredProjects(selectedMonth, allProjects);
    }
  }, [allProjects, selectedMonth]);

  // Helper function to update filtered projects
  const updateFilteredProjects = (
    month: string | null,
    projects: FetchedProject[]
  ) => {
    if (!month || month === "all") {
      setFilteredProjects(projects);
    } else if (
      projects.length > 0 &&
      projects.some((p: FetchedProject) => p.project_month)
    ) {
      // Only filter by month if projects have the project_month field
      setFilteredProjects(
        projects.filter(
          (project: FetchedProject) => project.project_month === month
        )
      );
    } else {
      // If projects don't have month data, just show all
      setFilteredProjects(projects);
    }
  };

  // Filter projects when month selection changes
  useEffect(() => {
    updateFilteredProjects(selectedMonth, allProjects);
  }, [selectedMonth, allProjects]);

  // Calculate total budget from filtered projects
  const totalBudget = useMemo(() => {
    return filteredProjects.reduce(
      (sum: number, project: FetchedProject) => sum + (project.cost || 0),
      0
    );
  }, [filteredProjects]);

  // Handle month change from the filter
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner text="Cargando gastos puntuales..." size="large" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} fullScreen />;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gastos Puntuales</h1>
        {availableMonths.length > 0 && (
          <MonthFilter
            allMonths={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        )}
      </div>

      <CardWrapper title="Gastos puntuales">
        <div className="mb-4 flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Total</h2>
          <p>{formatCurrency(totalBudget)}</p>
        </div>

        <Separator className="my-4" />

        {filteredProjects.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-500">
              No se encontraron gastos puntuales
              {selectedMonth && selectedMonth !== "all"
                ? ` para ${selectedMonth}`
                : ""}
              .
            </p>
          </div>
        ) : (
          <ul className="space-y-4 p-4">
            {filteredProjects.map((project: FetchedProject) => (
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
