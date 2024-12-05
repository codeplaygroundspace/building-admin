import dayjs from "dayjs";
import { Expense } from "./types";

//Outcome: ["August 2024", "October 2024", "November 2024"]

export const getUniqueMonths = (expenses: Expense[]): string[] => {
  const uniqueMonths = Array.from(
    new Set(
      expenses
        .filter((expense) => expense.created_at !== null)
        .map((expense) =>
          dayjs(expense.created_at).startOf("month").toISOString()
        )
    )
  ).sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1));

  return uniqueMonths.map((isoDate) => dayjs(isoDate).format("MMMM YYYY"));
};
