import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Footer } from "../../../components/marketing/Footer";

export default function TermsPage() {
  return (
    <>
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-foreground/50 mb-8 animate-fade-in">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-foreground">Terms of Service</span>
        </div>

        <div className="space-y-12 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Terms of service
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl leading-relaxed">
              It is open source. Are you expecting strict corporate terms?
              Anyway, if you insist, here we go…
            </p>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/80">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                1. Usage rules
              </h2>
              <p className="leading-relaxed">
                We do not compromise on fair use. Do not use PaperCast to
                generate spam, malicious documents, or fake invoices to fool
                your accountant. The tool is free and open source, so please use
                it responsibly to build beautiful schemas and PDFs.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                2. Liability
              </h2>
              <p className="leading-relaxed">
                Since you are running this locally or hosting it yourself, your
                data is your responsibility. If you delete your browser database
                or clear your local storage, your schemas are gone. We cannot
                recover them for you because we do not have them.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                3. Open source licensing
              </h2>
              <p className="leading-relaxed">
                You can fork this repository and build upon it under the MIT
                License. If you try to patent our code and sell it back to us,
                we will be very disappointed. Respect the open-source community
                and contribute back if you make something awesome!
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
