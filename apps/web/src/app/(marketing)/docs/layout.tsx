import React from "react";
import { DocsSidebar } from "../../../components/docs/DocsSidebar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-background relative overflow-hidden">
      {/* Background blobs for the whole docs section to match landing page */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob pointer-events-none"></div>

      <DocsSidebar />
      <main className="flex-1 overflow-y-auto relative z-10">{children}</main>
    </div>
  );
}
