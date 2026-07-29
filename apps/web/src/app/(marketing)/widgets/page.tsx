"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { WidgetViewer } from "../../../components/showcase/WidgetViewer";
import { widgets } from "../../../registry/widgets";

// Group widgets by category
const CATEGORIES = [
  { id: "headers", label: "Headers" },
  { id: "footers", label: "Footers" },
  { id: "tables", label: "Tables" },
  { id: "layout", label: "Layout & Blocks" },
  { id: "advanced", label: "Advanced" },
];

function WidgetsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const widgetParam = searchParams.get("widget");
  const activeWidgetId =
    widgetParam && widgets.some((w) => w.id === widgetParam)
      ? widgetParam
      : widgets[0]?.id;

  const activeWidget =
    widgets.find((w) => w.id === activeWidgetId) || widgets[0];

  const handleWidgetChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("widget", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-72 shrink-0 border-r border-slate-200 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-8">
          Widget Registry
        </h2>
        <nav className="space-y-10">
          {CATEGORIES.map((category, idx) => {
            const categoryWidgets = widgets.filter(
              (w) => w.categoryId === category.id
            );
            if (categoryWidgets.length === 0) return null;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
                  {category.label}
                </h3>
                <ul className="space-y-1 relative">
                  {categoryWidgets.map((widget) => {
                    const isActive = activeWidgetId === widget.id;
                    return (
                      <li key={widget.id} className="relative">
                        {isActive && (
                          <motion.div
                            layoutId="activeWidgetBackground"
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
                          onClick={() => handleWidgetChange(widget.id)}
                          className={`relative z-10 w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive
                              ? "text-blue-700"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          {widget.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden bg-slate-50/50">
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col overflow-y-auto pr-2">
          {activeWidget ? (
            <motion.div
              key={activeWidget.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <WidgetViewer
                title={activeWidget.title}
                description={activeWidget.description}
                schema={activeWidget.schema}
              />
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>No widgets found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function WidgetsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
          Loading widgets...
        </div>
      }
    >
      <WidgetsContent />
    </Suspense>
  );
}
