"use client";
import { House, Receipt, PiggyBank, Info, Building } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/helpers/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBuilding } from "@/contexts/building-context";

export default function MainMenu() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { building } = useBuilding();

  const navLinks = [
    { icon: House, name: "Apto", href: "/" },
    { icon: Receipt, name: "GC", href: "/gcomunes" },
    { icon: PiggyBank, name: "Fondo", href: "/fondo" },
    { icon: Info, name: "Info", href: "/info" },
  ];

  // Render different navigation layouts based on screen size
  if (isDesktop) {
    return (
      <div className="fixed top-0 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-20">
        <ScrollArea className="h-full">
          <div className="flex flex-col py-6 h-full">
            <div className="px-3 py-2">
              <div className="mb-6 flex items-center px-4">
                <Building className="mr-2 h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-primary">
                  {building?.address || "Building Admin"}
                </h1>
              </div>
              <div className="space-y-1">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      scroll={false}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Mobile navigation (bottom bar)
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
      <ul className="flex justify-around items-center h-16">
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const textColor = isActive ? "text-black" : "text-gray-500";
          const fontWeight = isActive ? "font-semibold" : "font-normal";
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                scroll={false}
                className="flex flex-col items-center justify-center h-full"
              >
                <item.icon className={cn("w-6 h-6", textColor)} />
                <span className={cn("mt-1 text-xs", textColor, fontWeight)}>
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
