# TanStack Query Prefetching Strategy

This document outlines the prefetching strategies implemented in our application to improve performance and user experience with TanStack Query and Next.js 15.

## Prefetching Methods

We've implemented three main prefetching approaches:

1. **Server-Side Prefetching**: Using React Server Components to prefetch and hydrate queries during SSR
2. **Navigation Prefetching**: Prefetching data when users hover over navigation links
3. **Parallel Route Prefetching**: Prefetching data for the next likely user action

## Implementation Details

### Server-Side Prefetching (RSC)

For React Server Components in Next.js 15, we use the `PrefetchQuery` component:

```tsx
// Page component
import { PrefetchQuery } from "@/components/prefetch/prefetch-query";
import { prefetchExpenses } from "@/lib/tanstack/prefetch-utils";

export default async function ExpensesPage() {
  return (
    <PrefetchQuery
      prefetchFn={async (queryClient) => {
        await prefetchExpenses(queryClient, buildingId, currentMonth);
      }}
    >
      <ClientComponent />
    </PrefetchQuery>
  );
}
```

This approach:

- Prefetches data during server-side rendering
- Dehydrates the query cache for client hydration
- Reduces initial loading time for the client

### Navigation Prefetching (Client-Side)

For client-side prefetching when users hover over navigation elements:

```tsx
<PrefetchLink
  href="/expenses"
  prefetchType="expenses"
  buildingId={buildingId}
  month={selectedMonth}
>
  View Expenses
</PrefetchLink>
```

This approach:

- Anticipates user navigation
- Prefetches data when the user shows intent to navigate
- Uses debouncing to prevent excessive API calls

### Custom Prefetching Hook

For more control over prefetching, use the `usePrefetchOnHover` hook:

```tsx
const { handleMouseEnter } = usePrefetchOnHover();

return (
  <button
    onMouseEnter={() => handleMouseEnter("expenses", buildingId, month)}
    onClick={openExpensesModal}
  >
    Open Expenses
  </button>
);
```

## Best Practices

1. **Be Selective**: Don't prefetch everything; focus on high-probability user paths
2. **Use Debouncing**: Debounce prefetch calls to prevent API spam
3. **Track Prefetched State**: Avoid duplicate prefetching requests
4. **Match Query Options**: Use the same `staleTime` and other options as the original query
5. **Consider Data Size**: For large datasets, prefetch only what's needed initially

## Performance Considerations

- Prefetching improves perceived performance but can increase server load
- The TanStack Query cache efficiently handles redundant requests
- Consider stale time and cache invalidation strategies
- Monitor network usage with React Query DevTools to ensure efficient prefetching

## Utility Functions

The `prefetch-utils.ts` file contains utility functions for different prefetching scenarios:

- `prefetchExpenses`: Prefetches expense data for a specific building and month
- `prefetchAvailableMonths`: Prefetches available months for dropdown selection
- `prefetchProjects`: Prefetches project data
- `usePrefetch`: Generic hook for custom prefetching scenarios
