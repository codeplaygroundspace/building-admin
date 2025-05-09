"use client";

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
    <div className="bg-blue-50 p-4 my-4 rounded-lg text-blue-800">
      <p className="text-sm font-medium">
        Mostrando gastos de: <span className="font-bold">{displayMonth}</span>
      </p>
      <p className="text-xs text-blue-600">
        Los gastos siempre corresponden al mes anterior al seleccionado
      </p>
    </div>
  );
}
