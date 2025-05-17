"use client";
import {
  House,
  Receipt,
  PiggyBank,
  Info,
  Settings,
  Menu,
  Receipt as ReceiptIcon,
  Calendar,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  SheetDescription,
} from "@/components/ui/sheet";
import { signOut } from "@/actions/auth";

export default function MainMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isDesktopMenuCollapsed, setIsDesktopMenuCollapsed] = useState(false);
  const { building, isLoading: isBuildingLoading } = useBuilding();
  const { selectedMonth } = useMonth();

  // Track if the component has mounted - helps with hydration issues
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const navLinks = [
    {
      icon: House,
      name: "Apartamentos",
      href: "/apartamentos",
      prefetchType: null,
    },
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
  const handleLogout = async () => {
    try {
      // First navigate away to login page to avoid DOM manipulations during unmount
      router.replace("/login");
      // Then perform the actual signout (this will happen after navigation)
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
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
          <div
            className={cn(
              "flex items-center justify-center w-5 h-5",
              !isDesktopMenuCollapsed && "mr-3"
            )}
          >
            <item.icon className="h-5 w-5" />
          </div>
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
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5",
            !isDesktopMenuCollapsed && "mr-3"
          )}
        >
          <item.icon className="h-5 w-5" />
        </div>
        {!isDesktopMenuCollapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  // Render logout button - styled exactly like nav links
  const renderLogoutButton = (isMobile = false) => {
    // Use the exact same styling as navigation links
    const classNames = cn(
      "flex items-center rounded-md py-2 text-sm font-medium transition-colors w-full",
      isDesktopMenuCollapsed && !isMobile ? "justify-center px-0" : "px-3",
      isMobile
        ? "text-gray-600 hover:bg-gray-50 hover:text-black"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    );

    return (
      <button
        onClick={handleLogout}
        className={classNames}
        title={
          isDesktopMenuCollapsed && !isMobile ? "Cerrar sesión" : undefined
        }
      >
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5",
            (!isDesktopMenuCollapsed || isMobile) && "mr-3"
          )}
        >
          <LogOut className="h-5 w-5" />
        </div>
        {(!isDesktopMenuCollapsed || isMobile) && <span>Cerrar sesión</span>}
      </button>
    );
  };

  // Render the building name (logo)
  const renderBuildingName = () => {
    if (isBuildingLoading) {
      return (
        <div className="px-3 py-4 mb-2 flex items-center">
          <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (!building) return null;

    return (
      <div
        className={cn(
          "px-3 py-4 mb-2 flex items-center",
          isDesktopMenuCollapsed ? "justify-center" : ""
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

  // If this is the first render and we haven't mounted yet, render both versions
  // This ensures we have content during hydration
  if (!hasMounted) {
    return (
      <>
        {/* Desktop version - hidden on mobile */}
        <div className="hidden md:block fixed top-0 left-0 bottom-0 transition-all duration-300 border-r border-sidebar-border z-20 w-64 bg-sidebar">
          {/* Simplified content that doesn't depend on state */}
          <div className="p-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Mobile version - hidden on desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-30"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </>
    );
  }

  // Regular render logic when component has mounted
  if (isDesktop) {
    return (
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 transition-all duration-300 border-r border-sidebar-border z-20",
          isDesktopMenuCollapsed ? "w-16 bg-sidebar" : "w-64 bg-sidebar"
        )}
      >
        {/* Toggle button positioned at the top of the sidebar */}
        <div className="flex justify-end px-4 pt-2 pb-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDesktopMenuCollapsed(!isDesktopMenuCollapsed)}
            className="h-8 w-8 flex items-center justify-center"
            aria-label={
              isDesktopMenuCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {isDesktopMenuCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-40px)]">
          <div className="flex flex-col py-2 h-full">
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
                            : "px-3",
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
          className="fixed top-0 left-0 z-30 h-16 w-16 flex items-center justify-center bg-white border-b border-r border-gray-200 rounded-none"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-full sm:max-w-xs p-0">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation menu for the building administration application
          </SheetDescription>
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
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
