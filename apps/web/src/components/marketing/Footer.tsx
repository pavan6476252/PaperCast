import React from "react";
import Link from "next/link";
import { getLatestVersion } from "../../lib/version";

export async function Footer() {
  const version = await getLatestVersion();
  return (
    <footer className="w-full shrink-0 border-t border-border bg-background pt-16 pb-8 relative z-20 mt-12">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                P
              </div>
              <span className="inline-block font-extrabold text-2xl tracking-tight text-foreground">
                PaperCast
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-sm mb-8">
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
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
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
                  className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 dark:hover:border-blue-800 transition-all hover:-translate-y-1"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <h3 className="font-bold text-foreground mb-5">Product</h3>
            <ul className="space-y-3.5">
              {[
                { label: "Playground", href: "/playground" },
                { label: "Widget Registry", href: "/widgets" },
                { label: "Documentation", href: "/docs" },
                { label: "Templates", href: "/templates" },
                { label: "Changelog", href: "/changelog" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-bold text-foreground mb-5">Legal</h3>
            <ul className="space-y-3.5">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} PaperCast Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default">
              v{version}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 bg-surface px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">♥</span>
              <span>by Pavan kumar</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
