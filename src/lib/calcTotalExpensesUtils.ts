import { Expense } from "./types/expense";

// Calculate total expenses
export function calcTotalExpenses(expenses: { expenses: Expense[] }): number {
  return expenses.expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
}
