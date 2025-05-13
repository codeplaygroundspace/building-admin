"use client";

import { useEffect, useState } from "react";
import { toast, useToast } from "./use-toast";
import { cn } from "@/helpers/utils";
import { X } from "lucide-react";

interface ToastProps {
  title?: string;
  description?: string;
  type?: "default" | "destructive";
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-md shadow-md p-4 min-w-[250px] max-w-md flex items-start gap-3",
            toast.type === "destructive"
              ? "bg-red-100 border border-red-300"
              : "bg-white border border-gray-200"
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <h4
                className={cn(
                  "font-medium text-sm mb-1",
                  toast.type === "destructive"
                    ? "text-red-800"
                    : "text-gray-900"
                )}
              >
                {toast.title}
              </h4>
            )}
            {toast.description && (
              <p
                className={cn(
                  "text-sm",
                  toast.type === "destructive"
                    ? "text-red-700"
                    : "text-gray-700"
                )}
              >
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-gray-400 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
