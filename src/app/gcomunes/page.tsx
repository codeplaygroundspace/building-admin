// Server Component
import { PrefetchQuery } from "@/components/prefetch/prefetch-query";
import { prefetchExpenses } from "@/lib/tanstack/prefetch-utils";
import ClientPage from "./client";

export default async function ExpensesPage() {
  // Get the building ID from the environment or context
  const buildingId = "cd4d2980-8c5e-444e-9840-6859582c0ea5"; // Default building ID

  // Get the current month for prefetching
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  return (
    <PrefetchQuery
      prefetchFn={async (queryClient) => {
        // Prefetch the current month's data as a starting point
        await prefetchExpenses(queryClient, buildingId, currentMonth);
      }}
    >
      <ClientPage />
    </PrefetchQuery>
  );
}
