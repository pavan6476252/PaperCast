import React from "react";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Changelog | PaperCast",
  description: "New updates and improvements to PaperCast.",
};

// Custom MDX Components for the Changelog
const components = {
  h1: (props: any) => (
    <h1
      className="text-4xl font-extrabold tracking-tight text-foreground mb-8"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-2xl font-bold tracking-tight text-foreground mt-12 mb-6 border-b border-border pb-2"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-xl font-semibold tracking-tight text-foreground mt-8 mb-4"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="leading-7 text-foreground/80 [&:not(:first-child)]:mt-4"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      className="my-6 ml-6 list-disc [&>li]:mt-2 text-foreground/80"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground/80"
      {...props}
    />
  ),
  li: (props: any) => <li className="leading-7" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-accent pl-6 py-2 my-6 italic text-foreground/70 bg-accent/10 rounded-r-lg"
      {...props}
    />
  ),
  img: (props: any) => (
    <img
      className="rounded-xl border border-border shadow-md my-8 max-w-full"
      {...props}
    />
  ),
  hr: (props: any) => <hr className="my-10 border-border" {...props} />,
  code: (props: any) => (
    <code
      className="relative rounded bg-surface px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="font-medium text-accent underline underline-offset-4 hover:text-accent/80 transition-colors"
      {...props}
    />
  ),
  // Custom Badge Component
  Badge: ({ type, children }: { type: string; children: React.ReactNode }) => {
    const typeStyles: Record<string, string> = {
      feature:
        "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      fix: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      improvement:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      breaking:
        "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    };
    const style =
      typeStyles[type.toLowerCase()] ||
      "bg-surface text-foreground border-border";

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
      <div className="absolute top-0 bottom-0 left-0 sm:left-24 w-px bg-border group-last:bottom-auto group-last:h-full"></div>

      {/* Date (Left side on large screens, above on small) */}
      <div className="hidden sm:block absolute left-0 top-8 w-20 text-right text-sm text-foreground/60 font-medium">
        {date}
      </div>

      {/* Timeline dot */}
      <div className="absolute left-[-4px] sm:left-[92px] top-9 w-2 h-2 rounded-full bg-accent ring-4 ring-background"></div>

      {/* Content */}
      <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <span className="text-sm text-foreground/60 font-medium">{date}</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0 mb-4 flex items-center gap-3">
          {version}
        </h2>
        {children}
      </div>
    </div>
  ),
  table: (props: any) => (
    <div className="w-full overflow-x-auto my-6 rounded-lg border border-border shadow-sm">
      <table
        className="w-full text-left border-collapse min-w-[500px]"
        {...props}
      />
    </div>
  ),
  thead: (props: any) => <thead className="bg-surface/50" {...props} />,
  tbody: (props: any) => (
    <tbody className="divide-y divide-border/50" {...props} />
  ),
  tr: (props: any) => (
    <tr className="hover:bg-surface/40 transition-colors" {...props} />
  ),
  th: (props: any) => (
    <th
      className="border-b border-border py-3 px-4 text-sm font-semibold text-foreground"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="py-3 px-4 text-sm text-foreground/80 align-top" {...props} />
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
    <div className="w-full min-h-screen bg-background animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-background border-b border-border pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Changelog
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            New updates and improvements to PaperCast. We release features and
            fixes regularly to improve your document building experience.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <article className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
        <div className="prose prose-slate dark:prose-invert prose-blue max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-accent prose-strong:text-foreground prose-code:text-foreground">
          <MDXRemote
            source={mdxSource}
            components={components}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </article>
    </div>
  );
}
