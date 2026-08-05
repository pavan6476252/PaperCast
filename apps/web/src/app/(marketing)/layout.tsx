import React from "react";
import { MarketingHeader } from "../../components/marketing/MarketingHeader";
import { getLatestVersion } from "../../lib/version";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const version = await getLatestVersion();

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden transition-colors">
      <MarketingHeader version={version} />
      <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
