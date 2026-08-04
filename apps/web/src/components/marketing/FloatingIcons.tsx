"use client";

import React from "react";
import { motion } from "framer-motion";

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none flex items-center justify-center">
      {/* Document icon */}
      <motion.svg
        initial={{ opacity: 0, y: 10, rotate: -15, scale: 0.8 }}
        animate={{
          opacity: [0, 0.6, 0.6, 0],
          y: [-20, -30, -30, -40],
          rotate: [-15, -5, -5, 5],
          scale: [0.8, 1, 1, 1.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.6, 1],
          delay: 0,
        }}
        className="absolute -top-12 -left-16 w-20 h-20 text-blue-200 dark:text-white/10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </motion.svg>

      {/* Table icon */}
      <motion.svg
        initial={{ opacity: 0, y: 10, rotate: 10, scale: 0.8 }}
        animate={{
          opacity: [0, 0.5, 0.5, 0],
          y: [10, -10, -10, -30],
          rotate: [10, 0, 0, -10],
          scale: [0.8, 1.1, 1.1, 0.9],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.6, 1],
          delay: 2,
        }}
        className="absolute top-4 -right-16 w-24 h-24 text-indigo-200 dark:text-white/10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </motion.svg>

      {/* Code icon */}
      <motion.svg
        initial={{ opacity: 0, y: 20, rotate: -5, scale: 0.9 }}
        animate={{
          opacity: [0, 0.5, 0.5, 0],
          y: [20, 0, 0, -20],
          rotate: [-5, 5, 5, 15],
          scale: [0.9, 1, 1, 1.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.6, 1],
          delay: 4,
        }}
        className="absolute -bottom-16 left-10 w-16 h-16 text-purple-200 dark:text-white/10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </motion.svg>

      {/* Check icon */}
      <motion.svg
        initial={{ opacity: 0, y: 0, rotate: 20, scale: 0.7 }}
        animate={{
          opacity: [0, 0.6, 0.6, 0],
          y: [0, -20, -20, -40],
          rotate: [20, 10, 10, 0],
          scale: [0.7, 1.2, 1.2, 0.8],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.6, 1],
          delay: 1,
        }}
        className="absolute -bottom-10 right-10 w-14 h-14 text-pink-200 dark:text-white/10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </motion.svg>
    </div>
  );
}
