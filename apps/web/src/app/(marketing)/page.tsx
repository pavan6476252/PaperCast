import Link from "next/link";
import React from "react";
import { FloatingIcons } from "../../components/marketing/FloatingIcons";

export default function LandingPage() {
  return (
    <div className="relative flex flex-col items-center overflow-x-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
      <div
        className="absolute top-0 -right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-5xl px-4 pt-32 pb-20 text-center flex flex-col items-center">
        <div
          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-700 mb-8 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          Now available in early access
        </div>

        <h1
          className="relative text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-[5.5rem] leading-[1.1] text-slate-900 mb-8 opacity-0 animate-fade-in-up"
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
          className="max-w-2xl text-lg text-slate-600 sm:text-xl leading-relaxed opacity-0 animate-fade-in-up"
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
            className="group relative w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
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
            className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-8 py-3 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
          >
            Browse Widgets
          </Link>
        </div>
      </div>

      {/* Grid of features */}
      <div
        className="w-full max-w-6xl mx-auto px-4 py-24 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Visual Playground",
              desc: "Drag, drop, and configure components in real-time with our interactive Monaco-powered editor.",
              icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
              color: "text-blue-600",
              bg: "bg-blue-100",
            },
            {
              title: "JSON Schema Driven",
              desc: "Every document is backed by a strict JSON Schema, meaning 100% reproducible and programmatic generation.",
              icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
              color: "text-violet-600",
              bg: "bg-violet-100",
            },
            {
              title: "Auto-Pagination Engine",
              desc: "Our engine intelligently measures elements offscreen and paginates your content seamlessly.",
              icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              color: "text-pink-600",
              bg: "bg-pink-100",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-3xl p-[1px] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden bg-white/60"
            >
              {/* Spinning conic gradient border effect */}
              <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e2e8f0_0%,#e2e8f0_50%,#3b82f6_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Default static border */}
              <div className="absolute inset-0 rounded-3xl border border-slate-200/50 group-hover:opacity-0 transition-opacity duration-500"></div>

              <div className="relative h-full w-full bg-white/90 backdrop-blur-xl rounded-[23px] p-8 z-10 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[23px]"></div>
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
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Large Modern Footer (moved from layout to scroll with the page) */}
      <footer className="w-full shrink-0 border-t border-slate-200 bg-white pt-16 pb-8 relative z-20 mt-12">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-12">
            <div className="md:col-span-5">
              <Link href="/" className="flex items-center space-x-2 mb-6 group">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                  F
                </div>
                <span className="inline-block font-extrabold text-2xl tracking-tight text-slate-900">
                  PaperCast
                </span>
              </Link>
              <p className="text-slate-500 text-base leading-relaxed max-w-sm mb-8">
                The modern, schema-first document builder for creating
                pixel-perfect, auto-paginated PDFs and reports with ease.
              </p>
              <div className="flex gap-4">
                {[
                  {
                    name: "GitHub",
                    url: "https://github.com/pavan6476252",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    ),
                  },
                  {
                    name: "Twitter",
                    url: "https://x.com/Pavan_kumar_TG",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Reddit",
                    url: "https://www.reddit.com/user/pavan_meesala/",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                        <path d="M20 12c0-1.66-1.34-3-3-3-.76 0-1.44.29-1.96.76C13.62 8.79 12.85 8.5 12 8.5V6.75l2.4.52.06.01c.21 1.08 1.16 1.88 2.29 1.88 1.28 0 2.33-1.04 2.33-2.33S18.03 4.5 16.75 4.5c-.93 0-1.74.55-2.11 1.34l-2.9-.63c-.15-.03-.31.05-.36.2l-1.55 7.15c-.86.28-1.63.57-2.28 1.22C6.78 9.29 6.1 9 5.34 9 3.68 9 2.34 10.34 2.34 12c0 1.1.59 2.06 1.48 2.59-.05.23-.07.47-.07.72 0 2.76 3.69 5 8.25 5s8.25-2.24 8.25-5c0-.25-.02-.49-.07-.72C21.07 14.06 21.66 13.1 21.66 12z" />
                        <path d="M8.5 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm7 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-4.75 2.5c.35.35.83.5 1.25.5s.9-.15 1.25-.5l.54.54c-.49.49-1.14.71-1.79.71s-1.3-.22-1.79-.71l.54-.54z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Instagram",
                    url: "https://www.instagram.com/pavan_kumar_bluetick/",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    ),
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all hover:-translate-y-1"
                  >
                    <span className="sr-only">{social.name}</span>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 md:col-start-8">
              <h3 className="font-bold text-slate-900 mb-5">Product</h3>
              <ul className="space-y-3.5">
                {[
                  { label: "Playground", href: "/playground" },
                  { label: "Widget Registry", href: "/widgets" },
                  { label: "Documentation", href: "/docs" },
                  { label: "Templates", href: "/templates" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-bold text-slate-900 mb-5">Legal</h3>
              <ul className="space-y-3.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} PaperCast Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">♥</span>
              <span>by Pavan kumar</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
