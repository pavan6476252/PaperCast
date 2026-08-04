"use client";

import React, { useState, useCallback } from "react";
import { DocumentSchema } from "@papercast/core";
import { Measurements, paginateDocument, PageData } from "@papercast/engine";
import {
  NodeRenderer,
  PaperCastProvider,
  OffscreenMeasurer,
  getStyle,
} from "@papercast/react";
import { registerDefaultWidgets } from "@papercast/react/widgets";

// Ensure widgets are registered for the preview
registerDefaultWidgets();

interface SnippetPreviewProps {
  schema: DocumentSchema;
  scale?: number | "auto";
}

const PAGE_SIZES = {
  A4: { width: 794, height: 1123 },
  A3: { width: 1123, height: 1587 },
  Letter: { width: 816, height: 1056 },
} as const;

export const SnippetPreview: React.FC<SnippetPreviewProps> = ({
  schema,
  scale = 0.35,
}) => {
  const [pages, setPages] = useState<PageData[] | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dynamicScale, setDynamicScale] = useState<number>(
    typeof scale === "number" ? scale : 0.35
  );

  // Extract meta for page sizing
  const { pageSize, orientation } = schema.meta;

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

  const handleMeasure = useCallback(
    (measurements: Measurements) => {
      const newPages = paginateDocument(schema, height, measurements);
      setPages(newPages);
    },
    [schema, height]
  );

  React.useEffect(() => {
    if (scale !== "auto" || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const availableWidth = entry.contentRect.width * 0.9; // 5% padding on each side
        const availableHeight = entry.contentRect.height * 0.9;

        // Ensure scale is sufficient to fit without overflowing width or height
        const scaleX = availableWidth / width;
        const scaleY = availableHeight / height;
        // Cap max scale to 1.5 to prevent pixelation on ultra-wide containers
        setDynamicScale(Math.min(scaleX, scaleY, 1.5));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [scale, width, height]);

  const effectiveScale = scale === "auto" ? dynamicScale : scale;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-surface"
    >
      <OffscreenMeasurer
        document={schema}
        pageWidth={width}
        onMeasure={handleMeasure}
      />

      {!pages ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Loading preview...
        </div>
      ) : (
        <div
          className="flex flex-col items-center gap-4 origin-center transition-transform duration-300"
          style={{ transform: `scale(${effectiveScale})` }}
        >
          {pages.map((page, idx) => {
            const header = page.headerId
              ? schema.document.headers[page.headerId]
              : null;
            const footer = page.footerId
              ? schema.document.footers[page.footerId]
              : null;

            return (
              <div
                key={`page-${idx}`}
                className="bg-white text-black shadow-md flex flex-col relative shrink-0 overflow-hidden"
                style={{ width, height }}
              >
                <PaperCastProvider
                  data={schema.data}
                  pageContext={{
                    pageNumber: page.pageNumber,
                    pageCount: pages.length,
                  }}
                  activeTab="content"
                >
                  {/* Header */}
                  {header && header.root && (
                    <PaperCastProvider
                      data={schema.data}
                      pageContext={{
                        pageNumber: page.pageNumber,
                        pageCount: pages.length,
                      }}
                      activeTab="content"
                      location="header"
                    >
                      <div
                        className="shrink-0"
                        style={{
                          height:
                            header.heightPx !== undefined
                              ? header.heightPx
                              : "auto",
                        }}
                      >
                        <NodeRenderer node={header.root} />
                      </div>
                    </PaperCastProvider>
                  )}

                  {/* Body */}
                  <PaperCastProvider
                    data={schema.data}
                    pageContext={{
                      pageNumber: page.pageNumber,
                      pageCount: pages.length,
                    }}
                    activeTab="content"
                    location="body"
                  >
                    <div
                      className="flex-1 overflow-hidden"
                      style={{ ...getStyle(schema.document.body) }}
                    >
                      {page.bodyNodes.map((node, i) => (
                        <NodeRenderer
                          key={`body-${node.id || i}`}
                          node={node}
                        />
                      ))}
                    </div>
                  </PaperCastProvider>

                  {/* Footer */}
                  {footer && footer.root && (
                    <PaperCastProvider
                      data={schema.data}
                      pageContext={{
                        pageNumber: page.pageNumber,
                        pageCount: pages.length,
                      }}
                      activeTab="content"
                      location="footer"
                    >
                      <div
                        className="shrink-0"
                        style={{
                          height:
                            footer.heightPx !== undefined
                              ? footer.heightPx
                              : "auto",
                        }}
                      >
                        <NodeRenderer node={footer.root} />
                      </div>
                    </PaperCastProvider>
                  )}
                </PaperCastProvider>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
