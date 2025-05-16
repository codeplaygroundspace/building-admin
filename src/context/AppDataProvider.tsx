"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Expense } from "@/types/expense";

// Define types for providers and projects
interface Provider {
  id: string;
  name: string;
  category_id?: string;
  category_name?: string;
}

interface Project {
  id: string | number;
  cost: number;
  description?: string | null;
  status?: boolean | null;
  provider_id?: string | null;
  provider_name?: string;
  provider_category?: string;
  building_id?: string | null;
}

// Define context type
interface AppDataContextType {
  expenses: Expense[];
  providers: Provider[];
  projects: Project[];
  months: string[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildingId = "cd4d2980-8c5e-444e-9840-6859582c0ea5"; // Default building ID

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch expenses (using the simplified API that's working)
      const expensesRes = await fetch(
        `/api/expenses?building_id=${buildingId}`
      );

      if (!expensesRes.ok) {
        throw new Error(`Failed to fetch expenses: ${expensesRes.statusText}`);
      }

      const expensesData = await expensesRes.json();

      // Fetch providers
      const providersRes = await fetch("/api/providers");

      if (!providersRes.ok) {
        throw new Error(
          `Failed to fetch providers: ${providersRes.statusText}`
        );
      }

      const providersData = await providersRes.json();

      // Fetch unique months for dropdown (using the working pattern)
      const monthsRes = await fetch(
        `/api/expenses?building_id=${buildingId}&forDropdown=true`
      );

      if (!monthsRes.ok) {
        throw new Error(`Failed to fetch months: ${monthsRes.statusText}`);
      }

      const monthsData = await monthsRes.json();

      // Fetch projects (for gastos puntuales)
      const projectsRes = await fetch(`/api/projects`);

      if (!projectsRes.ok) {
        throw new Error(`Failed to fetch projects: ${projectsRes.statusText}`);
      }

      const projectsData = await projectsRes.json();

      // Validate data formats to ensure they match expected structure
      if (!expensesData.expenses || !Array.isArray(expensesData.expenses)) {
        console.error("Invalid expenses data format:", expensesData);
        throw new Error("Invalid expenses data format received from API");
      }

      if (!providersData.providers || !Array.isArray(providersData.providers)) {
        console.error("Invalid providers data format:", providersData);
        throw new Error("Invalid providers data format received from API");
      }

      if (!projectsData.projects || !Array.isArray(projectsData.projects)) {
        console.error("Invalid projects data format:", projectsData);
        throw new Error("Invalid projects data format received from API");
      }

      if (!monthsData.months || !Array.isArray(monthsData.months)) {
        console.error("Invalid months data format:", monthsData);
        throw new Error("Invalid months data format received from API");
      }

      setExpenses(expensesData.expenses);
      setProviders(providersData.providers);
      setMonths(monthsData.months);
      setProjects(projectsData.projects);
    } catch (err) {
      console.error("Error fetching app data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error cargando datos. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        expenses,
        providers,
        projects,
        months,
        isLoading,
        error,
        refreshData: fetchAllData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

// Custom hook to use the app data
export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
