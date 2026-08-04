"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { codeToHtml } from "shiki";
import { DocumentPreview } from "../renderer/DocumentPreview";
import { DocumentSchema } from "@papercast/core";
import { registerDefaultWidgets } from "@papercast/react/widgets";

registerDefaultWidgets();

interface WidgetCardProps {
  title: string;
  description?: string;
  schema: DocumentSchema;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  description,
  schema,
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");

  const jsonString = JSON.stringify(schema, null, 2);

  useEffect(() => {
    async function highlight() {
      const html = await codeToHtml(jsonString, {
        lang: "json",
        theme: "github-light",
      });
      setHtmlCode(html);
    }
    highlight();
  }, [jsonString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex bg-slate-200/50 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === "preview"
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === "code"
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Code
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
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
      <div className="bg-white min-h-[400px] flex flex-col">
        {activeTab === "preview" ? (
          <div className="relative flex-1 w-full max-h-[600px] overflow-hidden flex flex-col p-4 bg-slate-100 items-center justify-center">
            {/* We constrain the preview so it acts like a neat component frame */}
            <div className="w-full h-full border border-slate-200 shadow-xl overflow-hidden rounded-md flex flex-col">
              <DocumentPreview schemaData={schema} hideToolbar={true} />
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full max-h-[600px] overflow-auto bg-white p-4">
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
