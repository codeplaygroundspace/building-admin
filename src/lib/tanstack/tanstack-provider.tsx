"use client";

import {
  QueryClient,
  QueryClientProvider,
  DehydratedState,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

interface TanstackProviderProps {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

export function TanstackProvider({
  children,
  dehydratedState,
}: TanstackProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {dehydratedState ? (
        <HydrationBoundary state={dehydratedState}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </HydrationBoundary>
      ) : (
        <>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </>
      )}
    </QueryClientProvider>
  );
}
