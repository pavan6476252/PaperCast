import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Printer,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ChevronDown,
  Undo2,
  Redo2,
  SaveAll,
  Save,
  Folder,
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import {
  useDocumentStore,
  useDocumentTemporalStore,
} from "../../store/documentStore";
import { useWorkspaceStore } from "../../store/workspaceStore";

export type PreviewTab = "content" | "headers" | "footers";

interface PreviewToolbarProps {
  isEditorVisible?: boolean;
  onToggleEditor?: () => void;
  onToggleWorkspace?: () => void;
  activeTab: PreviewTab;
  setActiveTab: (tab: PreviewTab) => void;
  isValid: boolean;
  isSaving: boolean;
  handleDownload: () => void;
  handlePrint: () => void;
  pageSize: any;
  orientation: string;
  updateMeta: (updates: any) => void;
  isReadOnly?: boolean;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  isEditorVisible = true,
  onToggleEditor,
  onToggleWorkspace,
  activeTab,
  setActiveTab,
  isValid,
  isSaving,
  handleDownload,
  handlePrint,
  pageSize,
  orientation,
  updateMeta,
  isReadOnly = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const saveMenuRef = useRef<HTMLDivElement>(null);

  const zoom = useDocumentStore((state) => state.zoom);
  const setZoom = useDocumentStore((state) => state.setZoom);
  const allowHeaderFooterEditing = useDocumentStore(
    (state) => state.allowHeaderFooterEditing
  );
  const setAllowHeaderFooterEditing = useDocumentStore(
    (state) => state.setAllowHeaderFooterEditing
  );
  const storeJsonString = useDocumentStore((state) => state.jsonString);
  const { undo, redo, pastStates, futureStates } = useDocumentTemporalStore(
    (state) => state
  );

  const {
    activeSchemaId,
    schemas,
    saveSchema,
    createSchema,
    lastSavedJsonString,
    setLastSavedJsonString,
  } = useWorkspaceStore();

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;
  const hasUnsavedChanges = isReadOnly
    ? false
    : lastSavedJsonString !== storeJsonString;

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
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  return (
    <div className="flex flex-col border-b border-border bg-background shrink-0 print:hidden shadow-sm z-10 relative">
      {/* Main Row */}
      <div className="h-14 flex items-center px-4 justify-between w-full">
        {/* Left: View Modes */}
        <div className="flex items-center space-x-2 shrink-0">
          {onToggleWorkspace && (
            <button
              onClick={onToggleWorkspace}
              className="p-1.5 md:hidden text-foreground/70 hover:text-foreground hover:bg-surface rounded-lg transition-colors border border-border bg-background cursor-pointer"
              title="Workspace Explorer"
            >
              <Folder size={16} />
            </button>
          )}
          {onToggleEditor && (
            <button
              onClick={onToggleEditor}
              className="p-1.5 text-foreground/70 hover:text-foreground hover:bg-surface rounded-lg transition-colors border border-border bg-background cursor-pointer"
              title={
                isEditorVisible
                  ? "Hide Schema Editor (Cmd+\\)"
                  : "Show Schema Editor (Cmd+\\)"
              }
            >
              {isEditorVisible ? (
                <PanelLeftClose size={16} />
              ) : (
                <PanelLeftOpen size={16} />
              )}
            </button>
          )}
          <div className="hidden md:block">
            <div className="flex space-x-0.5 bg-surface p-0.5 rounded-lg border border-border">
              {(["content", "headers", "footers"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-background shadow-sm text-accent font-bold"
                      : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
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
          <div className="flex items-center space-x-0.5 border-r border-border pr-2 mr-0.5">
            <button
              onClick={() => canUndo && undo()}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors ${canUndo ? "text-foreground/70 hover:bg-surface hover:text-accent cursor-pointer" : "text-foreground/30 cursor-not-allowed"}`}
              title="Undo (Cmd+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={() => canRedo && redo()}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors ${canRedo ? "text-foreground/70 hover:bg-surface hover:text-accent cursor-pointer" : "text-foreground/30 cursor-not-allowed"}`}
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 size={14} />
            </button>
          </div>

          {/* Settings & Zoom Dropdown */}
          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-foreground bg-surface border border-border rounded-lg hover:bg-surface/80 hover:text-foreground focus:outline-none transition-colors cursor-pointer"
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
              <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-xl z-30 p-3 space-y-3.5 origin-top-right">
                {activeTab === "content" && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
                      Page Settings
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col space-y-1">
                        <label
                          htmlFor="pageSize"
                          className="text-[10px] font-medium text-foreground/70"
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
                            if (val !== "custom") updateMeta({ pageSize: val });
                          }}
                          className="text-xs bg-background border border-border/80 rounded-md p-1 outline-none focus:ring-1 focus:ring-accent text-foreground font-medium cursor-pointer"
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
                          className="text-[10px] font-medium text-foreground/70"
                        >
                          Orient
                        </label>
                        <select
                          id="orientation"
                          value={orientation}
                          onChange={(e) =>
                            updateMeta({ orientation: e.target.value })
                          }
                          className="text-xs bg-background border border-border/80 rounded-md p-1 outline-none focus:ring-1 focus:ring-accent text-foreground font-medium cursor-pointer"
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>
                    </div>
                    <div className="border-t border-border my-2 pt-2" />
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="toggleEditHeaderFooter"
                          className="text-xs text-foreground/90 font-medium"
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
                          className="w-4 h-4 rounded border-border/80 text-accent focus:ring-accent cursor-pointer"
                        />
                      </div>
                      <button
                        onClick={() => {
                          useDocumentStore.getState().deconstructAllRichText();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-xs font-semibold px-2 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200 cursor-pointer"
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
                      onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))}
                      className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="text-xs font-semibold text-gray-700">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                      className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
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
            className="relative flex items-stretch shadow-sm rounded-lg ml-2"
            ref={saveMenuRef}
          >
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges && !!activeSchemaId}
              className={`flex items-center px-2 py-.5 text-xs font-medium rounded-l-lg border border-transparent transition-colors ${
                !hasUnsavedChanges && !!activeSchemaId
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }`}
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
          <ThemeToggle />
        </div>
      </div>
      {/* Mobile Secondary Row for Tabs */}
      <div className="h-12 border-t border-border flex items-center justify-between px-4 md:hidden bg-surface/30 shrink-0 w-full overflow-x-auto hide-scrollbar">
        <div className="flex space-x-0.5 bg-surface p-0.5 rounded-lg border border-border">
          {(["content", "headers", "footers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "bg-background shadow-sm text-accent font-bold"
                  : "text-foreground/70 hover:text-foreground hover:bg-background/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
