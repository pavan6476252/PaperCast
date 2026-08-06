import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/marketing/Footer";

export default function PrivacyPage() {
  return (
    <>
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-foreground/50 mb-8 animate-fade-in">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-foreground">Privacy Policy</span>
        </div>

        <div className="space-y-12 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Privacy policy
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl leading-relaxed">
              We take your privacy seriously. Mostly because we do not have the
              server budget to store your data anyway.
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/80">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                1. Data collection
              </h2>
              <p className="leading-relaxed">
                We do not secretly send your JSON schemas to a remote server. We
                are not listening in on your private data. Everything you build
                in the playground stays entirely in your browser's IndexedDB.
                You own your schemas.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                2. PDF generation
              </h2>
              <p className="leading-relaxed">
                When you export a PDF using our Vercel API, the JSON is
                processed by a serverless Chromium instance. It is generated,
                returned to you, and immediately destroyed. We keep zero logs of
                your document contents. Why hoard your private documents? We do
                not want that responsibility.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                3. Analytics
              </h2>
              <p className="leading-relaxed mb-6">
                We might use basic anonymous analytics to know if anyone is
                actually visiting the site. If nobody visits, we will channel
                our inner Brahmanandam and stare blankly at the screen waiting
                for traffic.
              </p>

              <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border shadow-lg mt-6">
                <Image
                  src="/brahmanandam-thinking.gif"
                  alt="Brahmanandam waiting blankly"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
