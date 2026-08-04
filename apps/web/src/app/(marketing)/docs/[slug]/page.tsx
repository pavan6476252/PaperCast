import React from "react";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { WidgetCard } from "../../../../components/showcase/WidgetCard";
import { TEST_DOCUMENT } from "@formcast/core/test";
// to-replace
import { getDocPageById, DOC_PAGES } from "../config";
import { DocsFooterNav } from "../../../../components/docs/DocsFooterNav";

import { Callout } from "../../../../components/docs/Callout";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { codeToHtml } from "shiki";

// Helper to extract text from children and generate slug
function generateSlug(children: any): string {
  if (typeof children === "string")
    return children
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  if (Array.isArray(children)) return children.map(generateSlug).join("-");
  if (children?.props?.children) return generateSlug(children.props.children);
  return "";
}

// Custom MDX Components for Phase 3 (we can add more later)
const components = {
  WidgetCard: (props: any) => (
    <WidgetCard {...props} schema={props.schema || TEST_DOCUMENT} />
  ),
  Callout: (props: any) => <Callout {...props} />,
  h1: (props: any) => {
    const id = props.id || generateSlug(props.children);
    return (
      <h1
        id={id}
        className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6 group flex items-center scroll-mt-24"
        {...props}
      />
    );
  },
  h2: (props: any) => {
    const id = props.id || generateSlug(props.children);
    return (
      <h2
        id={id}
        className="text-2xl font-bold tracking-tight text-slate-900 mt-10 mb-4 border-b border-slate-200 pb-2 scroll-mt-24"
        {...props}
      />
    );
  },
  h3: (props: any) => {
    const id = props.id || generateSlug(props.children);
    return (
      <h3
        id={id}
        className="text-xl font-semibold tracking-tight text-slate-900 mt-8 mb-3 scroll-mt-24"
        {...props}
      />
    );
  },
  p: (props: any) => (
    <p
      className="leading-7 text-slate-600 [&:not(:first-child)]:mt-6"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-slate-600" {...props} />
  ),
  code: (props: any) => (
    <code
      className="relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900"
      {...props}
    />
  ),
  pre: async (props: any) => {
    if (
      React.isValidElement(props.children) &&
      props.children.type === "code"
    ) {
      const codeProps = props.children.props as any;
      const match = /language-(\w+)/.exec(codeProps.className || "");
      const lang = match ? match[1] : "";
      const code = String(codeProps.children).replace(/\n$/, "");

      if (lang) {
        try {
          const html = await codeToHtml(code, {
            lang,
            theme: "github-dark",
          });
          return (
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              className="[&>pre]:!mb-4 [&>pre]:!mt-6 [&>pre]:!overflow-x-auto [&>pre]:!rounded-xl [&>pre]:!py-4 [&>pre]:!px-4 [&>pre]:!shadow-lg [&>pre]:!text-sm [&>pre]:!font-mono [&>pre]:!bg-slate-900"
            />
          );
        } catch (e) {
          // Ignore error and fallback to default unhighlighted block
        }
      }
    }

    return (
      <pre
        className="mb-4 mt-6 overflow-x-auto rounded-xl bg-slate-900 py-4 px-4 font-mono text-sm text-slate-50 shadow-lg"
        {...props}
      />
    );
  },
};

export function generateStaticParams() {
  return DOC_PAGES.map((page) => ({
    slug: page.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const docPage = getDocPageById(slug);

  if (!docPage) {
    return {
      title: "Page Not Found | FormCast",
    };
  }

  return {
    title: `${docPage.title} | FormCast Documentation`,
    description: docPage.description,
    openGraph: {
      title: `${docPage.title} | FormCast Documentation`,
      description: docPage.description,
      url: `https://formcast.dev/docs/${slug}`,
      siteName: "FormCast",
      type: "article",
    },
    alternates: {
      canonical: `https://formcast.dev/docs/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${docPage.title} | FormCast Documentation`,
      description: docPage.description,
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const docPage = getDocPageById(slug);

  if (!docPage) {
    notFound();
  }

  const filePath = path.join(process.cwd(), "content", "docs", `${slug}.mdx`);
  let mdxSource = "";
  try {
    mdxSource = fs.readFileSync(filePath, "utf-8");
  } catch {
    // Return a beautiful fallback if file doesn't exist yet
    mdxSource = `# Coming Soon\n\nThis documentation page is currently being written. Please check back later!`;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: docPage.title,
    description: docPage.description,
    url: `https://formcast.dev/docs/${slug}`,
    author: {
      "@type": "Organization",
      name: "FormCast",
    },
  };

  return (
    <div className="flex flex-col xl:flex-row w-full animate-fade-in-up">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Main Content Area */}
      <article className="flex-1 min-w-0 max-w-4xl mx-auto px-6 py-12 md:px-12 md:py-16">
        <div className="mb-8">
          <p className="text-blue-600 font-semibold tracking-wide text-sm uppercase mb-2">
            Documentation
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {docPage.title}
          </h1>
          <p className="text-lg text-slate-600 mt-4 leading-relaxed">
            {docPage.description}
          </p>
        </div>

        <div className="prose prose-slate prose-blue max-w-none">
          <MDXRemote source={mdxSource} components={components} />
        </div>

        <DocsFooterNav currentSlug={slug} />
      </article>

      {/* Right Sidebar - Table of Contents */}
      <div className="hidden xl:block w-64 shrink-0 px-6 py-12">
        <div className="sticky top-24">
          <TableOfContents source={mdxSource} />
        </div>
      </div>
    </div>
  );
}
