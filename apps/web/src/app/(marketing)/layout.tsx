import Link from "next/link";
import React from "react";
import { MarketingHeader } from "../../components/marketing/MarketingHeader";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden transition-colors">
      <MarketingHeader />
      <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
