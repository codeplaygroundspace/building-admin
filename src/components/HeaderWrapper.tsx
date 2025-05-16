"use client";

import SelectMonth from "@/components/SelectMonth";
import { usePathname } from "next/navigation";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Hide header on info and admin pages
  if (
    pathname === "/info" ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/pagos"
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm mb-8">
      <div className="flex justify-end items-center p-4 md:p-4 pl-16 md:pl-4 sidebar-collapsed:md:pl-4 transition-all duration-300">
        <SelectMonth />
      </div>
    </header>
  );
}
