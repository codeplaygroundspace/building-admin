import { dehydrate, QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import { ReactNode } from "react";
import { TanstackProvider } from "@/lib/tanstack/tanstack-provider";

// Create a cached getQueryClient function to ensure we're using the same instance
const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
          retry: 1,
        },
      },
    })
);

interface PrefetchQueryProps {
  children: ReactNode;
  prefetchFn: (queryClient: QueryClient) => Promise<void>;
}

/**
 * A component that prefetches data and dehydrates the query cache
 * Use this in layout.tsx or page.tsx in Next.js app router
 *
 * Example:
 * ```tsx
 * import { prefetchExpenses } from '@/lib/tanstack/prefetch-utils';
 *
 * export default async function Page() {
 *   return (
 *     <PrefetchQuery
 *       prefetchFn={async (queryClient) => {
 *         await prefetchExpenses(queryClient, 'building-id', '2023-05');
 *       }}
 *     >
 *       <YourPageComponent />
 *     </PrefetchQuery>
 *   );
 * }
 * ```
 */
export async function PrefetchQuery({
  children,
  prefetchFn,
}: PrefetchQueryProps) {
  const queryClient = getQueryClient();

  // Prefetch data using the provided function
  await prefetchFn(queryClient);

  // Dehydrate the cache to inject prefetched data
  const dehydratedState = dehydrate(queryClient);

  return (
    <TanstackProvider dehydratedState={dehydratedState}>
      {children}
    </TanstackProvider>
  );
}
