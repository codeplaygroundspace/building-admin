"use client";
import {
  House,
  Receipt,
  PiggyBank,
  Info,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Receipt as ReceiptIcon,
  Calendar,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/helpers/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { PrefetchLink } from "@/components/prefetch/prefetch-link";
import { useBuilding } from "@/contexts/building-context";
import { useMonth } from "@/contexts/month-context";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function MainMenu() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isDesktopMenuCollapsed, setIsDesktopMenuCollapsed] = useState(false);
  const { building, isLoading: isBuildingLoading } = useBuilding();
  const { selectedMonth } = useMonth();

  const navLinks = [
    { icon: House, name: "Apartamentos", href: "/", prefetchType: null },
    {
      icon: Receipt,
      name: "Gastos comunes",
      href: "/gcomunes",
      prefetchType: "expenses",
    },
    {
      icon: ReceiptIcon,
      name: "Gastos puntuales",
      href: "/gpuntuales",
      prefetchType: "projects",
    },
    { icon: Calendar, name: "Eventos", href: "/eventos", prefetchType: null },
    {
      icon: PiggyBank,
      name: "Fondo de reserva",
      href: "/fondo",
      prefetchType: null,
    },
    { icon: Info, name: "Informacion", href: "/info", prefetchType: null },
    {
      icon: Settings,
      name: "A: Gastos comunes",
      href: "/admin",
      prefetchType: "expenses",
    },
    {
      icon: Settings,
      name: "A: Gastos puntuales",
      href: "/admin/gpuntuales",
      prefetchType: "projects",
    },
    {
      icon: Settings,
      name: "A: Fondo de reserva",
      href: "/admin/fondo",
      prefetchType: null,
    },
    { icon: Settings, name: "A: Pagos", href: "/pagos", prefetchType: null },
  ];

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

  // Handle logout function
  const handleLogout = () => {
    console.log("Logout clicked");
    // Logout logic will be implemented later
    window.location.href = "/login";
  };

  // Function to render the appropriate link based on prefetchType
  const renderLink = (
    item: (typeof navLinks)[0],
    classNames: string,
    title?: string,
    onClick?: () => void
  ) => {
    if (
      item.prefetchType &&
      (item.prefetchType === "expenses" ||
        item.prefetchType === "projects" ||
        item.prefetchType === "months")
    ) {
      return (
        <PrefetchLink
          href={item.href}
          prefetchType={item.prefetchType}
          buildingId={building?.id}
          month={selectedMonth || undefined}
          className={classNames}
          title={title}
          onClick={onClick}
          scroll={false}
        >
          <item.icon className="h-5 w-5" />
          {!isDesktopMenuCollapsed && <span>{item.name}</span>}
        </PrefetchLink>
      );
    }

    return (
      <Link
        href={item.href}
        scroll={false}
        title={title}
        className={classNames}
        onClick={onClick}
      >
        <item.icon className="h-5 w-5" />
        {!isDesktopMenuCollapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  // Render logout button
  const renderLogoutButton = (isMobile = false) => {
    const classNames = cn(
      "flex items-center rounded-md py-2 text-sm font-medium transition-colors text-red-600 hover:bg-red-50",
      isDesktopMenuCollapsed && !isMobile ? "justify-center px-0" : "px-3 gap-3"
    );

    return (
      <button
        onClick={handleLogout}
        className={classNames}
        title={
          isDesktopMenuCollapsed && !isMobile ? "Cerrar sesión" : undefined
        }
      >
        <LogOut className="h-5 w-5" />
        {(!isDesktopMenuCollapsed || isMobile) && <span>Cerrar sesión</span>}
      </button>
    );
  };

  // Render the building name (logo)
  const renderBuildingName = () => {
    if (isBuildingLoading) {
      return <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>;
    }

    if (!building) return null;

    return (
      <div
        className={cn(
          "px-3 py-4 mb-2",
          isDesktopMenuCollapsed ? "text-center" : ""
        )}
      >
        <h1
          className={cn(
            "font-bold",
            isDesktopMenuCollapsed ? "text-sm" : "text-lg"
          )}
        >
          {isDesktopMenuCollapsed
            ? building.address.substring(0, 1)
            : building.address}
        </h1>
      </div>
    );
  };

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
            {/* Building Name (Logo) */}
            {renderBuildingName()}

            <div className="px-3 py-2">
              <div className="space-y-1">
                {navLinks.map((item) => {
                  const isLastInfo = item.name === "Informacion";
                  return (
                    <React.Fragment key={item.name}>
                      {renderLink(
                        item,
                        cn(
                          "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
                          isDesktopMenuCollapsed
                            ? "justify-center px-0"
                            : "px-3 gap-3",
                          item.href === pathname
                            ? "bg-primary/10 text-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        ),
                        isDesktopMenuCollapsed ? item.name : undefined
                      )}
                      {isLastInfo && (
                        <hr
                          className="my-3 border-t border-gray-300 dark:border-gray-700"
                          aria-label="Admin section separator"
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                <hr
                  className="my-3 border-t border-gray-300 dark:border-gray-700"
                  aria-label="Logout separator"
                />
                {renderLogoutButton()}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Mobile navigation with shadcn Sheet component
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-30"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-full sm:max-w-xs p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full">
          <div className="flex flex-col py-6 h-full">
            {/* Building Name (Logo) */}
            <div className="px-4 py-4 mb-2">
              {building ? (
                <h1 className="text-lg font-bold">{building.address}</h1>
              ) : isBuildingLoading ? (
                <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
              ) : null}
            </div>

            <div className="px-3 py-2 mt-2">
              <div className="space-y-1">
                {navLinks.map((item) => {
                  const isLastInfo = item.name === "Informacion";
                  return (
                    <React.Fragment key={item.name}>
                      <SheetClose asChild>
                        {renderLink(
                          item,
                          cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            item.href === pathname
                              ? "bg-primary/10 text-primary"
                              : "text-gray-600 hover:bg-gray-50 hover:text-black"
                          )
                        )}
                      </SheetClose>
                      {isLastInfo && (
                        <hr
                          className="my-3 border-t border-gray-300 dark:border-gray-700"
                          aria-label="Admin section separator"
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                <hr
                  className="my-3 border-t border-gray-300 dark:border-gray-700"
                  aria-label="Logout separator"
                />
                <SheetClose asChild>{renderLogoutButton(true)}</SheetClose>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
