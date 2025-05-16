"use client";

import { useAppData } from "@/context/AppDataProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MonthsDropdownProps {
  onSelectMonth: (month: string) => void;
  currentMonth?: string;
}

export function MonthsDropdown({
  onSelectMonth,
  currentMonth,
}: MonthsDropdownProps) {
  const { months, isLoading } = useAppData();

  // Ensure months is always an array
  const safeMonths = Array.isArray(months) ? months : [];

  return (
    <Select
      disabled={isLoading || safeMonths.length === 0}
      onValueChange={onSelectMonth}
      value={currentMonth}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue
          placeholder={isLoading ? "Cargando..." : "Seleccione mes"}
        />
      </SelectTrigger>
      <SelectContent>
        {safeMonths.length === 0 ? (
          <SelectItem value="no-months" disabled>
            No hay meses disponibles
          </SelectItem>
        ) : (
          safeMonths.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
