"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, ZoomIn, ZoomOut, ExternalLink } from "lucide-react";
import { codeToHtml } from "shiki";
import { useTheme } from "next-themes";
import { DocumentPreview } from "../renderer/DocumentPreview";
import { DocumentSchema } from "@papercast/core";
import { registerDefaultWidgets } from "@papercast/react/widgets";

registerDefaultWidgets();

interface WidgetCardProps {
  title: string;
  description?: string;
  schema: DocumentSchema;
  zoom?: number;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  description,
  schema,
  zoom,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [currentZoom, setCurrentZoom] = useState<number | undefined>(zoom);
  const [copied, setCopied] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const jsonString = JSON.stringify(schema, null, 2);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function highlight() {
      if (!jsonString) return;
      const html = await codeToHtml(jsonString, {
        lang: "json",
        theme: isDark ? "github-dark" : "github-light",
      });
      setHtmlCode(html);
    }
    highlight();
  }, [jsonString, isDark]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="print:hidden flex flex-col border border-slate-200 dark:border-border rounded-xl overflow-hidden bg-white dark:bg-background shadow-sm my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-border bg-slate-50 dark:bg-surface/50 p-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-foreground">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {activeTab === "preview" && (
            <div className="flex bg-slate-200/50 dark:bg-surface/50 p-0.5 rounded-lg border border-slate-200 dark:border-border">
              <button
                onClick={() =>
                  setCurrentZoom((prev) => Math.max(0.1, (prev ?? 1) - 0.1))
                }
                className="flex items-center justify-center p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground hover:bg-white dark:hover:bg-background rounded-md transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <div className="flex items-center justify-center px-2 text-xs font-medium text-slate-500 dark:text-slate-400 min-w-[3rem]">
                {currentZoom ? `${Math.round(currentZoom * 100)}%` : "Auto"}
              </div>
              <button
                onClick={() => setCurrentZoom((prev) => (prev ?? 1) + 0.1)}
                className="flex items-center justify-center p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground hover:bg-white dark:hover:bg-background rounded-md transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          )}

          <div className="flex bg-slate-200/50 dark:bg-surface/50 p-0.5 rounded-lg border border-slate-200 dark:border-border">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === "preview"
                  ? "bg-white dark:bg-background shadow-sm text-slate-900 dark:text-foreground"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === "code"
                  ? "bg-white dark:bg-background shadow-sm text-slate-900 dark:text-foreground"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Code
            </button>
          </div>

          <a
            href="/playground"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              localStorage.setItem("papercast_schema", jsonString);
            }}
            className="flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/50 dark:hover:bg-surface/50 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-border"
            title="Open in Playground"
          >
            <ExternalLink size={16} />
          </a>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-surface/50 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-border"
            title="Copy JSON Schema"
          >
            {copied ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-background min-h-[400px] flex flex-col">
        {activeTab === "preview" ? (
          <div className="relative flex-1 w-full max-h-[600px] overflow-hidden flex flex-col p-4 bg-slate-100 dark:bg-surface items-center justify-center">
            {/* We constrain the preview so it acts like a neat component frame */}
            <div className="w-full h-full border border-slate-200 dark:border-border shadow-xl overflow-hidden rounded-md flex flex-col">
              {mounted ? (
                <DocumentPreview
                  schemaData={schema}
                  hideToolbar={true}
                  disablePrintStyles={true}
                  zoom={currentZoom}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                  Loading preview...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full max-h-[600px] overflow-auto bg-white dark:bg-background p-4">
            {htmlCode ? (
              <div
                className="text-sm font-mono [&>pre]:!bg-transparent [&>pre]:!p-0"
                dangerouslySetInnerHTML={{ __html: htmlCode }}
              />
            ) : (
              <div className="text-sm text-slate-400">Loading code...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
