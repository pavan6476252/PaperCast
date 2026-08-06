import React from "react";
import { useMcpSync } from "../../hooks/useMcpSync";
import { motion } from "framer-motion";

export const McpStatusBadge: React.FC = () => {
  const { isConnected, sessionId } = useMcpSync();

  return (
    <div className="absolute bottom-4 left-4 z-50 print:hidden hidden md:block">
      {isConnected ? (
        <div className="relative group cursor-default">
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="relative z-10 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border border-green-500/20 dark:border-green-500/20 text-xs font-medium text-green-700 dark:text-green-400 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 dark:from-green-500/10 dark:via-emerald-500/10 dark:to-green-500/10 bg-[length:200%_200%]"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <motion.span
                animate={{ scale: [1, 2.5], opacity: [0.7, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inline-flex h-full w-full rounded-full bg-green-500 dark:bg-green-400"
              ></motion.span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-400"></span>
            </span>
            <span>MCP Connected: {sessionId}</span>
          </motion.div>
        </div>
      ) : (
        <div className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border border-border text-xs font-medium bg-background text-foreground/50 transition-colors">
          <div className="w-2 h-2 rounded-full bg-foreground/30 shrink-0" />
          <span>MCP Disconnected</span>
        </div>
      )}
    </div>
  );
};
