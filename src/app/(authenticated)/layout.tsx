import React from "react";
import MainMenu from "@/components/MainMenu";
import { BuildingProvider } from "@/contexts/building-context";
import { MonthProvider } from "@/contexts/month-context";
import { Toaster } from "@/components/ui/toast";
import { TanstackProvider } from "@/lib/tanstack/tanstack-provider";
import { AppDataProvider } from "@/contexts/app-data-context";
import { requireAuth } from "@/lib/auth/session";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify authentication on each page load
  await requireAuth();

  // Get building ID from environment variable with fallback
  const buildingId =
    process.env.DEFAULT_BUILDING_ID || "cd4d2980-8c5e-444e-9840-6859582c0ea5";

  return (
    <TanstackProvider>
      <AppDataProvider>
        <BuildingProvider initialBuildingId={buildingId}>
          <MonthProvider buildingId={buildingId}>
            <MainMenu />
            <div className="md:pl-64 sidebar-collapsed:md:pl-16 flex flex-col min-h-screen transition-all duration-300">
              <div className="h-16 md:h-0 bg-white border-b border-gray-200" />
              <main className="space-y-8 pb-8 px-4 pt-4 md:pt-8">
                {children}
              </main>
            </div>
            <Toaster />
          </MonthProvider>
        </BuildingProvider>
      </AppDataProvider>
    </TanstackProvider>
  );
}
