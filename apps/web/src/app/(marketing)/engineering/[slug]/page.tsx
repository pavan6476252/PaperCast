import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getEngineeringPost, getEngineeringPosts } from "@/lib/engineering";
import { WidgetCard } from "@/components/showcase/WidgetCard";
import { TEST_DOCUMENT } from "@papercast/core/test";
import { Callout } from "@/components/docs/Callout";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { codeToHtml } from "shiki";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import fs from "fs";
import path from "path";

function generateSlug(children: React.ReactNode): string {
  if (typeof children === "string")
    return children
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  if (Array.isArray(children)) return children.map(generateSlug).join("-");
  if (
    React.isValidElement(children) &&
    typeof children.props === "object" &&
    children.props !== null &&
    "children" in children.props
  )
    return generateSlug(
      (children.props as { children: React.ReactNode }).children
    );
  return "";
}

// Reuse the same MDX components from the docs
const components = {
  WidgetCard: (
    props: React.ComponentProps<typeof WidgetCard> & {
      schema?: any;
      schemaName?: string;
    }
  ) => {
    let schemaToUse = props.schema || TEST_DOCUMENT;

    if (props.schemaName) {
      try {
        const schemaPath = path.join(
          process.cwd(),
          "public/blog",
          `${props.schemaName}.json`
        );
        const fileContent = fs.readFileSync(schemaPath, "utf-8");
        schemaToUse = JSON.parse(fileContent);
      } catch (e) {
        console.error(`Failed to load ${props.schemaName} schema:`, e);
      }
    }

    return <WidgetCard {...props} schema={schemaToUse} />;
  },
  Callout,
  h1: () => null, // h1 is rendered natively above MDX
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.id || generateSlug(props.children);
    return (
      <h2
        id={id}
        className="text-2xl font-bold tracking-tight text-foreground mt-10 mb-4 border-b border-border pb-2 scroll-mt-24"
        {...props}
      />
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.id || generateSlug(props.children);
    return (
      <h3
        id={id}
        className="text-xl font-semibold tracking-tight text-foreground mt-8 mb-3 scroll-mt-24"
        {...props}
      />
    );
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="leading-7 text-foreground/80 [&:not(:first-child)]:mt-6"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-medium text-accent underline underline-offset-4 hover:text-accent/80 transition-colors"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="my-6 ml-6 list-disc [&>li]:mt-2 text-foreground/80"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground/80"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-accent pl-6 py-2 my-6 italic text-foreground/70 bg-accent/10 rounded-r-lg"
      {...props}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      className="rounded-xl border border-border shadow-md my-8 max-w-full"
      {...props}
    />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-10 border-border" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="relative rounded bg-surface px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground"
      {...props}
    />
  ),
  pre: async (
    props: React.HTMLAttributes<HTMLPreElement> & { children?: React.ReactNode }
  ) => {
    if (
      React.isValidElement(props.children) &&
      props.children.type === "code"
    ) {
      const codeProps = props.children
        .props as React.HTMLAttributes<HTMLElement>;
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
          // Fallback
        }
      }
    }
    return (
      <div className="w-full overflow-x-auto my-6 rounded-xl shadow-lg">
        <pre
          className="m-0 bg-slate-900 py-4 px-4 font-mono text-sm text-slate-50 min-w-full inline-block"
          {...props}
        />
      </div>
    );
  },
  details: (props: React.DetailsHTMLAttributes<HTMLDetailsElement>) => (
    <details
      className="group border border-border rounded-xl p-4 my-6 bg-surface/30 open:bg-surface/50 transition-colors"
      {...props}
    />
  ),
  summary: (props: React.HTMLAttributes<HTMLElement>) => (
    <summary
      className="font-semibold text-foreground cursor-pointer select-none outline-none group-open:mb-4 group-open:border-b group-open:border-border group-open:pb-2"
      {...props}
    />
  ),
};

export function generateStaticParams() {
  const posts = getEngineeringPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getEngineeringPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | PaperCast",
    };
  }

  return {
    title: `${post.title} | PaperCast Engineering`,
    description: post.description,
    openGraph: {
      title: `${post.title} | PaperCast Engineering`,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: `${post.title} | PaperCast Engineering`,
      description: post.description,
    },
  };
}

export default async function EngineeringPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getEngineeringPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    image: post.coverImage,
  };

  return (
    <div className="flex flex-col xl:flex-row w-full animate-fade-in-up">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Main Content Area */}
      <article className="flex-1 min-w-0 w-full max-w-4xl mx-auto px-6 py-12 md:px-12 md:py-16">
        <div className="mb-12">
          <Link
            href="/engineering"
            className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Engineering
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mt-8 text-foreground/60">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold mr-3">
                {post.author.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-sm">
                  {post.author}
                </span>
                <time dateTime={post.date} className="text-xs">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>

        {post.coverImage && (
          <div className="w-full aspect-video md:aspect-[2/1] overflow-hidden rounded-2xl border border-border shadow-md mb-12">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-slate dark:prose-invert prose-blue max-w-none w-full max-w-full break-words overflow-x-hidden prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-accent prose-strong:text-foreground prose-code:text-foreground">
          <MDXRemote
            source={post.content}
            components={components}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </article>

      {/* Right Sidebar - Table of Contents */}
      <div className="hidden xl:block w-64 shrink-0 px-6 py-12">
        <div className="sticky top-24">
          <TableOfContents source={post.content} />
        </div>
      </div>
    </div>
  );
}
