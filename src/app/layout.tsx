import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import { fetchData, DashboardData } from "../utils/dataFetcher";

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

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "A place to track admin in and out expenses",
};

async function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const data = await fetchData(); // Fetch data from multiple tables
  return <RootLayout data={data}>{children}</RootLayout>;
}

// Main Layout Component
function RootLayout({
  children,
  data,
}: {
  children: React.ReactNode;
  data: DashboardData;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased space-y-6 bg-neutral-100`}
      >
        <Header />
        <main className="space-y-8 pb-24 px-4">
          {React.cloneElement(children as React.ReactElement, { data })}
        </main>
      </body>
    </html>
  );
}

export default RootLayoutWrapper;
