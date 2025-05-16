import { QueryClient, QueryFunction, QueryKey } from "@tanstack/react-query";
import { expenseKeys } from "./query-keys";
import { projectKeys } from "./query-keys";
import { fetchExpenses } from "@/helpers/fetchExpenses";

/**
 * Prefetches an expenses query
 */
export async function prefetchExpenses(
  queryClient: QueryClient,
  buildingId: string,
  month: string
) {
  await queryClient.prefetchQuery({
    queryKey: expenseKeys.list({ buildingId, month }),
    queryFn: async () => {
      try {
        const data = await fetchExpenses({ buildingId, month });
        return Array.isArray(data.expenses) ? data.expenses : [];
      } catch (error) {
        console.error("Error prefetching expenses:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Match the staleTime from useExpenses
  });
}

/**
 * Prefetches available months query
 */
export async function prefetchAvailableMonths(
  queryClient: QueryClient,
  buildingId: string
) {
  await queryClient.prefetchQuery({
    queryKey: expenseKeys.months(),
    queryFn: async () => {
      try {
        const data = await fetchExpenses({ forDropdown: true, buildingId });
        // Check if data.months exists first (preferred), otherwise fall back to data.expenses
        if (data.months && Array.isArray(data.months)) {
          return data.months;
        }
        // For backward compatibility
        return Array.isArray(data.expenses) ? data.expenses : [];
      } catch (error) {
        console.error("Error prefetching months:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // Match the staleTime from useAvailableMonths
  });
}

/**
 * Prefetches projects list
 */
export async function prefetchProjects(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: projectKeys.lists(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Generic prefetcher hook for any query
 * DO NOT USE IN CLIENT COMPONENTS - use the clientPrefetch function below instead
 */
export function usePrefetch<TData>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TData, QueryKey, never>,
  options = {}
) {
  // Get query client from the useQueryClient hook in components
  return async (queryClient: QueryClient) => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      ...options,
    });
  };
}

/**
 * Client component compatible prefetching function that returns a promise
 * Use this in client components instead of direct async functions
 */
export function clientPrefetch<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  queryFn: QueryFunction<TData, QueryKey, never>,
  options = {}
) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

/**
 * NextJS App Router server component compatible prefetching
 */
export async function prefetchQuery<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  queryFn: QueryFunction<TData, QueryKey, never>,
  options = {}
) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
