"use client";

import { House, Receipt, PiggyBank, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function MainMenu() {
  const pathname = usePathname();

  const navLinks = [
    { icon: House, name: "Apto", href: "/" },
    { icon: Receipt, name: "GC", href: "/gcomunes" },
    { icon: PiggyBank, name: "Fondo", href: "/fondo" },
    { icon: Info, name: "Info", href: "/info" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
      <ul className="flex justify-around items-center h-16">
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const textColor = isActive ? "text-black" : "text-gray-500";
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                scroll={false}
                className="flex flex-col items-center justify-center h-full"
              >
                <item.icon className={clsx("w-6 h-6", textColor)} />
                <span
                  className={clsx("mt-1 text-xs", textColor, {
                    "font-bold": isActive,
                  })}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
