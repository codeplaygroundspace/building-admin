"use client";
import {
  House,
  Receipt,
  PiggyBank,
  Info,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/helpers/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function MainMenu() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuCollapsed, setIsDesktopMenuCollapsed] = useState(false);

  const navLinks = [
    { icon: House, name: "Apartamentos", href: "/" },
    { icon: Receipt, name: "Gastos comunes", href: "/gcomunes" },
    { icon: PiggyBank, name: "Fondo de reserva", href: "/fondo" },
    { icon: Info, name: "Informacion", href: "/info" },
    { icon: Settings, name: "Admin", href: "/admin" },
  ];

  // Close the mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById("mobile-menu");
      const menuButton = document.getElementById("menu-button");

      if (
        isMobileMenuOpen &&
        mobileMenu &&
        !mobileMenu.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Add class to body to adjust layout based on sidebar state
  useEffect(() => {
    if (isDesktop) {
      document.body.classList.toggle(
        "sidebar-collapsed",
        isDesktopMenuCollapsed
      );
    }

    return () => {
      document.body.classList.remove("sidebar-collapsed");
    };
  }, [isDesktop, isDesktopMenuCollapsed]);

  // Render desktop navigation (sidebar)
  if (isDesktop) {
    return (
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 transition-all duration-300 border-r border-sidebar-border z-20",
          isDesktopMenuCollapsed ? "w-16 bg-sidebar" : "w-64 bg-sidebar"
        )}
      >
        {/* Toggle button positioned at the top of the sidebar */}
        <div className="flex justify-end px-2 pt-2 pb-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDesktopMenuCollapsed(!isDesktopMenuCollapsed)}
            className="h-8 w-8"
            aria-label={
              isDesktopMenuCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {isDesktopMenuCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-40px)]">
          <div className="flex flex-col py-3 h-full">
            <div className="px-3 py-2">
              <div className="space-y-1">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      scroll={false}
                      title={isDesktopMenuCollapsed ? item.name : undefined}
                      className={cn(
                        "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
                        isDesktopMenuCollapsed
                          ? "justify-center px-0"
                          : "px-3 gap-3",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isDesktopMenuCollapsed && <span>{item.name}</span>}
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

  // Mobile navigation (hamburger menu and slide-out sidebar)
  return (
    <>
      {/* Mobile hamburger menu button */}
      <Button
        id="menu-button"
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-30"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Mobile sidebar */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-20 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-lg">
          <ScrollArea className="h-full">
            <div className="flex flex-col py-6 h-full">
              <div className="px-3 py-2 mt-8">
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
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-50 hover:text-black"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
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
      </div>
    </>
  );
}
