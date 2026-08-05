"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOC_CATEGORIES } from "../../app/(marketing)/docs/config";

export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={
        className ||
        "w-full md:w-64 lg:w-72 shrink-0 border-r border-slate-200/60 dark:border-border bg-white/60 dark:bg-background/60 backdrop-blur-xl p-6 overflow-y-auto relative hidden md:block"
      }
    >
      {/* Background blobs for sidebar */}
      <div className="absolute top-0 -left-10 w-40 h-40 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[50px] opacity-40 animate-blob pointer-events-none"></div>

      <div className="relative z-10">
        {DOC_CATEGORIES.map((category, catIndex) => (
          <div key={category.title} className={catIndex > 0 ? "mt-8" : ""}>
            <h2 className="text-sm font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-4 px-3">
              {category.title}
            </h2>
            <nav className="space-y-1">
              {category.pages.map((page) => {
                const isActive = pathname === `/docs/${page.id}`;
                return (
                  <Link
                    key={page.id}
                    href={`/docs/${page.id}`}
                    className={`relative z-10 w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "text-slate-900 dark:text-foreground bg-slate-100 dark:bg-surface"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-50 dark:hover:bg-surface"
                    }`}
                  >
                    <span className="relative z-10">{page.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
