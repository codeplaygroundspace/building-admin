import MainMenu from "@/components/MainMenu";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import { DashboardData, fetchData } from "../../hooks/useDataFetcher";
// Data flows: Supabase → useDataFetcher → gc/page.tsx

// interface ExpensesPageProps {
//   expenses: DashboardData;
// }

export default async function ExpensesPage() {
  try {
    const expenses: DashboardData = await fetchData();

    if (!expenses) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      );
    }

    // Calculate total expenses
    const totalExpenses: number = expenses.expenses.reduce(
      (sum, expense) => sum + (expense.amount || 0),
      0
    );

    return (
      <>
        <MainMenu />
        <ExpenseSummary totalExpenses={totalExpenses} />
        <ExpenseBreakdown expenses={expenses} totalExpenses={totalExpenses} />
      </>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error loading dashboard data</p>
      </div>
    );
  }
}
