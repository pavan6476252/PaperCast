"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DOC_CATEGORIES, DocCategory } from "../../app/(marketing)/docs/config";

export function DocsIndexClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DOC_CATEGORIES;

    const query = searchQuery.toLowerCase();
    const result: DocCategory[] = [];

    DOC_CATEGORIES.forEach((category) => {
      const filteredPages = category.pages.filter(
        (page) =>
          page.title.toLowerCase().includes(query) ||
          page.description.toLowerCase().includes(query)
      );

      if (filteredPages.length > 0) {
        result.push({
          ...category,
          pages: filteredPages,
        });
      }
    });

    return result;
  }, [searchQuery]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-12 animate-fade-in-up">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight mb-6">
          Documentation Hub
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Everything you need to build, validate, and render complex documents
          and PDFs with FormCast.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl leading-5 bg-transparent placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-lg transition-all shadow-sm hover:shadow-md focus:shadow-lg"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-16">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No documentation found for "{searchQuery}".
          </div>
        ) : (
          filteredCategories.map((category, catIndex) => (
            <div key={category.title} className="relative">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-2 h-6 rounded-full mr-3"></span>
                {category.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.pages.map((page, pageIndex) => (
                  <Link
                    key={page.id}
                    href={`/docs/${page.id}`}
                    className="group relative flex flex-col p-6 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    style={{
                      animationDelay: `${catIndex * 0.1 + pageIndex * 0.05}s`,
                    }}
                  >
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                        {page.description}
                      </p>

                      <div className="flex items-center text-blue-600 font-medium text-sm mt-auto group-hover:translate-x-1 transition-transform">
                        Read guide
                        <svg
                          className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
