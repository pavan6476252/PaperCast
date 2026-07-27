import React, { useState, useCallback } from "react";
import { useDocumentStore } from "../../store/documentStore";
import { NodeRenderer } from "./NodeRenderer";
import { getStyle } from "./utils/styleUtils";
import { OffscreenMeasurer } from "../../engine/OffscreenMeasurer";
import { paginateDocument, PageData } from "../../engine/PaginationEngine";
import { ZoomIn, ZoomOut, Printer, Download } from "lucide-react";
import { RendererProvider } from "./RendererContext";
import "./nodes/basicNodes"; // Register basic nodes
import "./nodes/TableNode";  // Register table node
import { Measurements } from "@/types/schema";

type PreviewTab = "content" | "headers" | "footers";

export const DocumentPreview: React.FC = () => {
  const parsedDocument = useDocumentStore((state) => state.parsedDocument);
  const isValid = useDocumentStore((state) => state.isValid);
  const setJsonString = useDocumentStore((state) => state.setJsonString);
  const jsonString = useDocumentStore((state) => state.jsonString);

  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<PreviewTab>("content");
  const [pages, setPages] = useState<PageData[] | null>(null);

  const updateMeta = (updates: any) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.meta) parsed.meta = {};
      parsed.meta = { ...parsed.meta, ...updates };
      setJsonString(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // ignore JSON parse error while typing
    }
  };

  if (!parsedDocument) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">No valid document.</div>;
  }

  // Extract meta for page sizing
  const { pageSize, orientation } = parsedDocument.meta;
  const PAGE_SIZES = {
    A4: { width: 794, height: 1123 },
    A3: { width: 1123, height: 1587 },
    Letter: { width: 816, height: 1056 },
  } as const;

  let width: number;
  let height: number;

  if (typeof pageSize === "object") {
    ({ widthPx: width, heightPx: height } = pageSize);
  } else {
    ({ width, height } = PAGE_SIZES[pageSize]);
  }

  if (orientation === "landscape") {
    [width, height] = [height, width];
  }

  const [isSaving, setIsSaving] = useState(false);

  const handleMeasure = useCallback((measurements: Measurements) => {
    const newPages = paginateDocument(parsedDocument, height, measurements);
    setPages(newPages);
  }, [parsedDocument, height]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!isValid || !jsonString) return;
    
    try {
      setIsSaving(true);
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonString // Send the full schema as JSON string in body
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error generating PDF");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-hidden">
      <style>
        {`
          @media print {
            @page {
              size: ${typeof pageSize === 'object'
            ? `${width}px ${height}px`
            : `${pageSize} ${orientation === 'landscape' ? 'landscape' : 'portrait'}`};
              margin: 0;
            }
          }
        `}
      </style>
      <OffscreenMeasurer document={parsedDocument} pageWidth={width} onMeasure={handleMeasure} />

      {/* Top Toolbar */}
      <div className="h-14 border-b bg-white flex items-center px-4 justify-between shrink-0 print-hidden shadow-sm z-10 relative">
        {/* Left: View Modes */}
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-lg border border-gray-200/50">
            {(["content", "headers", "footers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm rounded-md capitalize transition-all duration-200 ${activeTab === tab ? "bg-white shadow-sm font-semibold text-blue-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {!isValid && (
            <div className="flex items-center px-2.5 py-1 rounded-full bg-red-50 border border-red-100">
              <span className="text-xs font-medium text-red-600">Syntax Error (Showing last valid)</span>
            </div>
          )}
        </div>

        {/* Center: Document Settings */}
        {activeTab === "content" && (
          <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/50 hidden md:flex">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Size</span>
              <select
                value={typeof pageSize === 'object' ? 'custom' : pageSize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== 'custom') {
                    updateMeta({ pageSize: val });
                  }
                }}
                className="text-sm bg-white border border-gray-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-700 font-medium cursor-pointer"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="custom" disabled>Custom</option>
              </select>
            </div>

            <div className="w-px h-4 bg-gray-300 mx-1"></div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Orient</span>
              <select
                value={orientation}
                onChange={(e) => updateMeta({ orientation: e.target.value })}
                className="text-sm bg-white border border-gray-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-gray-700 font-medium cursor-pointer"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
        )}

        {/* Right: Actions & Zoom */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-gray-50 rounded-lg border border-gray-200/50 p-1">
            <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors" title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <span className="w-12 text-center text-sm font-medium text-gray-700">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.25))} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors" title="Zoom In">
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isSaving || !isValid}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-white border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all ${
                isSaving || !isValid ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download size={16} />
              )}
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8 relative flex flex-col items-center print:p-0 print:bg-white print:block">
        {activeTab === "content" && (
          <div
            className="flex flex-col items-center gap-8 transition-transform origin-top print-scale-none print:block print:w-full print:h-full print:m-0 print:p-0"
            style={{ transform: `scale(${zoom})` }}
          >
            {pages && pages.map((page, idx) => {
              const header = page.headerId ? parsedDocument.document.headers[page.headerId] : null;
              const footer = page.footerId ? parsedDocument.document.footers[page.footerId] : null;

              return (
                <div key={idx} className={`print:m-0 print:p-0 ${idx < pages.length - 1 ? "print:break-after-page" : ""}`}>
                  <div
                    key={`page-${idx}`}
                    className="bg-white shadow-xl flex flex-col relative shrink-0 overflow-hidden print-page"
                    style={{ width, height }}
                  >
                    <RendererProvider data={parsedDocument.data} pageContext={{ pageNumber: page.pageNumber, pageCount: pages.length }}>
                      {/* Header */}
                      {header && header.root && (
                        <div className="shrink-0" style={{ height: header.heightPx !== undefined ? header.heightPx : "auto" }}>
                          <NodeRenderer node={header.root} />
                        </div>
                      )}
                      {/* Body */}
                      <div
                        className="flex-1 overflow-hidden"
                        style={{ ...getStyle(parsedDocument.document.body) }}
                      >
                        {page.bodyNodes.map((node, i) => (
                          <NodeRenderer key={`body-${node.id || i}`} node={node} />
                        ))}
                      </div>

                      {/* Footer */}
                      {footer && footer.root && (
                        <div className="shrink-0" style={{ height: footer.heightPx !== undefined ? footer.heightPx : "auto" }}>
                          <NodeRenderer node={footer.root} />
                        </div>
                      )}
                    </RendererProvider>
                  </div>
                </div>
              );
            })}
            {!pages && <div className="text-gray-400">Loading pages...</div>}
          </div>
        )}

        {activeTab === "headers" && (
          <div className="flex flex-col gap-8 transition-transform origin-top" style={{ transform: `scale(${zoom})` }}>
            {Object.entries(parsedDocument.document?.headers || {}).map(([id, header]) => (
              <div key={id} className="flex flex-col">
                <span className="text-xs text-gray-500 mb-2 font-mono">{id} {header.name ? `(${header.name})` : ''} - {header.condition || 'all'}</span>
                <div
                  className="bg-white shadow-xl flex flex-col relative overflow-hidden"
                  style={{ width, height: header.heightPx !== undefined ? header.heightPx : "auto", minHeight: header.heightPx !== undefined ? undefined : 60 }}
                >
                  {header.root ? (
                    <RendererProvider data={parsedDocument.data}>
                      <NodeRenderer node={header.root} />
                    </RendererProvider>
                  ) : (
                    <div className="p-4 text-gray-400">Empty</div>
                  )}
                </div>
              </div>
            ))}
            {Object.keys(parsedDocument.document?.headers || {}).length === 0 && (
              <div className="text-gray-400">No headers defined.</div>
            )}
          </div>
        )}

        {activeTab === "footers" && (
          <div className="flex flex-col gap-8 transition-transform origin-top" style={{ transform: `scale(${zoom})` }}>
            {Object.entries(parsedDocument.document?.footers || {}).map(([id, footer]) => (
              <div key={id} className="flex flex-col">
                <span className="text-xs text-gray-500 mb-2 font-mono">{id} {footer.name ? `(${footer.name})` : ''} - {footer.condition || 'all'}</span>
                <div
                  className="bg-white shadow-xl flex flex-col relative overflow-hidden"
                  style={{ width, height: footer.heightPx !== undefined ? footer.heightPx : "auto", minHeight: footer.heightPx !== undefined ? undefined : 40 }}
                >
                  {footer.root ? (
                    <RendererProvider data={parsedDocument.data}>
                      <NodeRenderer node={footer.root} />
                    </RendererProvider>
                  ) : (
                    <div className="p-4 text-gray-400">Empty</div>
                  )}
                </div>
              </div>
            ))}
            {Object.keys(parsedDocument.document?.footers || {}).length === 0 && (
              <div className="text-gray-400">No footers defined.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
