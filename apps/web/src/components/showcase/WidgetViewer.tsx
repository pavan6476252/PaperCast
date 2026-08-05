"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { codeToHtml } from "shiki";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentPreview } from "../renderer/DocumentPreview";
import { DocumentSchema } from "@papercast/core";

interface WidgetViewerProps {
  title: string;
  description?: string;
  schema: DocumentSchema;
}

export const WidgetViewer: React.FC<WidgetViewerProps> = ({
  title,
  description,
  schema,
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [isClient, setIsClient] = useState(false);

  const jsonString = JSON.stringify(schema, null, 2);

  useEffect(() => {
    setIsClient(true);
    let isMounted = true;
    async function highlight() {
      const html = await codeToHtml(jsonString, {
        lang: "json",
        theme: "github-dark", // use dark theme for the code block to make it look premium
      });
      if (isMounted) setHtmlCode(html);
    }
    highlight();
    return () => {
      isMounted = false;
    };
  }, [jsonString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-background rounded-2xl shadow-sm border border-slate-200 dark:border-border overflow-hidden">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-border bg-white dark:bg-background p-6 shrink-0 z-20">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-foreground tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex bg-slate-100 dark:bg-surface p-1 rounded-xl border border-slate-200/60 dark:border-border relative">
            {["preview", "code"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`relative px-5 py-2 text-sm font-semibold rounded-lg transition-colors z-10 capitalize ${
                    isActive
                      ? "text-slate-900 dark:text-foreground"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white dark:bg-background rounded-lg shadow-sm border border-slate-200/50 dark:border-border"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-20">{tab}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={handleCopy}
            className="group relative flex items-center justify-center p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground bg-white dark:bg-background border border-slate-200 dark:border-border hover:border-slate-300 dark:hover:border-slate-600 shadow-sm rounded-xl transition-all active:scale-95"
            title="Copy JSON Schema"
          >
            {copied ? (
              <Check size={18} className="text-green-600" />
            ) : (
              <Copy size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col relative bg-slate-50/30 dark:bg-background overflow-hidden min-h-[500px] z-10">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeTab === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col p-4 sm:p-8 overflow-auto z-10"
            >
              <div className="w-full max-w-3xl mx-auto my-auto bg-white dark:bg-background border border-slate-200/80 dark:border-border shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(255,255,255,0.05)] rounded-sm overflow-hidden flex flex-col transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] shrink-0">
                {isClient ? (
                  <DocumentPreview schemaData={schema} hideToolbar={true} />
                ) : (
                  <div className="flex-1 flex items-center justify-center p-12 text-slate-400 dark:text-slate-500">
                    Loading Preview...
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 overflow-auto p-6 z-10"
            >
              <div className="w-full h-full max-w-4xl mx-auto rounded-xl bg-[#0d1117] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                {/* Mac OS Window Header */}
                <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-800 shrink-0">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex-1 flex justify-center text-xs font-mono text-slate-400 opacity-70">
                    schema.json
                  </div>
                </div>
                {/* Code Content */}
                <div className="flex-1 overflow-auto p-6">
                  {htmlCode ? (
                    <div
                      className="text-sm font-mono [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0"
                      dangerouslySetInnerHTML={{ __html: htmlCode }}
                    />
                  ) : (
                    <div className="text-sm text-slate-500 flex items-center">
                      <Terminal className="w-4 h-4 mr-2 animate-pulse" />{" "}
                      Formatting code...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
