"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/helpers/utils";

interface LoadingSpinnerProps {
  text?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({
  text = "Cargando...",
  size = "medium",
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  // Set size based on the prop
  const sizeMap = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  const spinnerSize = sizeMap[size];

  const content = (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <Loader2 className={cn(spinnerSize, "animate-spin text-primary")} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
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
