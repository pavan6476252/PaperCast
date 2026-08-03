"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Plus, Code, Eye, ExternalLink, X } from "lucide-react";
import { SchemaSnippet } from "@formcast/core";
import { SnippetPreview } from "./SnippetPreview";

interface SnippetCardProps {
  snippet: SchemaSnippet;
  onInsert?: (snippet: SchemaSnippet) => void;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onInsert,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState<"preview" | "code">("preview");

  const handleCopy = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const jsonString = JSON.stringify(snippet.schema, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOpenPlayground = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sessionStorage.setItem(
      "formcast_schema",
      JSON.stringify(snippet.schema, null, 2)
    );
    window.open("/playground", "_blank");
  };

  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDialogOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDialogOpen(false);
    };
    if (isDialogOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDialogOpen]);

  return (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >
        {/* Preview Container - Fixed aspect ratio to keep cards uniform */}
        <div className="relative w-full h-[280px] bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center">
          <SnippetPreview schema={snippet.schema} scale="auto" />

          {/* Overlay actions (Copy / Insert) visible on hover */}
          <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
            <div
              className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-full shadow-lg border border-slate-200 hover:text-blue-600 transition-colors"
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
              {onInsert && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsert(snippet);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Insert
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Meta */}
        <div className="p-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">
              {snippet.name}
            </h3>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {snippet.category}
            </span>
          </div>
          <p className="text-sm text-slate-500 line-clamp-2">
            {snippet.description}
          </p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {snippet.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Full Screen Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsDialogOpen(false)}
          />

          {/* Dialog Content */}
          <div className="relative flex flex-col bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm z-10 shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate max-w-[150px] sm:max-w-xs">
                  {snippet.name}
                </h2>
                <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setDialogTab("preview")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      dialogTab === "preview"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Eye size={16} /> Preview
                  </button>
                  <button
                    onClick={() => setDialogTab("code")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      dialogTab === "code"
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Code size={16} /> Code
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleOpenPlayground}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="hidden sm:inline">Open in Playground</span>
                  <span className="sm:hidden">Playground</span>
                  <ExternalLink size={16} />
                </button>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="flex md:hidden bg-slate-50 p-2 border-b border-slate-100 shrink-0">
              <div className="flex w-full bg-slate-200/50 p-1 rounded-lg">
                <button
                  onClick={() => setDialogTab("preview")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    dialogTab === "preview"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Eye size={16} /> Preview
                </button>
                <button
                  onClick={() => setDialogTab("code")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    dialogTab === "code"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Code size={16} /> Code
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden bg-slate-50/50 relative">
              {dialogTab === "preview" ? (
                <div className="absolute inset-0 overflow-auto flex items-start justify-center p-4">
                  <div className="w-full max-w-[900px] bg-white shadow-xl rounded-lg border border-slate-100 overflow-hidden transform-origin-top transition-transform duration-300">
                    <SnippetPreview schema={snippet.schema} scale={1} />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 overflow-auto p-4 md:p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Schema JSON
                    </h3>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-lg shadow-sm border border-slate-200 hover:text-blue-600 transition-colors"
                    >
                      {copied ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                      {copied ? "Copied!" : "Copy JSON"}
                    </button>
                  </div>
                  <pre className="flex-1 bg-slate-900 text-slate-50 p-4 sm:p-6 rounded-2xl overflow-auto text-xs sm:text-sm font-mono leading-relaxed shadow-inner">
                    <code>{JSON.stringify(snippet.schema, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
