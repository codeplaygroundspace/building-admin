"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Safely log the error to an error reporting service
    if (error) {
      // Create a safe copy of the error message to avoid any potential issues
      const safeErrorMessage =
        typeof error.message === "string" ? error.message : "Unknown error";
      console.error("Global error:", {
        message: safeErrorMessage,
        name: error.name,
        stack: error.stack,
      });
    } else {
      console.error("Unknown global error (error object is undefined)");
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error crítico
          </h2>
          <p className="text-gray-700 mb-6">
            {error && typeof error.message === "string"
              ? `Error: ${error.message}`
              : "La aplicación ha encontrado un error grave. Por favor intente de nuevo."}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
