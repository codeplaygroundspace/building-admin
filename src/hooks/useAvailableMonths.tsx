"use client";

import { useAvailableMonths as useTanstackMonths } from "@/lib/tanstack/expenses";

/**
 * Hook to fetch available months with TanStack Query
 */
export function useAvailableMonths(buildingId?: string) {
  const { data = [], isLoading, error } = useTanstackMonths(buildingId);

  return {
    months: Array.isArray(data) ? data : [],
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
