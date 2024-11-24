import MainMenu from "@/components/MainMenu";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";

export default function Apartments() {
  return (
    <>
      <MainMenu />
      <ExpenseSummary />
      <ExpenseBreakdown />
    </>
  );
}
