"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  prefetchExpenses,
  prefetchProjects,
  prefetchAvailableMonths,
} from "@/lib/tanstack/prefetch-utils";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

/**
 * Hook that returns event handlers for prefetching data on hover
 *
 * @example
 * ```tsx
 * const { handleMouseEnter } = usePrefetchOnHover();
 *
 * return (
 *   <Link
 *     href="/expenses"
 *     onMouseEnter={() => handleMouseEnter('expenses', buildingId, month)}
 *   >
 *     Expenses
 *   </Link>
 * );
 * ```
 */
export function usePrefetchOnHover() {
  const queryClient = useQueryClient();
  const [hasPrefetched, setHasPrefetched] = useState<Record<string, boolean>>(
    {}
  );

  // Debounce the prefetch to avoid excessive calls on rapid hover movements
  const debouncedPrefetch = useDebouncedCallback(
    (type: string, buildingId?: string, month?: string) => {
      // Only prefetch if we haven't already prefetched this data
      const key = `${type}-${buildingId || ""}-${month || ""}`;

      if (hasPrefetched[key]) return;

      // Prefetch based on the requested type
      let prefetchPromise;

      switch (type) {
        case "expenses":
          if (buildingId && month) {
            prefetchPromise = prefetchExpenses(queryClient, buildingId, month);
          }
          break;
        case "projects":
          prefetchPromise = prefetchProjects(queryClient);
          break;
        case "months":
          if (buildingId) {
            prefetchPromise = prefetchAvailableMonths(queryClient, buildingId);
          }
          break;
        default:
          console.warn(`Unknown prefetch type: ${type}`);
      }

      // If we started a prefetch, mark as prefetched once done
      if (prefetchPromise) {
        prefetchPromise
          .then(() => {
            setHasPrefetched((prev) => ({
              ...prev,
              [key]: true,
            }));
          })
          .catch((error) => {
            console.error(`Error prefetching ${type}:`, error);
          });
      }
    },
    300 // 300ms debounce delay
  );

  const handleMouseEnter = useCallback(
    (type: string, buildingId?: string, month?: string) => {
      debouncedPrefetch(type, buildingId, month);
    },
    [debouncedPrefetch]
  );

  return { handleMouseEnter };
}
