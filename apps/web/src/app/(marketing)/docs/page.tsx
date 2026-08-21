import React from "react";
import { Metadata } from "next";
import { DocsIndexClient } from "../../../components/docs/DocsIndexClient";

export const metadata: Metadata = {
  title: "Documentation | PaperCast",
  description:
    "Comprehensive documentation, guides, and API reference for PaperCast. Learn how to build, validate, and render complex documents and PDFs.",
  keywords: [
    "PaperCast",
    "Documentation",
    "PDF",
    "React",
    "Next.js",
    "Document Builder",
    "Agentic Document Generation",
  ],
  openGraph: {
    title: "Documentation | PaperCast",
    description:
      "Learn how to build, validate, and render complex documents and PDFs with PaperCast.",
    url: "https://paper-cast-web.vercel.app/docs",
    siteName: "PaperCast",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation | PaperCast",
    description:
      "Learn how to build, validate, and render complex documents and PDFs with PaperCast.",
  },
};

export default function DocsIndexPage() {
  return <DocsIndexClient />;
}
