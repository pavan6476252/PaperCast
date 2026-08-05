import React from "react";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";

export const metadata: Metadata = {
  title: "Changelog | PaperCast",
  description: "New updates and improvements to PaperCast.",
};

// Custom MDX Components for the Changelog
const components = {
  h1: (props: any) => (
    <h1
      className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-foreground mb-8"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground mt-12 mb-6 border-b border-slate-200 dark:border-border pb-2"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-xl font-semibold tracking-tight text-slate-900 dark:text-foreground mt-8 mb-4"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="leading-7 text-slate-600 dark:text-slate-400 [&:not(:first-child)]:mt-4"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      className="my-6 ml-6 list-disc [&>li]:mt-2 text-slate-600 dark:text-slate-400"
      {...props}
    />
  ),
  li: (props: any) => <li className="leading-7" {...props} />,
  code: (props: any) => (
    <code
      className="relative rounded bg-slate-100 dark:bg-surface px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900 dark:text-foreground"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500"
      {...props}
    />
  ),
  // Custom Badge Component
  Badge: ({ type, children }: { type: string; children: React.ReactNode }) => {
    const typeStyles: Record<string, string> = {
      feature:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      fix: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
      improvement:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      breaking:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    };
    const style =
      typeStyles[type.toLowerCase()] ||
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mr-2 uppercase tracking-wide ${style}`}
      >
        {children}
      </span>
    );
  },
  // Custom Version Wrapper Component
  Version: ({
    version,
    date,
    children,
  }: {
    version: string;
    date: string;
    children: React.ReactNode;
  }) => (
    <div className="relative pl-8 sm:pl-32 py-6 group">
      {/* Timeline line */}
      <div className="absolute top-0 bottom-0 left-0 sm:left-24 w-px bg-slate-200 dark:bg-slate-800 group-last:bottom-auto group-last:h-full"></div>

      {/* Date (Left side on large screens, above on small) */}
      <div className="hidden sm:block absolute left-0 top-8 w-20 text-right text-sm text-slate-500 dark:text-slate-400 font-medium">
        {date}
      </div>

      {/* Timeline dot */}
      <div className="absolute left-[-4px] sm:left-[92px] top-9 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-background"></div>

      {/* Content */}
      <div className="bg-white dark:bg-surface border border-slate-100 dark:border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {date}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground mt-0 mb-4 flex items-center gap-3">
          {version}
        </h2>
        {children}
      </div>
    </div>
  ),
};

export default async function ChangelogPage() {
  const filePath = path.join(process.cwd(), "content", "changelog.mdx");
  let mdxSource = "";

  try {
    mdxSource = await fs.promises.readFile(filePath, "utf-8");
  } catch {
    mdxSource = `# Coming Soon\n\nNo release notes have been published yet.`;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-background animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-white dark:bg-background border-b border-slate-200 dark:border-border pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-foreground tracking-tight mb-4">
            Changelog
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            New updates and improvements to PaperCast. We release features and
            fixes regularly to improve your document building experience.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <article className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
        <div className="prose prose-slate dark:prose-invert prose-blue max-w-none">
          <MDXRemote source={mdxSource} components={components} />
        </div>
      </article>
    </div>
  );
}
