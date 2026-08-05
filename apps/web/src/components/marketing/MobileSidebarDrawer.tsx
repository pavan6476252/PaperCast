"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutTemplate, Book, Puzzle } from "lucide-react";
import { usePathname } from "next/navigation";

interface MobileSidebarDrawerProps {
  children: React.ReactNode;
  icon?: "docs" | "widgets" | "snippets";
}

export function MobileSidebarDrawer({
  children,
  icon,
}: MobileSidebarDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const IconComponent =
    icon === "docs" ? Book : icon === "snippets" ? LayoutTemplate : Puzzle;

  return (
    <>
      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
        aria-label="Open Navigation"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          >
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-background border-r border-border shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50 backdrop-blur-md">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Navigation
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-foreground/70 hover:bg-surface hover:text-foreground rounded-md transition-colors"
                  aria-label="Close Navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* We pass the sidebar contents here. They will handle their own padding. */}
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
