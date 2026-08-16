"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PartyPopper } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { PlaygroundButton } from "./PlaygroundButton";
import { McpLink } from "./McpLink";

const navLinks = [
  { label: "Widgets", href: "/widgets" },
  { label: "Snippets", href: "/snippets" },
  { label: "Documentation", href: "/docs" },
  { label: "Engineering", href: "/engineering" },
  { label: "Changelog", href: "/changelog" },
  { label: "MCP Server", href: "/docs/mcp-introduction" },
];

export function MarketingHeader({ version }: { version: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const pathname = usePathname();

  // Handle What's New version tracking
  useEffect(() => {
    const lastSeen = localStorage.getItem("last_seen_version");
    if (lastSeen && lastSeen !== version) {
      setShowWhatsNew(true);
    }
    if (version) {
      localStorage.setItem("last_seen_version", version);
    }
  }, [version]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <AnimatePresence>
        {showWhatsNew && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/40 backdrop-blur-sm p-4"
          >
            <div className="relative overflow-hidden bg-surface/60 backdrop-blur-3xl border border-border/50 p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] max-w-sm w-full flex flex-col items-center text-center ring-1 ring-border/20">
              {/* Subtle glass gradient highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none rounded-[2rem]" />

              <div className="relative z-10 w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6 ring-4 ring-border/30 shadow-inner">
                <PartyPopper className="w-8 h-8" />
              </div>
              <h2 className="relative z-10 text-xl font-bold tracking-tight mb-3 text-foreground">
                PaperCast {version} is here!
              </h2>
              <p className="relative z-10 text-foreground/70 mb-8 text-sm leading-relaxed">
                We've just released some exciting new features and improvements.
                Check out the changelog to see what's new.
              </p>
              <div className="relative z-10 flex flex-col w-full gap-2">
                <Link
                  href="/changelog"
                  onClick={() => setShowWhatsNew(false)}
                  className="w-full bg-accent/10 backdrop-blur-md border border-accent/20 text-accent py-3 rounded-xl font-medium shadow-sm hover:bg-accent/20 hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Read the Changelog
                </Link>
                <button
                  onClick={() => setShowWhatsNew(false)}
                  className="w-full py-2.5 rounded-xl font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="shrink-0 sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6 md:gap-10">
            <Link
              href="/"
              className="flex items-center space-x-2 z-50 relative"
            >
              <span className="inline-block font-bold">PaperCast</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 items-center">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const isMcp = link.label === "MCP Server";

                if (isMcp) {
                  return (
                    <McpLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                    />
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center text-sm transition-all duration-300 ${
                      isActive
                        ? "font-bold text-foreground"
                        : "font-medium text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <PlaygroundButton />
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-2 z-50 relative">
              <ThemeToggle />
              <button
                className="p-2 text-foreground hover:bg-surface rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background md:hidden pt-20 px-6 flex flex-col h-[100dvh]"
          >
            <nav className="flex flex-col gap-6 mt-8 flex-1 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const isMcp = link.label === "MCP Server";

                if (isMcp) {
                  return (
                    <McpLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      isMobile
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-2xl tracking-tight transition-colors flex items-center ${
                      isActive
                        ? "font-extrabold text-foreground"
                        : "font-bold text-foreground/80 hover:text-foreground"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="pb-10 pt-6 border-t border-border mt-auto flex flex-col items-center gap-4">
              <div className="w-full flex justify-center">
                <PlaygroundButton />
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                v{version}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
