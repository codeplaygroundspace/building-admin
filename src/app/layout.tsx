import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import MainMenu from "@/components/MainMenu";
import HeaderWrapper from "@/components/HeaderWrapper";
import { BuildingProvider } from "@/contexts/building-context";
import { MonthProvider } from "@/contexts/month-context";
import { Toaster } from "@/components/ui/toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define a valid building ID from our Supabase database
  const buildingId = "cd4d2980-8c5e-444e-9840-6859582c0ea5";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100`}
      >
        <BuildingProvider initialBuildingId={buildingId}>
          <MonthProvider buildingId={buildingId}>
            <MainMenu />
            <div className="md:pl-64 sidebar-collapsed:md:pl-16 flex flex-col min-h-screen transition-all duration-300">
              <HeaderWrapper />
              <main className="space-y-8 pb-8 px-4">{children}</main>
            </div>
            <Toaster />
          </MonthProvider>
        </BuildingProvider>
      </body>
    </html>
  );
}
