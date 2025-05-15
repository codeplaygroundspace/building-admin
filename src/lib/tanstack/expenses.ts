import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses, FetchExpensesOptions } from "@/helpers/fetchExpenses";
import { expenseKeys } from "./query-keys";
import { Expense } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook to fetch expenses based on provided filters
 */
export function useExpenses(options: FetchExpensesOptions = {}) {
  return useQuery({
    queryKey: expenseKeys.list(options),
    queryFn: async () => {
      const data = await fetchExpenses(options);
      return data.expenses || [];
    },
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data for 10 minutes
    retry: 2, // Retry failed requests twice
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch all available months for dropdown
 */
export function useAvailableMonths(buildingId?: string) {
  return useQuery({
    queryKey: expenseKeys.months(),
    queryFn: async () => {
      const data = await fetchExpenses({ forDropdown: true, buildingId });
      return data.expenses || [];
    },
    staleTime: 10 * 60 * 1000, // Months change less frequently
    gcTime: 15 * 60 * 1000,
    retry: 1,
    select: (expenses) => {
      // Extract unique expense_reporting_month values
      const uniqueMonths = Array.from(
        new Set(
          expenses
            .map((expense) => expense.expense_reporting_month)
            .filter(Boolean)
        )
      );

      // Sort months chronologically (YYYY-MM format)
      return [...uniqueMonths].sort((a, b) => b.localeCompare(a));
    },
  });
}

/**
 * Hook to add a new expense
 */
export function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newExpense: Partial<Expense>) => {
      const response = await fetch("/api/expenses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate expenses queries to refetch data
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.months() });
    },
  });
}

/**
 * Hook to add multiple expenses in bulk
 */
export function useAddBulkExpenses() {
  const queryClient = useQueryClient();

  interface BulkExpenseItem {
    description: string | null;
    amount: number;
    provider_id: string;
    provider_name: string;
    provider_category: string;
    building_id: string;
    expense_reporting_month: string;
  }

  return useMutation({
    mutationFn: async (expenses: BulkExpenseItem[]) => {
      console.log("Submitting bulk expenses:", expenses);

      const response = await fetch("/api/expenses/add-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expenses }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expenses");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate expenses queries to refetch data
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.months() });

      toast({
        title: "Listo ✅",
        description: `${variables.length} gastos agregados correctamente`,
      });
    },
    onError: (error) => {
      console.error("Error adding expenses:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al agregar gastos",
      });
    },
  });
}
