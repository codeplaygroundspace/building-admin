"use client";

import { useExpenses as useTanstackExpenses } from "@/lib/tanstack/expenses";
import { FetchExpensesOptions } from "@/helpers/fetchExpenses";
import { calcTotalExpenses } from "@/helpers/calcTotalExpenses";

/**
 * Hook to fetch expenses data with TanStack Query
 */
export function useExpenses(options: FetchExpensesOptions = {}) {
  const { data, isLoading, error } = useTanstackExpenses(options);

  // Calculate total expenses for convenience
  const totalExpenses = calcTotalExpenses({ expenses: data?.expenses || [] });

  return {
    data: data?.expenses || [],
    isLoading,
    error: error ? (error as Error).message : null,
    // Keep compatibility with old code
    filteredExpenses: data?.expenses || [],
    totalExpenses,
    loading: isLoading,
  };
}
