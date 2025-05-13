"use client";

import InfoDebt from "@/components/FinDebt";
import CreditsDebitsBreakdown from "@/components/FinCreditsDebitsBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import { useExpenses } from "../../hooks/useExpenses";
import { useBuilding } from "@/contexts/building-context";
import { useMonth } from "@/contexts/month-context";

export default function Savings() {
  const { selectedMonth } = useMonth();
  const { building } = useBuilding();

  // Pass building ID to useExpenses hook
  const { totalExpenses, loading, error } = useExpenses(
    selectedMonth,
    building?.id
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <ExpenseSummary totalExpenses={totalExpenses} />
      <InfoDebt />
      <CreditsDebitsBreakdown />
    </>
  );
}
