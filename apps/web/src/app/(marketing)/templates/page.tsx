"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Group templates by category
const CATEGORIES = [
  { id: "invoices", label: "Invoices & Billing" },
  { id: "reports", label: "Reports & Data" },
  { id: "proposals", label: "Proposals & Contracts" },
  { id: "letters", label: "Letters & Correspondence" },
  { id: "receipts", label: "Receipts" },
];

function TemplatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryParam = searchParams.get("category");
  const activeCategoryId =
    categoryParam && CATEGORIES.some((c) => c.id === categoryParam)
      ? categoryParam
      : CATEGORIES[0]?.id;

  const handleCategoryChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 shrink-0 border-r border-slate-200 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-8">
          Template Library
        </h2>
        <nav className="space-y-4">
          <ul className="space-y-1 relative">
            {CATEGORIES.map((category) => {
              const isActive = activeCategoryId === category.id;
              return (
                <li key={category.id} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBackground"
                      className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-lg z-0"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <button
                    onClick={() => handleCategoryChange(category.id)}
                    className={`relative z-10 w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {category.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden bg-slate-50/50">
        <div className="flex items-center justify-between mb-8 pr-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {CATEGORIES.find((c) => c.id === activeCategoryId)?.label ||
                "Templates"}
            </h1>
            <p className="text-slate-500 mt-1">
              Browse pre-built templates to get started quickly.
            </p>
          </div>

          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-6xl w-full flex-1 flex flex-col overflow-y-auto pr-2 pb-8">
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm border-dashed">
            <svg
              className="w-16 h-16 mb-4 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-700 mb-1">
              Coming Soon
            </h3>
            <p>Templates for this category are currently under construction.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
          Loading templates...
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
