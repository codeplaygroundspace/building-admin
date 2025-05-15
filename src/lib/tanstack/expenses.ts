import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses, FetchExpensesOptions } from "@/helpers/fetchExpenses";
import { expenseKeys } from "./query-keys";
import { Expense } from "@/types/expense";

/**
 * Hook to fetch expenses based on provided filters
 */
export function useExpenses(options: FetchExpensesOptions = {}) {
  return useQuery({
    queryKey: expenseKeys.list(options),
    queryFn: () => fetchExpenses(options),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch all available months for dropdown
 */
export function useAvailableMonths(buildingId?: string) {
  return useQuery({
    queryKey: expenseKeys.months(),
    queryFn: () => fetchExpenses({ forDropdown: true, buildingId }),
    select: (data) => {
      // Extract unique expense_reporting_month values
      const uniqueMonths = Array.from(
        new Set(
          data.expenses
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
