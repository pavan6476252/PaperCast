import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getEngineeringPosts } from "@/lib/engineering";

export const metadata: Metadata = {
  title: "Engineering & Case Studies | PaperCast",
  description:
    "Deep-dive technical explorations and capabilities of the PaperCast builder. Read our engineering blog and case studies.",
};

export default function EngineeringIndexPage() {
  const posts = getEngineeringPosts();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
          Engineering & Case Studies
        </h1>
        <p className="text-xl text-foreground/80 leading-relaxed">
          Deep dives into the architecture, capabilities, and real-world usage
          of the PaperCast engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/engineering/${post.slug}`}
            className="group block overflow-hidden rounded-2xl border border-border bg-surface/50 transition-all hover:shadow-lg hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden border-b border-border bg-black/5 dark:bg-white/5 flex items-center justify-center p-4">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <span>{post.author}</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-foreground/80 leading-relaxed line-clamp-3">
                {post.description}
              </p>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full text-center py-24 text-foreground/60">
            No case studies found. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
