import dayjs from "dayjs";
import { Expense } from "@/types/expense";

//Outcome: ["August 2024", "October 2024", "November 2024"]

export const filterUniqueMonth = (expenses: Expense[]): string[] => {
  const months = new Set<string>();

  // Go through each expense
  expenses.forEach((expense) => {
    // If it has a created_at date, add that month
    if (expense.created_at) {
      const createdAtMonth = dayjs(expense.created_at).format("MMMM YYYY");
      months.add(createdAtMonth);
    }

    // If it has date_from, add that month
    if (expense.date_from) {
      const dateFromMonth = dayjs(expense.date_from).format("MMMM YYYY");
      months.add(dateFromMonth);
    }

    // If it has date_to, add that month
    if (expense.date_to) {
      const dateToMonth = dayjs(expense.date_to).format("MMMM YYYY");
      months.add(dateToMonth);
    }
  });

  // Convert to array and sort chronologically
  return Array.from(months).sort((a, b) =>
    dayjs(a, "MMMM YYYY").diff(dayjs(b, "MMMM YYYY"))
  );
};
