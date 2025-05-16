"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/helpers/utils";

interface ErrorMessageProps {
  message: string;
  fullScreen?: boolean;
  className?: string;
}

export function ErrorMessage({
  message,
  fullScreen = false,
  className,
}: ErrorMessageProps) {
  const content = (
    <div className={cn("flex items-center space-x-2 text-red-500", className)}>
      <AlertCircle className="h-5 w-5" />
      <p>{message}</p>
    </div>
  );

  // If fullScreen, wrap in a centered container
  if (fullScreen) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {content}
      </div>
    );
  }

  return content;
}
