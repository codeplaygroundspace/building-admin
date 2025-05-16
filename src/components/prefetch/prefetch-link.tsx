"use client";

import React from "react";
import Link from "next/link";
import { LinkProps } from "next/link";
import { usePrefetchOnHover } from "@/hooks/usePrefetchOnHover";

interface PrefetchLinkProps extends LinkProps {
  children: React.ReactNode;
  prefetchType: "expenses" | "projects" | "months";
  buildingId?: string;
  month?: string;
  className?: string;
  title?: string;
  onClick?: () => void;
}

/**
 * A Link component that prefetches TanStack Query data on hover
 *
 * @example
 * ```tsx
 * <PrefetchLink
 *   href="/expenses"
 *   prefetchType="expenses"
 *   buildingId={buildingId}
 *   month={selectedMonth}
 * >
 *   View Expenses
 * </PrefetchLink>
 * ```
 */
export function PrefetchLink({
  children,
  prefetchType,
  buildingId,
  month,
  className,
  title,
  onClick,
  ...props
}: PrefetchLinkProps) {
  const { handleMouseEnter } = usePrefetchOnHover();

  return (
    <Link
      {...props}
      className={className}
      title={title}
      onClick={onClick}
      onMouseEnter={() => handleMouseEnter(prefetchType, buildingId, month)}
    >
      {children}
    </Link>
  );
}
