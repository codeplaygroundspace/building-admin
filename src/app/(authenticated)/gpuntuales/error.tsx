"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error in Gastos Puntuales page:", error);
  }, [error]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
      <p className="mb-4">
        Lo sentimos, ha ocurrido un error al cargar los gastos puntuales.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Intentar de nuevo
      </Button>
    </div>
  );
}
