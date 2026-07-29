import React from "react";
import Link from "next/link";
import { DOC_PAGES } from "./config";

export default function DocsIndexPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-12 animate-fade-in-up">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Everything you need to build, validate, and render complex documents
          and PDFs with FormCast.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOC_PAGES.map((page, i) => (
          <Link
            key={page.id}
            href={`/docs/${page.id}`}
            className="group relative flex flex-col p-6 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col h-full">
              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                {page.title}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                {page.description}
              </p>

              <div className="flex items-center text-blue-600 font-medium text-sm mt-auto">
                Read more
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
  );
}
