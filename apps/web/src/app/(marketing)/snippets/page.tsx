"use client";

import { SNIPPETS } from "@papercast/core";
import { motion } from "framer-motion";
import { LayoutTemplate, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { SnippetCard } from "../../../components/snippets/SnippetCard";

// Derived categories from available snippets plus an "all" category
const CATEGORIES = [
  { id: "all", label: "All Snippets" },
  { id: "invoices", label: "Invoices & Billing" },
  { id: "headers", label: "Headers" },
  { id: "footers", label: "Footers" },
  { id: "layouts", label: "Layouts" },
];

function SnippetsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryParam = searchParams.get("category");
  const activeCategoryId =
    categoryParam && CATEGORIES.some((c) => c.id === categoryParam)
      ? categoryParam
      : "all";

  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredSnippets = useMemo(() => {
    return SNIPPETS.filter((snippet) => {
      // Filter by category
      const matchesCategory =
        activeCategoryId === "all" || snippet.category === activeCategoryId;

      // Filter by search query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        snippet.name.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategoryId, searchQuery]);

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 shrink-0 border-r border-slate-200 dark:border-border bg-white dark:bg-background p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <LayoutTemplate size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-foreground">
            Schema Library
          </h2>
        </div>
        <nav className="space-y-4">
          <ul className="space-y-1 relative">
            {CATEGORIES.map((category) => {
              const isActive = activeCategoryId === category.id;
              const count =
                category.id === "all"
                  ? SNIPPETS.length
                  : SNIPPETS.filter((s) => s.category === category.id).length;

              return (
                <li key={category.id} className="relative group">
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBackground"
                      className="absolute inset-0 bg-slate-100 dark:bg-surface rounded-lg z-0"
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
                    className={`relative z-10 w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "text-slate-900 dark:text-foreground"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-50 dark:hover:bg-surface"
                    }`}
                  >
                    <span>{category.label}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white dark:bg-background text-slate-900 dark:text-foreground shadow-sm" : "bg-slate-100 dark:bg-surface text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-background"}`}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden bg-slate-50/50 dark:bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pr-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
              {CATEGORIES.find((c) => c.id === activeCategoryId)?.label ||
                "Schema Snippets"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Browse pre-built PaperCast JSON schemas. Copy and drop them into
              your document.
            </p>
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <input
              type="text"
              placeholder="Search snippets by name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-background text-slate-900 dark:text-foreground placeholder:text-slate-400 shadow-sm"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="w-full flex-1 overflow-y-auto pr-2 pb-8">
          {filteredSnippets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center h-64 text-slate-400 bg-white dark:bg-background rounded-2xl border border-slate-200 dark:border-border shadow-sm border-dashed">
              <Search className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium text-slate-700 dark:text-foreground mb-1">
                No snippets found
              </h3>
              <p>We couldn't find any schemas matching your search.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-slate-100 dark:bg-surface hover:bg-slate-200 dark:hover:bg-surface/80 text-slate-700 dark:text-foreground text-sm font-medium rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SnippetsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 text-slate-500 dark:text-slate-400">
          Loading snippets...
        </div>
      }
    >
      <SnippetsContent />
    </Suspense>
  );
}
