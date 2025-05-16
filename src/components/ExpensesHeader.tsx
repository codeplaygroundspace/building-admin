"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ZapIcon } from "lucide-react";

export default function ExpensesHeader() {
  return (
    <div className="space-y-4">
      <Alert className="bg-primary/10 border-primary/20">
        <ZapIcon className="h-4 w-4 text-gray-800" />
        <AlertTitle className="text-gray-800">Información de gastos</AlertTitle>
        <AlertDescription className="text-gray-700">
          <ul>
            <li>
              Los gastos corresponden al mes seleccionado, pero se pagan el me
              siguiente.
            </li>
            <li>Los gastos de limpieza, luz, agua se pagan a mes vencido.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
