import React from "react";
import { Metadata } from "next";
import { DocsIndexClient } from "../../../components/docs/DocsIndexClient";

export const metadata: Metadata = {
  title: "Documentation | FormCast",
  description:
    "Comprehensive documentation, guides, and API reference for FormCast. Learn how to build, validate, and render complex documents and PDFs.",
  keywords: [
    "FormCast",
    "Documentation",
    "PDF",
    "React",
    "Next.js",
    "Document Builder",
    "Agentic Document Generation",
  ],
  openGraph: {
    title: "Documentation | FormCast",
    description:
      "Learn how to build, validate, and render complex documents and PDFs with FormCast.",
    url: "https://formcast.dev/docs",
    siteName: "FormCast",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation | FormCast",
    description:
      "Learn how to build, validate, and render complex documents and PDFs with FormCast.",
  },
};

export default function DocsIndexPage() {
  return <DocsIndexClient />;
}
