# TanStack Query Implementation

This project uses [TanStack Query](https://tanstack.com/query/latest) v5 for data fetching, caching, and state management. This document explains how to use the query hooks and patterns in this project.

## Setup

The TanStack Query client is set up in the application's root layout component. The QueryClientProvider wraps the entire application, making query functionality available throughout the app.

## Folder Structure

```
src/
  ├── lib/
  │   └── tanstack/
  │       ├── tanstack-provider.tsx    # QueryClientProvider setup
  │       ├── expenses.ts     # Query hooks for expenses
  │       ├── query-keys.ts   # Query key factories
  │       ├── prefetch-utils.ts # Prefetching utilities
  │       └── PREFETCHING.md  # Prefetching documentation
  ├── components/
  │   └── prefetch/
  │       ├── prefetch-query.tsx   # SSR prefetching component
  │       └── prefetch-link.tsx    # Navigation prefetching component
  └── hooks/
      ├── useExpenses.tsx     # Custom hooks using TanStack Query
      ├── useAvailableMonths.tsx
      └── usePrefetchOnHover.tsx # Prefetching hook
```

## Query Hooks

### Expenses

#### `useExpenses`

Fetches expenses based on the provided parameters.

```tsx
const { data, isLoading, error } = useExpenses({
  buildingId: "building-id",
  month: "2025-04",
});
```

#### `useAvailableMonths`

Fetches all available months for the month selector dropdown.

```tsx
const { months, isLoading } = useAvailableMonths(buildingId);
```

#### `useAddExpense`

Mutation hook for adding a new expense.

```tsx
const { mutate, isPending } = useAddExpense();

// Usage:
mutate({
  description: "New expense",
  amount: 100,
  // other expense properties
});
```

## Query Keys

The query keys are structured to ensure proper invalidation and caching:

```typescript
export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (filters: FetchExpensesOptions) =>
    [...expenseKeys.lists(), filters] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  months: () => [...expenseKeys.all, "months"] as const,
};
```

## Prefetching Strategies

We've implemented multiple prefetching strategies to improve performance:

### Server-Side Prefetching (RSC)

```tsx
<PrefetchQuery
  prefetchFn={async (queryClient) => {
    await prefetchExpenses(queryClient, buildingId, currentMonth);
  }}
>
  <ClientComponent />
</PrefetchQuery>
```

### Client-Side Navigation Prefetching

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

See [src/lib/tanstack/PREFETCHING.md](src/lib/tanstack/PREFETCHING.md) for complete prefetching documentation.

## Best Practices

1. **Always use the provided hooks** instead of directly calling `fetch` or other data fetching methods.
2. **Use the query key factories** to ensure proper cache invalidation.
3. **Leverage the query states** (isLoading, isPending, isError, etc.) to show appropriate UI feedback.
4. **Use the DevTools** during development to understand query behavior and caching.
5. **Implement prefetching** for common user paths to improve perceived performance.

## Performance Considerations

- The default `staleTime` is set to 5 minutes (300,000ms), meaning that data won't be refetched for at least 5 minutes after the initial fetch.
- Window focus refetching is disabled by default.
- Queries will retry once on failure.
- Prefetching is implemented for common navigation paths.

You can override these defaults in individual query hooks as needed.

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Query Examples](https://tanstack.com/query/latest/docs/framework/react/examples/basic)
- [Next.js 15 Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
