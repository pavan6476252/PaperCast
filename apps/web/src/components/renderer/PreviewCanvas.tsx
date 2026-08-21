import React from "react";
import { DocumentSchema, AnyNode, PageRegion } from "@papercast/core";
import { PageData } from "@papercast/engine";
import {
  PaperCastProvider,
  NodeRenderer,
  getStyle,
  NodeRegistry,
} from "@papercast/react";
import { Trash2, Copy, Columns2, Settings2, Plus } from "lucide-react";

const generateId = () => Math.random().toString(36).substring(2, 10);
import { useDocumentStore } from "../../store/documentStore";
import { SectionToolbar } from "../editor/SectionToolbar";
import { usePanZoomGesture } from "../../hooks/usePanZoomGesture";
import { PreviewTab } from "./PreviewToolbar";

interface PreviewCanvasProps {
  parsedDocument: DocumentSchema;
  pages: PageData[] | null;
  activeTab: PreviewTab;
  zoom: number;
  width: number;
  height: number;
  nodeWrapper:
    | React.ComponentType<{
        node: AnyNode;
        renderContent: (
          props?: React.HTMLAttributes<HTMLDivElement> & {
            "data-selected"?: boolean;
          },
          overlays?: React.ReactNode
        ) => React.ReactNode;
      }>
    | undefined;
  addHeader: (id: string, header: PageRegion) => void;
  addFooter: (id: string, footer: PageRegion) => void;
  disablePrintStyles?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  parsedDocument,
  pages,
  activeTab,
  zoom,
  width,
  height,
  nodeWrapper,
  addHeader,
  addFooter,
  disablePrintStyles = false,
  onZoomChange,
}) => {
  const scrollContainerRef = usePanZoomGesture({ zoom, onZoomChange });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessary to allow dropping
    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const SCROLL_SPEED = 15;
    const EDGE_SIZE = 80;

    const topDist = e.clientY - rect.top;
    const bottomDist = rect.bottom - e.clientY;
    const leftDist = e.clientX - rect.left;
    const rightDist = rect.right - e.clientX;

    if (topDist < EDGE_SIZE) {
      container.scrollTop -= SCROLL_SPEED;
    } else if (bottomDist < EDGE_SIZE) {
      container.scrollTop += SCROLL_SPEED;
    }

    if (leftDist < EDGE_SIZE) {
      container.scrollLeft -= SCROLL_SPEED;
    } else if (rightDist < EDGE_SIZE) {
      container.scrollLeft += SCROLL_SPEED;
    }
  };

  return (
    <div
      id="preview-scroll-container"
      ref={scrollContainerRef}
      onDragOverCapture={handleDragOver}
      onClick={() => {
        useDocumentStore.getState().setSelectedNodeId(null);
      }}
      className={`flex-1 overflow-auto p-8 relative flex flex-col ${disablePrintStyles ? "" : "print:p-0 print:bg-white print:block"}`}
    >
      {activeTab === "content" && (
        <div
          id="preview-zoom-container"
          className={`flex flex-col items-center mx-auto gap-8 transition-all ${disablePrintStyles ? "" : "print-scale-none print:block print:w-full print:h-auto print:m-0 print:p-0"}`}
          style={{ zoom }}
        >
          {pages &&
            pages.map((page, idx) => {
              const header = page.headerId
                ? parsedDocument.document.headers?.[page.headerId]
                : null;
              const footer = page.footerId
                ? parsedDocument.document.footers?.[page.footerId]
                : null;

              return (
                <div
                  key={idx}
                  className={`${disablePrintStyles ? "" : "print:m-0 print:p-0"} ${idx < pages.length - 1 && !disablePrintStyles ? "print:break-after-page" : ""}`}
                >
                  <div
                    key={`page-${idx}`}
                    className={`bg-white text-black shadow-xl flex flex-col relative shrink-0 overflow-hidden ${disablePrintStyles ? "" : "print-page"}`}
                    style={{ width, height }}
                  >
                    <PaperCastProvider
                      data={parsedDocument.data}
                      pageContext={{
                        pageNumber: page.pageNumber,
                        pageCount: pages.length,
                      }}
                      activeTab="content"
                      NodeWrapper={nodeWrapper}
                    >
                      {/* Header */}
                      {header && header.root && (
                        <PaperCastProvider
                          data={parsedDocument.data}
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
                        data={parsedDocument.data}
                        theme={parsedDocument.theme}
                        pageContext={{
                          pageNumber: page.pageNumber,
                          pageCount: pages.length,
                        }}
                        activeTab="content"
                        location="body"
                      >
                        <div
                          className="flex-1 overflow-hidden"
                          style={{
                            flexDirection:
                              parsedDocument.document.body.type === "row"
                                ? "row"
                                : "column",
                            ...getStyle(parsedDocument.document.body),
                          }}
                          onDragOver={(e) => {
                            if (activeTab === "content") {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          onDrop={(e) => {
                            if (activeTab === "content") {
                              e.preventDefault();
                              e.stopPropagation();
                              const widgetType = e.dataTransfer.getData(
                                "application/papercast-widget"
                              );
                              if (widgetType) {
                                let newNode: AnyNode;
                                if (widgetType === "pageBreak") {
                                  newNode = {
                                    id: `page-${generateId()}`,
                                    type: "column",
                                    layout: {
                                      pageBreakBefore: true,
                                      height: "100%",
                                      flexGrow: 1,
                                      padding: 64,
                                      direction: "column",
                                    },
                                    children: [],
                                  };
                                } else {
                                  newNode = NodeRegistry.createDefaultNode(
                                    widgetType,
                                    `node-${generateId()}`
                                  );
                                }

                                useDocumentStore
                                  .getState()
                                  .insertNode(
                                    parsedDocument.document.body.id,
                                    undefined,
                                    newNode
                                  );
                              }
                            }
                          }}
                        >
                          {page.bodyNodes.length === 0 &&
                            activeTab === "content" && (
                              <div className="w-full h-full min-h-[100px] flex items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 rounded-lg m-4 pointer-events-none print-hidden">
                                Drag and drop widgets here
                              </div>
                            )}
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
                          data={parsedDocument.data}
                          theme={parsedDocument.theme}
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
                </div>
              );
            })}
          {!pages && <div className="text-gray-400">Loading pages...</div>}
        </div>
      )}

      {activeTab === "headers" && (
        <div
          id="preview-zoom-container"
          className="flex flex-col mx-auto gap-8 transition-all"
          style={{ zoom }}
        >
          <div
            className="flex justify-between items-center w-full max-w-[100%] print-hidden"
            style={{ width }}
          >
            <h2 className="text-lg font-bold text-gray-800">Headers</h2>
            <button
              onClick={() => {
                const id = `header-${Date.now()}`;
                addHeader(id, {
                  id,
                  name: `Header ${Object.keys(parsedDocument.document?.headers || {}).length + 1}`,
                  condition: "all",
                  root: {
                    id: `${id}-root`,
                    type: "row",
                    layout: {
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                    },
                    children: [],
                  },
                });
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} />
              <span>Create Header</span>
            </button>
          </div>
          {Object.entries(parsedDocument.document?.headers || {}).map(
            ([id, header]) => (
              <div
                key={id}
                className="flex flex-col shadow-xl rounded-md bg-white text-black border border-gray-200"
                style={{ width }}
              >
                <SectionToolbar type="header" id={id} section={header} />
                <div
                  className="flex flex-col relative overflow-hidden"
                  style={{
                    width,
                    height:
                      header.heightPx !== undefined ? header.heightPx : "auto",
                    minHeight: header.heightPx !== undefined ? undefined : 60,
                  }}
                >
                  {header.root ? (
                    <PaperCastProvider
                      data={parsedDocument.data}
                      theme={parsedDocument.theme}
                      activeTab="headers"
                      location="header"
                      NodeWrapper={nodeWrapper}
                    >
                      <NodeRenderer node={header.root} />
                    </PaperCastProvider>
                  ) : (
                    <div className="p-4 text-gray-400">Empty</div>
                  )}
                </div>
              </div>
            )
          )}
          {Object.keys(parsedDocument.document?.headers || {}).length === 0 && (
            <div className="text-gray-400">No headers defined.</div>
          )}
        </div>
      )}

      {activeTab === "footers" && (
        <div
          id="preview-zoom-container"
          className="flex flex-col mx-auto gap-8 transition-all"
          style={{ zoom }}
        >
          <div
            className="flex justify-between items-center w-full max-w-[100%] print-hidden"
            style={{ width }}
          >
            <h2 className="text-lg font-bold text-gray-800">Footers</h2>
            <button
              onClick={() => {
                const id = `footer-${Date.now()}`;
                addFooter(id, {
                  id,
                  name: `Footer ${Object.keys(parsedDocument.document?.footers || {}).length + 1}`,
                  condition: "all",
                  root: {
                    id: `${id}-root`,
                    type: "row",
                    layout: {
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 20,
                      paddingRight: 20,
                    },
                    children: [],
                  },
                });
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} />
              <span>Create Footer</span>
            </button>
          </div>
          {Object.entries(parsedDocument.document?.footers || {}).map(
            ([id, footer]) => (
              <div
                key={id}
                className="flex flex-col shadow-xl rounded-md bg-white text-black border border-gray-200"
                style={{ width }}
              >
                <SectionToolbar type="footer" id={id} section={footer} />
                <div
                  className="flex flex-col relative overflow-hidden"
                  style={{
                    width,
                    height:
                      footer.heightPx !== undefined ? footer.heightPx : "auto",
                    minHeight: footer.heightPx !== undefined ? undefined : 40,
                  }}
                >
                  {footer.root ? (
                    <PaperCastProvider
                      data={parsedDocument.data}
                      theme={parsedDocument.theme}
                      activeTab="footers"
                      location="footer"
                      NodeWrapper={nodeWrapper}
                    >
                      <NodeRenderer node={footer.root} />
                    </PaperCastProvider>
                  ) : (
                    <div className="p-4 text-gray-400">Empty</div>
                  )}
                </div>
              </div>
            )
          )}
          {Object.keys(parsedDocument.document?.footers || {}).length === 0 && (
            <div className="text-gray-400">No footers defined.</div>
          )}
        </div>
      )}
    </div>
  );
};
