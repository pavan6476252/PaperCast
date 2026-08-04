import React from "react";
import Link from "next/link";
import { getNextPage, getPrevPage } from "../../app/(marketing)/docs/config";

export function DocsFooterNav({ currentSlug }: { currentSlug: string }) {
  const prevPage = getPrevPage(currentSlug);
  const nextPage = getNextPage(currentSlug);

  if (!prevPage && !nextPage) return null;

  return (
    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-border flex flex-col sm:flex-row justify-between gap-4">
      {prevPage ? (
        <Link
          href={`/docs/${prevPage.id}`}
          className="group flex flex-col items-start px-6 py-4 rounded-xl border border-slate-200 dark:border-border bg-white/50 dark:bg-background/50 hover:bg-slate-50 dark:hover:bg-surface transition-colors w-full sm:w-1/2"
        >
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center">
            <svg
              className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </span>
          <span className="text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            {prevPage.title}
          </span>
        </Link>
      ) : (
        <div className="w-full sm:w-1/2"></div>
      )}

      {nextPage ? (
        <Link
          href={`/docs/${nextPage.id}`}
          className="group flex flex-col items-end text-right px-6 py-4 rounded-xl border border-slate-200 dark:border-border bg-white/50 dark:bg-background/50 hover:bg-slate-50 dark:hover:bg-surface transition-colors w-full sm:w-1/2"
        >
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center">
            Next
            <svg
              className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          <span className="text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            {nextPage.title}
          </span>
        </Link>
      ) : (
        <div className="w-full sm:w-1/2"></div>
      )}
    </div>
  );
}
