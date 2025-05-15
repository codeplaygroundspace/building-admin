"use client";

import InfoDebt from "@/components/FinDebt";
import CreditsDebitsBreakdown from "@/components/FinCreditsDebitsBreakdown";
import ExpenseSummary from "@/components/FinExpensesSummary";
import { useExpenses } from "../../hooks/useExpenses";
import { useBuilding } from "@/contexts/building-context";
import { useMonth } from "@/contexts/month-context";
import { Loader2 } from "lucide-react";

export default function Savings() {
  const { selectedMonth } = useMonth();
  const { building } = useBuilding();

  // Use the modern property names
  const { totalExpenses, isLoading, error } = useExpenses({
    month: selectedMonth,
    buildingId: building?.id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Cargando datos financieros...
          </p>
        </div>
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
