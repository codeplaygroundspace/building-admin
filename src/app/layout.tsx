"use client";

import React, { useState, ReactElement } from "react";
import localFont from "next/font/local";
import "./globals.css";
import MainMenu from "@/components/MainMenu";
import HeaderWrapper from "@/components/HeaderWrapper";

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

interface RootLayoutProps {
  children: ReactElement<{
    selectedMonth: string | null;
    setSelectedMonth: (month: string | null) => void;
  }>;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  console.log("RootLayout in layout: Selected Month:", selectedMonth);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-neutral-100`}
      >
        <MainMenu />
        <HeaderWrapper
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <main className="space-y-8 pb-24 px-4">
          {React.cloneElement(children, { selectedMonth, setSelectedMonth })}
        </main>
      </body>
    </html>
  );
}
