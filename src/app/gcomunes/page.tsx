import MainMenu from "@/components/MainMenu";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";

// Define the type for Expense
interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  created_at: string;
}
export default function Apartments() {
  const data: Expense[] = [];
  return (
    <>
      <MainMenu />
      <ExpenseSummary />
      <ExpenseBreakdown data={data} />
    </>
  );
}
