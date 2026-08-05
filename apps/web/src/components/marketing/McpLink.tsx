"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

// A single sparkle particle
const Sparkle = ({ id, style }: { id: string; style: any }) => {
  return (
    <motion.div
      key={id}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{
        scale: [0, 1.2, 0],
        opacity: [0, 1, 0],
        rotate: [0, 90],
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute pointer-events-none z-0"
      style={style}
    >
      <Sparkles className="w-3 h-3 text-indigo-400/60 dark:text-indigo-300/60" />
    </motion.div>
  );
};

export function McpLink({
  href,
  label,
  isMobile,
  onClick,
}: {
  href: string;
  label: string;
  isMobile?: boolean;
  onClick?: () => void;
}) {
  const [sparkles, setSparkles] = useState<{ id: string; style: any }[]>([]);

  // Generate random sparkles around the button
  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkle = {
        id: String(Date.now()),
        style: {
          // Spawn slightly outside the boundaries for a spreading effect
          top: `${Math.random() * 140 - 20}%`,
          left: `${Math.random() * 140 - 20}%`,
        },
      };
      setSparkles((current) => {
        // Keep only the last 6 sparkles to prevent DOM bloat
        const next = [...current, newSparkle];
        if (next.length > 6) return next.slice(1);
        return next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (isMobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="relative block overflow-visible mt-2"
      >
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-3 w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent py-3 px-4 rounded-xl border-l-4 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-[length:200%_200%] relative"
        >
          <AnimatePresence>
            {sparkles.map((s) => (
              <Sparkle key={s.id} id={s.id} style={s.style} />
            ))}
          </AnimatePresence>
          <span className="relative flex h-3 w-3 z-10 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          <span className="z-10 font-bold">{label}</span>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={href} className="relative block group overflow-visible">
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold bg-[length:200%_200%] shadow-sm group-hover:-translate-y-0.5 transition-transform"
      >
        <AnimatePresence>
          {sparkles.map((s) => (
            <Sparkle key={s.id} id={s.id} style={s.style} />
          ))}
        </AnimatePresence>
        <span className="relative flex h-2 w-2 z-10 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="z-10">{label}</span>
      </motion.div>
    </Link>
  );
}
