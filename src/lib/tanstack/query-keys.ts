import { FetchExpensesOptions } from "@/helpers/fetchExpenses";

// Query keys for expense-related queries
export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (filters: FetchExpensesOptions) =>
    [...expenseKeys.lists(), filters] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  months: () => [...expenseKeys.all, "months"] as const,
};

// Query keys for project-related queries
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string | number) => [...projectKeys.details(), id] as const,
};
