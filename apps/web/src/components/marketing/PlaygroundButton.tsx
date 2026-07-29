"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function PlaygroundButton() {
  return (
    <Link
      href="/playground"
      className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
    >
      <motion.div
        className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#e2e8f0_0%,#3b82f6_50%,#e2e8f0_100%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-900 px-5 py-1 text-sm font-semibold text-white backdrop-blur-3xl transition-colors group-hover:bg-slate-800">
        Go to Playground
        <motion.svg
          className="ml-1.5 w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </motion.svg>
      </div>
    </Link>
  );
}
