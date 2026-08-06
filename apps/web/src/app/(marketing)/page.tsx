import Link from "next/link";
import { FloatingIcons } from "../../components/marketing/FloatingIcons";
import { Reveal } from "../../components/marketing/Reveal";
import { Footer } from "../../components/marketing/Footer";
import { getLatestVersion } from "../../lib/version";

export default async function LandingPage() {
  const version = await getLatestVersion();

  return (
    <div className="relative flex flex-col items-center overflow-x-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
      <div
        className="absolute top-0 -right-10 w-96 h-96 bg-blue-300 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 animate-blob"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 animate-blob"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-5xl px-4 pt-32 pb-20 text-center flex flex-col items-center">
        <div
          className="inline-flex items-center rounded-full border border-border/50 bg-surface/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-foreground mb-8 opacity-0 animate-fade-in-up shadow-sm ring-1 ring-black/5 dark:ring-white/5"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
          Now available in early access
        </div>

        <h1
          className="relative text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.1] text-foreground mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Floating Background Icons */}
          <FloatingIcons />
          The Schema-First <br className="hidden sm:inline" />
          <span className="inline-block text-transparent bg-clip-text bg-[linear-gradient(to_right,#2563eb,#c084fc,#2563eb,#c084fc,#2563eb)] bg-[length:200%_auto] animate-gradient-x hover:scale-[1.02] transition-transform duration-300">
            Document Builder
          </span>
        </h1>

        <p
          className="max-w-2xl text-lg text-foreground/70 sm:text-xl leading-relaxed opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          Design, validate, and render complex documents and PDFs dynamically.
          Use our visual playground to build templates backed by strong JSON
          schemas.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Link
            href="/playground"
            className="group relative w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center text-white">
              Start Building
              <svg
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </Link>
          <Link
            href="/widgets"
            className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl border border-border bg-background/80 backdrop-blur-sm px-8 py-3 text-base font-semibold text-foreground/80 shadow-sm transition-all hover:bg-surface hover:border-border/80 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
          >
            Browse Widgets
          </Link>
        </div>
      </div>

      {/* Grid of features */}
      <div className="w-full max-w-6xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Visual Playground",
              desc: "Drag, drop, and configure components in real-time with our interactive Monaco-powered editor.",
              icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-100 dark:bg-blue-900/30",
            },
            {
              title: "JSON Schema Driven",
              desc: "Every document is backed by a strict JSON Schema, meaning 100% reproducible and programmatic generation.",
              icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-100 dark:bg-violet-900/30",
            },
            {
              title: "Auto-Pagination Engine",
              desc: "Our engine intelligently measures elements offscreen and paginates your content seamlessly.",
              icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              color: "text-pink-600 dark:text-pink-400",
              bg: "bg-pink-100 dark:bg-pink-900/30",
            },
          ].map((feature, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="group relative rounded-3xl p-[1px] shadow-sm hover:shadow-xl hover:shadow-foreground/10/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden bg-background/60 h-full">
                {/* Spinning conic gradient border effect */}
                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e2e8f0_0%,#e2e8f0_50%,#3b82f6_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1e293b_0%,#1e293b_50%,#3b82f6_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Default static border */}
                <div className="absolute inset-0 rounded-3xl border border-border/50 group-hover:opacity-0 transition-opacity duration-500"></div>

                <div className="relative h-full w-full bg-background/90 backdrop-blur-xl rounded-[23px] p-6 sm:p-8 z-10 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 dark:from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]"></div>
                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                    >
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={feature.icon}
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
