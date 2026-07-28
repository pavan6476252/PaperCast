"use client";

import React, { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export function TableOfContents({ source }: { source: string }) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Parse the MDX source for headings (naive approach for now)
    const lines = source.split("\n");
    const foundHeadings: TOCItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        // Create an ID similarly to how rehype-slug would
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        foundHeadings.push({ id, title, level });
      }
    });

    setHeadings(foundHeadings);
  }, [source]);

  useEffect(() => {
    // Intersection Observer to highlight active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } // Adjust as needed
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">On this page</h3>
      <nav className="flex flex-col space-y-2.5">
        {headings.map((heading, i) => (
          <a
            key={i}
            href={`#${heading.id}`}
            className={`text-sm transition-colors duration-200 ${
              heading.level === 3 ? "ml-4" : ""
            } ${
              activeId === heading.id
                ? "text-blue-600 font-medium"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {heading.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
