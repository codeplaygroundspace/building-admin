"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ZapIcon } from "lucide-react";

interface ExpensesHeaderProps {
  selectedMonth: string | null;
  displayMonth: string | null;
}

export default function ExpensesHeader({
  selectedMonth,
  displayMonth,
}: ExpensesHeaderProps) {
  if (!displayMonth || !selectedMonth) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Alert className="bg-primary/10 border-primary/20">
        <ZapIcon className="h-4 w-4 text-gray-800" />
        <AlertTitle className="text-gray-800">
          Mostrando gastos de: <span className="font-bold">{displayMonth}</span>
        </AlertTitle>
        <AlertDescription className="text-gray-700">
          Los gastos siempre corresponden al mes anterior al seleccionado
        </AlertDescription>
      </Alert>

      <Alert className="bg-primary/10 border-primary/20">
        <ZapIcon className="h-4 w-4 text-gray-800" />
        <AlertDescription className="text-gray-700">
          Los gastos de limpieza se pagan a mes vencido
        </AlertDescription>
      </Alert>
    </div>
  );
}
