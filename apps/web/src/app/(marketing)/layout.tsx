import Link from "next/link";
import React from "react";
import { PlaygroundButton } from "../../components/marketing/PlaygroundButton";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      <header className="shrink-0 sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-8">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">FormCast</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="/widgets"
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Widgets
              </Link>
              <Link
                href="/snippets"
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Snippets
              </Link>
              <Link
                href="/docs"
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Documentation
              </Link>
              <Link
                href="/docs/mcp-introduction"
                className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                MCP Server
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-4">
              <PlaygroundButton />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
