import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  useDocumentStore,
  useDocumentTemporalStore,
} from "../../store/documentStore";
import {
  NodeRenderer,
  FormCastProvider,
  OffscreenMeasurer,
  getStyle,
} from "@formcast/react";
import { Measurements, paginateDocument, PageData } from "@formcast/engine";
import {
  ZoomIn,
  ZoomOut,
  Printer,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ChevronDown,
  Plus,
  Undo2,
  Redo2,
  Save,
  SaveAll,
} from "lucide-react";
import { SectionToolbar } from "../editor/SectionToolbar";
import { EditorNodeWrapper } from "./EditorNodeWrapper";
import { DocumentSchema } from "@formcast/core";
import { useWorkspaceStore } from "../../store/workspaceStore";

type PreviewTab = "content" | "headers" | "footers";

interface DocumentPreviewProps {
  isEditorVisible?: boolean;
  onToggleEditor?: () => void;
  schemaData?: DocumentSchema | null;
  hideToolbar?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  isEditorVisible = true,
  onToggleEditor,
  schemaData,
  hideToolbar = false,
}) => {
  const storeParsedDocument = useDocumentStore((state) => state.parsedDocument);
  const storeIsValid = useDocumentStore((state) => state.isValid);
  const setJsonString = useDocumentStore((state) => state.setJsonString);
  const storeJsonString = useDocumentStore((state) => state.jsonString);
  const { undo, redo, pastStates, futureStates } = useDocumentTemporalStore(
    (state) => state
  );

  const {
    activeSchemaId,
    schemas,
    saveSchema,
    createSchema,
    isWorkspaceAutoSave,
    setIsWorkspaceAutoSave,
    lastSavedJsonString,
    setLastSavedJsonString,
  } = useWorkspaceStore();

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;
  const hasUnsavedChanges = lastSavedJsonString !== storeJsonString;

  const handleSave = () => {
    if (activeSchemaId) {
      const active = schemas.find((s) => s.id === activeSchemaId);
      if (active) {
        saveSchema(activeSchemaId, active.name, storeJsonString);
        setLastSavedJsonString(storeJsonString);
      }
    } else {
      handleSaveAs();
    }
  };

  const handleSaveAs = async () => {
    const name = window.prompt("Enter template name:", "Untitled Schema");
    if (name) {
      await createSchema(name, storeJsonString);
      setLastSavedJsonString(storeJsonString);
    }
  };

  const parsedDocument = schemaData || storeParsedDocument;
  const isValid = schemaData ? true : storeIsValid;
  const jsonString = schemaData
    ? JSON.stringify(schemaData, null, 2)
    : storeJsonString;

  const zoom = useDocumentStore((state) => state.zoom);
  const setZoom = useDocumentStore((state) => state.setZoom);
  const allowHeaderFooterEditing = useDocumentStore(
    (state) => state.allowHeaderFooterEditing
  );
  const setAllowHeaderFooterEditing = useDocumentStore(
    (state) => state.setAllowHeaderFooterEditing
  );
  const addHeader = useDocumentStore((state) => state.addHeader);
  const addFooter = useDocumentStore((state) => state.addFooter);
  const [activeTab, setActiveTab] = useState<PreviewTab>("content");
  const [pages, setPages] = useState<PageData[] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const saveMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        saveMenuRef.current &&
        !saveMenuRef.current.contains(event.target as Node)
      ) {
        setIsSaveMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Handle unsaved changes warning on window close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isWorkspaceAutoSave) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, isWorkspaceAutoSave]);

  // Keyboard shortcut for Save (Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (hasUnsavedChanges || !activeSchemaId) {
          handleSave();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, hasUnsavedChanges, activeSchemaId]);

  const updateMeta = (updates: any) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.meta) parsed.meta = {};
      parsed.meta = { ...parsed.meta, ...updates };
      setJsonString(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore JSON parse error while typing
    }
  };

  if (!parsedDocument) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        No valid document.
      </div>
    );
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

  const handleMeasure = useCallback(
    (measurements: Measurements) => {
      const newPages = paginateDocument(parsedDocument, height, measurements);
      setPages(newPages);
    },
    [parsedDocument, height]
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = useCallback(async () => {
    if (!isValid || !jsonString || isSaving) return;

    try {
      setIsSaving(true);
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString, // Send the full schema as JSON string in body
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
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
  }, [isValid, jsonString, isSaving]);

  const handleDownloadRef = useRef(handleDownload);
  useEffect(() => {
    handleDownloadRef.current = handleDownload;
  }, [handleDownload]);

  useEffect(() => {
    const handleGlobalDownload = () => {
      handleDownloadRef.current();
    };
    window.addEventListener("formcast-download-pdf", handleGlobalDownload);
    return () => {
      window.removeEventListener("formcast-download-pdf", handleGlobalDownload);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-hidden">
      <style>
        {`
          @media print {
            @page {
              size: ${
                typeof pageSize === "object"
                  ? `${width}px ${height}px`
                  : `${pageSize} ${orientation === "landscape" ? "landscape" : "portrait"}`
              };
              margin: 0;
            }
          }
        `}
      </style>
      <OffscreenMeasurer
        document={parsedDocument}
        pageWidth={width}
        onMeasure={handleMeasure}
      />

      {/* Top Toolbar */}
      {!hideToolbar && (
        <div className="h-14 border-b bg-white flex items-center px-4 justify-between shrink-0 print-hidden shadow-sm z-10 relative">
          {/* Left: View Modes */}
          <div className="flex items-center space-x-2 shrink-0">
            {onToggleEditor && (
              <button
                onClick={onToggleEditor}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white cursor-pointer"
                title={
                  isEditorVisible
                    ? "Hide Schema Editor (Cmd+\\)"
                    : "Show Schema Editor (Cmd+\\)"
                }
                aria-label={
                  isEditorVisible ? "Hide Schema Editor" : "Show Schema Editor"
                }
              >
                {isEditorVisible ? (
                  <PanelLeftClose size={16} />
                ) : (
                  <PanelLeftOpen size={16} />
                )}
              </button>
            )}
            <div className="flex space-x-0.5 bg-gray-100 p-0.5 rounded-lg border border-gray-200/50">
              {(["content", "headers", "footers"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white shadow-sm text-blue-600 font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {!isValid && (
              <div className="flex items-center px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-[10px] font-bold text-red-600 uppercase tracking-wider">
                Error
              </div>
            )}
          </div>

          {/* Right: Actions, Zoom & Settings Popover */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Undo/Redo */}
            <div className="flex items-center space-x-0.5 border-r border-gray-200 pr-2 mr-0.5">
              <button
                onClick={() => canUndo && undo()}
                disabled={!canUndo}
                className={`p-1.5 rounded-lg transition-colors ${canUndo ? "text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer" : "text-gray-300 cursor-not-allowed"}`}
                title="Undo (Cmd+Z)"
              >
                <Undo2 size={14} />
              </button>
              <button
                onClick={() => canRedo && redo()}
                disabled={!canRedo}
                className={`p-1.5 rounded-lg transition-colors ${canRedo ? "text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer" : "text-gray-300 cursor-not-allowed"}`}
                title="Redo (Cmd+Shift+Z)"
              >
                <Redo2 size={14} />
              </button>
            </div>

            {/* Settings & Zoom Dropdown */}
            <div className="relative ml-2" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((s) => !s)}
                className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-colors cursor-pointer"
                title="Page Setup & Zoom"
              >
                <Settings size={14} />
                <span className="hidden sm:inline">Page Setup</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-3 space-y-3.5 origin-top-right">
                  {activeTab === "content" && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Page Settings
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col space-y-1">
                          <label
                            htmlFor="pageSize"
                            className="text-[10px] font-medium text-gray-500"
                          >
                            Size
                          </label>
                          <select
                            id="pageSize"
                            value={
                              typeof pageSize === "object" ? "custom" : pageSize
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val !== "custom") {
                                updateMeta({ pageSize: val });
                              }
                            }}
                            className="text-xs bg-gray-50 border border-gray-200 rounded-md p-1 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 font-medium cursor-pointer"
                          >
                            <option value="A4">A4</option>
                            <option value="A3">A3</option>
                            <option value="Letter">Letter</option>
                            <option value="custom" disabled>
                              Custom
                            </option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label
                            htmlFor="orientation"
                            className="text-[10px] font-medium text-gray-500"
                          >
                            Orient
                          </label>
                          <select
                            id="orientation"
                            value={orientation}
                            onChange={(e) =>
                              updateMeta({ orientation: e.target.value })
                            }
                            className="text-xs bg-gray-50 border border-gray-200 rounded-md p-1 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 font-medium cursor-pointer"
                          >
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                          </select>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 my-2 pt-2" />
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="toggleEditHeaderFooter"
                            className="text-xs text-gray-600 font-medium"
                          >
                            Edit Header/Footer
                          </label>
                          <input
                            id="toggleEditHeaderFooter"
                            type="checkbox"
                            checked={allowHeaderFooterEditing}
                            onChange={(e) =>
                              setAllowHeaderFooterEditing(e.target.checked)
                            }
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                        <button
                          onClick={() => {
                            useDocumentStore
                              .getState()
                              .deconstructAllRichText();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-xs font-semibold px-2 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200 cursor-pointer"
                          title="Programmatically convert all Rich Text blocks in the document to FormCast widgets"
                        >
                          Convert All Rich Text
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === "content" && (
                    <div className="border-t border-gray-100" />
                  )}

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Zoom Preview
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg border border-gray-200/50 p-1">
                      <button
                        aria-label="Zoom Out"
                        onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))}
                        className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                        title="Zoom Out (Cmd-)"
                      >
                        <ZoomOut size={14} />
                      </button>
                      <span className="text-xs font-semibold text-gray-700">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        aria-label="Zoom In"
                        onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                        className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                        title="Zoom In (Cmd+)"
                      >
                        <ZoomIn size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save & Export Dropdown */}
            <div
              className="relative flex items-center shadow-sm rounded-lg ml-2"
              ref={saveMenuRef}
            >
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges && !!activeSchemaId}
                className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-l-lg border border-transparent transition-colors ${
                  !hasUnsavedChanges && !!activeSchemaId
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
                title={
                  activeSchemaId
                    ? "Save Schema (Cmd+S)"
                    : "Save As New Template"
                }
              >
                <Save size={14} className="mr-1.5" />
                Save
                {hasUnsavedChanges && activeSchemaId && (
                  <span className="ml-1 font-bold text-lg leading-none">*</span>
                )}
              </button>

              <div className="w-px h-full bg-blue-700/50" />

              <button
                onClick={() => setIsSaveMenuOpen(!isSaveMenuOpen)}
                className={`flex items-center px-1.5 py-1.5 rounded-r-lg transition-colors cursor-pointer ${
                  !hasUnsavedChanges && !!activeSchemaId
                    ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <ChevronDown size={14} />
              </button>

              {isSaveMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 space-y-1">
                  <button
                    onClick={() => {
                      handleSaveAs();
                      setIsSaveMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg flex items-center transition-colors cursor-pointer"
                  >
                    <SaveAll size={14} className="mr-2 text-gray-500" />
                    Save As Template...
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      handleDownload();
                      setIsSaveMenuOpen(false);
                    }}
                    disabled={isSaving || !isValid}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg flex items-center transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-3.5 h-3.5 mr-2 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                    ) : (
                      <Download size={14} className="mr-2 text-gray-500" />
                    )}
                    Export PDF
                  </button>
                  <button
                    onClick={() => {
                      handlePrint();
                      setIsSaveMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg flex items-center transition-colors cursor-pointer"
                  >
                    <Printer size={14} className="mr-2 text-gray-500" />
                    Print
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div
        id="preview-scroll-container"
        className="flex-1 overflow-auto p-8 relative flex flex-col items-center print:p-0 print:bg-white print:block"
      >
        {activeTab === "content" && (
          <div
            className="flex flex-col items-center gap-8 transition-transform origin-top print-scale-none print:block print:w-full print:h-auto print:m-0 print:p-0"
            style={{ transform: `scale(${zoom})` }}
          >
            {pages &&
              pages.map((page, idx) => {
                const header = page.headerId
                  ? parsedDocument.document.headers[page.headerId]
                  : null;
                const footer = page.footerId
                  ? parsedDocument.document.footers[page.footerId]
                  : null;

                return (
                  <div
                    key={idx}
                    className={`print:m-0 print:p-0 ${idx < pages.length - 1 ? "print:break-after-page" : ""}`}
                  >
                    <div
                      key={`page-${idx}`}
                      className="bg-white shadow-xl flex flex-col relative shrink-0 overflow-hidden print-page"
                      style={{ width, height }}
                    >
                      <FormCastProvider
                        data={parsedDocument.data}
                        pageContext={{
                          pageNumber: page.pageNumber,
                          pageCount: pages.length,
                        }}
                        activeTab="content"
                        NodeWrapper={EditorNodeWrapper}
                      >
                        {/* Header */}
                        {header && header.root && (
                          <FormCastProvider
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
                          </FormCastProvider>
                        )}
                        {/* Body */}
                        <FormCastProvider
                          data={parsedDocument.data}
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
                              ...getStyle(parsedDocument.document.body),
                            }}
                          >
                            {page.bodyNodes.map((node, i) => (
                              <NodeRenderer
                                key={`body-${node.id || i}`}
                                node={node}
                              />
                            ))}
                          </div>
                        </FormCastProvider>

                        {/* Footer */}
                        {footer && footer.root && (
                          <FormCastProvider
                            data={parsedDocument.data}
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
                          </FormCastProvider>
                        )}
                      </FormCastProvider>
                    </div>
                  </div>
                );
              })}
            {!pages && <div className="text-gray-400">Loading pages...</div>}
          </div>
        )}

        {activeTab === "headers" && (
          <div
            className="flex flex-col gap-8 transition-transform origin-top"
            style={{ transform: `scale(${zoom})` }}
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
                  className="flex flex-col shadow-xl rounded-md bg-white border border-gray-200"
                  style={{ width }}
                >
                  <SectionToolbar type="header" id={id} section={header} />
                  <div
                    className="flex flex-col relative overflow-hidden"
                    style={{
                      width,
                      height:
                        header.heightPx !== undefined
                          ? header.heightPx
                          : "auto",
                      minHeight: header.heightPx !== undefined ? undefined : 60,
                    }}
                  >
                    {header.root ? (
                      <FormCastProvider
                        data={parsedDocument.data}
                        activeTab="headers"
                        location="header"
                        NodeWrapper={EditorNodeWrapper}
                      >
                        <NodeRenderer node={header.root} />
                      </FormCastProvider>
                    ) : (
                      <div className="p-4 text-gray-400">Empty</div>
                    )}
                  </div>
                </div>
              )
            )}
            {Object.keys(parsedDocument.document?.headers || {}).length ===
              0 && <div className="text-gray-400">No headers defined.</div>}
          </div>
        )}

        {activeTab === "footers" && (
          <div
            className="flex flex-col gap-8 transition-transform origin-top"
            style={{ transform: `scale(${zoom})` }}
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
                  className="flex flex-col shadow-xl rounded-md bg-white border border-gray-200"
                  style={{ width }}
                >
                  <SectionToolbar type="footer" id={id} section={footer} />
                  <div
                    className="flex flex-col relative overflow-hidden"
                    style={{
                      width,
                      height:
                        footer.heightPx !== undefined
                          ? footer.heightPx
                          : "auto",
                      minHeight: footer.heightPx !== undefined ? undefined : 40,
                    }}
                  >
                    {footer.root ? (
                      <FormCastProvider
                        data={parsedDocument.data}
                        activeTab="footers"
                        location="footer"
                        NodeWrapper={EditorNodeWrapper}
                      >
                        <NodeRenderer node={footer.root} />
                      </FormCastProvider>
                    ) : (
                      <div className="p-4 text-gray-400">Empty</div>
                    )}
                  </div>
                </div>
              )
            )}
            {Object.keys(parsedDocument.document?.footers || {}).length ===
              0 && <div className="text-gray-400">No footers defined.</div>}
          </div>
        )}
      </div>
    </div>
  );
};
