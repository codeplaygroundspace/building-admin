import dayjs from "dayjs";
import { Expense } from "@/types/expense";

//Outcome: ["August 2024", "October 2024", "November 2024"]

export const filterUniqueMonth = (expenses: Expense[]): string[] => {
  const months = new Set<string>();

  // Go through each expense and use its canonical expense_reporting_month
  expenses.forEach((expense) => {
    // If expense has the designated expense_reporting_month field, use that
    if (expense.expense_reporting_month) {
      // Convert from YYYY-MM format to Month YYYY format
      const [year, month] = expense.expense_reporting_month.split("-");
      if (year && month) {
        // Create a date for the 1st day of the month, then format to "Month YYYY"
        const formattedMonth = dayjs(`${year}-${month}-01`).format("MMMM YYYY");
        months.add(formattedMonth);
      } else {
        // If the format is unexpected, just add it as is
        months.add(expense.expense_reporting_month);
      }
    }
    // Fallback to old method if expense_reporting_month is not available
    else {
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
    }
  });

  // Add the current month if not already included
  const currentMonth = dayjs().format("MMMM YYYY");
  if (!months.has(currentMonth)) {
    months.add(currentMonth);
  }

  // Convert to array and sort chronologically
  return Array.from(months).sort((a, b) =>
    dayjs(a, "MMMM YYYY").diff(dayjs(b, "MMMM YYYY"))
  );
};
