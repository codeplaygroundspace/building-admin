"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Expense } from "@/types/expense";
import { createClientSide } from "@/lib/auth/client";

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

export interface Building {
  id: string;
  address: string;
  total_units: number;
  created_at: string;
}

export interface ExpenseMonth {
  id: string;
  building_id: string;
  month: string;
  created_at: string;
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
  buildings: Building[];
  selectedBuilding: Building | null;
  expenseMonths: ExpenseMonth[];
  isLoadingBuildings: boolean;
  isLoadingMonths: boolean;
  fetchBuildings: () => Promise<void>;
  setSelectedBuilding: (building: Building | null) => void;
  fetchMonths: (buildingId: string | null) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [expenseMonths, setExpenseMonths] = useState<ExpenseMonth[]>([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);
  const [isLoadingMonths, setIsLoadingMonths] = useState(false);

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

  const fetchBuildings = useCallback(async () => {
    setIsLoadingBuildings(true);
    try {
      const supabase = await createClientSide();
      const { data, error } = await supabase
        .from("buildings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setBuildings(data || []);

      // Set the first building as selected if there is no selected building
      if (!selectedBuilding && data && data.length > 0) {
        setSelectedBuilding(data[0]);
      }
    } catch (error) {
      console.error("Error fetching buildings:", error);
    } finally {
      setIsLoadingBuildings(false);
    }
  }, [selectedBuilding]);

  const fetchMonths = useCallback(async (buildingId: string | null) => {
    if (!buildingId) return;

    setIsLoadingMonths(true);
    try {
      // Use existing expenses API with forDropdown parameter
      const monthsRes = await fetch(
        `/api/expenses?building_id=${buildingId}&forDropdown=true`
      );

      if (!monthsRes.ok) {
        throw new Error(`Failed to fetch months: ${monthsRes.statusText}`);
      }

      const monthsData = await monthsRes.json();

      // Validate the response format
      if (!monthsData.months || !Array.isArray(monthsData.months)) {
        console.error("Invalid months data format:", monthsData);
        throw new Error("Invalid months data format received from API");
      }

      // Convert the month strings to ExpenseMonth objects
      const monthObjects: ExpenseMonth[] = monthsData.months.map(
        (month: string) => ({
          id: `${buildingId}-${month}`, // Create a synthetic ID
          building_id: buildingId,
          month: month,
          created_at: new Date().toISOString(),
        })
      );

      setExpenseMonths(monthObjects);
    } catch (error) {
      console.error(
        "Error fetching months:",
        error instanceof Error ? error.message : error
      );
      // Don't set state error since this is a background fetch
      // Return empty array to prevent UI from breaking
      setExpenseMonths([]);
    } finally {
      setIsLoadingMonths(false);
    }
  }, []); // Empty dependency array since it doesn't use any props or state

  // Initial data fetches
  useEffect(() => {
    fetchAllData();
    fetchBuildings();
  }, [fetchBuildings]);

  // Fetch months when a building is selected
  useEffect(() => {
    if (selectedBuilding) {
      fetchMonths(selectedBuilding.id);
    }
  }, [selectedBuilding, fetchMonths]);

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
        buildings,
        selectedBuilding,
        expenseMonths,
        isLoadingBuildings,
        isLoadingMonths,
        fetchBuildings,
        setSelectedBuilding,
        fetchMonths,
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
