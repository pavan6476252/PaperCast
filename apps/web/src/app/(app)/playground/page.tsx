"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Folder, Code2, PanelLeftClose, X } from "lucide-react";

import { EditorProvider } from "@papercast/react/editor";
import { useDocumentStore } from "../../../store/documentStore";
import { registerDefaultWidgets } from "@papercast/react/widgets";
import { useToast, ToastProvider } from "../../../components/ui/Toast";
import { useWorkspaceStore } from "../../../store/workspaceStore";

import { DocumentPreview } from "../../../components/renderer/DocumentPreview";
import { LeftSidebar } from "../../../components/playground/LeftSidebar";
import { MobileSidebar } from "../../../components/playground/MobileSidebar";
import { RightSidebar } from "../../../components/playground/RightSidebar";
import { MobileWidgetsBar } from "../../../components/playground/MobileWidgetsBar";
import { MobilePropertiesSheet } from "../../../components/playground/MobilePropertiesSheet";
import { McpStatusBadge } from "../../../components/playground/McpStatusBadge";
import { usePlaygroundShortcuts } from "../../../hooks/usePlaygroundShortcuts";

const JsonEditor = dynamic(
  () =>
    import("../../../components/editor/JsonEditor").then(
      (mod) => mod.JsonEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full bg-background text-foreground/70 w-full min-w-[300px]">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium animate-pulse">
          Initializing Editor...
        </p>
      </div>
    ),
  }
);

const WorkspaceSidebar = dynamic(
  () =>
    import("../../../components/workspace/WorkspaceSidebar").then(
      (mod) => mod.WorkspaceSidebar
    ),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-sm text-gray-500 flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        Loading workspace...
      </div>
    ),
  }
);

const TemplateGalleryDialog = dynamic(
  () =>
    import("../../../components/workspace/TemplateGalleryDialog").then(
      (mod) => mod.TemplateGalleryDialog
    ),
  { ssr: false }
);

import { NodeRegistry } from "@papercast/react";
import { TextPropertyEditor } from "../../../components/editor/TextPropertyEditor";

// Register default PaperCast widgets on client load
registerDefaultWidgets();

const defaultTextNode = NodeRegistry.get("text");
if (defaultTextNode) {
  NodeRegistry.register({
    ...defaultTextNode,
    renderPropertyEditor: TextPropertyEditor,
  });
}

export function PlaygroundContent() {
  const { showToast } = useToast();
  const { isTemplateGalleryOpen, setIsTemplateGalleryOpen } =
    useWorkspaceStore();
  const [activeLeftPanel, setActiveLeftPanel] = useState<
    "workspace" | "editor" | null
  >(null);
  const [mounted, setMounted] = useState(false);
  const [isMobilePropertiesOpen, setIsMobilePropertiesOpen] = useState(false);

  useEffect(() => {
    const initWorkspace = async () => {
      let loadedFromSession = false;
      // Load schema from session storage if available
      try {
        const storedSchema = sessionStorage.getItem("papercast_schema");
        if (storedSchema) {
          JSON.parse(storedSchema); // Validate JSON
          useDocumentStore.getState().setJsonString(storedSchema);
          // Clear it so it doesn't persist across fresh navigations later
          sessionStorage.removeItem("papercast_schema");
          loadedFromSession = true;
        }
      } catch (e) {
        console.error("Failed to load schema from session storage", e);
      }

      if (!loadedFromSession) {
        await useWorkspaceStore.getState().loadWorkspace();
        const currentStore = useWorkspaceStore.getState();
        const schemas = currentStore.schemas;
        if (schemas && schemas.length > 0) {
          const latestSchema = [...schemas].sort(
            (a, b) => b.updatedAt - a.updatedAt
          )[0];
          const content = await currentStore.loadSchemaContent(latestSchema.id);
          if (content) {
            useDocumentStore.getState().setJsonString(content);
            currentStore.setActiveSchema(latestSchema.id);
            currentStore.setLastSavedJsonString(content);
          }
        }
      }
      setMounted(true);
    };

    initWorkspace();
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin securely
      const urlParams = new URL(window.location.href).searchParams;
      const allowedOrigin = urlParams.get("allowedOrigin");

      if (event.origin !== window.location.origin) {
        if (
          !allowedOrigin ||
          (allowedOrigin !== "*" && event.origin !== allowedOrigin)
        ) {
          console.warn(
            `Blocked message from unauthorized origin: ${event.origin}. Pass ?allowedOrigin=${event.origin} to allow.`
          );
          return;
        }
      }

      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "LOAD_SCHEMA") {
        const payload = data.payload;
        if (payload) {
          const schemaString =
            typeof payload === "string"
              ? payload
              : JSON.stringify(payload, null, 2);

          if (schemaString) {
            useDocumentStore.getState().setJsonString(schemaString);
            if (
              event.source &&
              typeof (event.source as Window).postMessage === "function"
            ) {
              (event.source as Window).postMessage(
                { type: "SCHEMA_LOADED", status: "success" },
                event.origin
              );
            }
            showToast("Schema loaded via embedding.");
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [showToast]);

  // Map old showEditor to activeLeftPanel for the shortcut hook
  const setShowEditor = useCallback((action: React.SetStateAction<boolean>) => {
    setActiveLeftPanel((prev) => {
      const isCurrentlyEditor = prev === "editor";
      const nextState =
        typeof action === "function" ? action(isCurrentlyEditor) : action;
      return nextState ? "editor" : null;
    });
  }, []);

  usePlaygroundShortcuts(setShowEditor, showToast);

  const parsedDocument = useDocumentStore((state) => state.parsedDocument);
  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);
  const isValid = useDocumentStore((state) => state.isValid);
  const updateNodeProperty = useDocumentStore(
    (state) => state.updateNodeProperty
  );
  const replaceNode = useDocumentStore((state) => state.replaceNode);
  const deleteNode = useDocumentStore((state) => state.deleteNode);
  const moveNode = useDocumentStore((state) => state.moveNode);
  const setSelectedNodeId = useDocumentStore(
    (state) => state.setSelectedNodeId
  );
  const storeInsertNode = useDocumentStore((state) => state.insertNode);

  const insertNode = useCallback(
    (parentId: string, node: any, index?: number) => {
      storeInsertNode(parentId, index, node);
    },
    [storeInsertNode]
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground/70">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <EditorProvider
      state={{ document: parsedDocument, selectedNodeId, isValid }}
      actions={{
        setSelectedNodeId,
        updateNodeProperty,
        replaceNode,
        insertNode,
        deleteNode,
        moveNode,
      }}
    >
      <main className="flex h-[100dvh] w-screen overflow-hidden bg-background text-foreground font-sans print:h-auto print:w-auto print:overflow-visible transition-colors">
        {/* Activity Bar */}
        <div className="w-12 bg-surface border-r border-border hidden md:flex flex-col items-center py-4 gap-4 shrink-0 z-20 print:hidden shadow-md relative">
          <button
            onClick={() =>
              setActiveLeftPanel((p) =>
                p === "workspace" ? null : "workspace"
              )
            }
            className={`p-2 rounded-lg transition-colors ${activeLeftPanel === "workspace" ? "text-accent bg-accent/10" : "text-foreground/50 hover:text-foreground"}`}
            title="Workspace Explorer"
          >
            <Folder size={20} />
          </button>
          <button
            onClick={() =>
              setActiveLeftPanel((p) => (p === "editor" ? null : "editor"))
            }
            className={`p-2 rounded-lg transition-colors ${activeLeftPanel === "editor" ? "text-accent bg-accent/10" : "text-foreground/50 hover:text-foreground"}`}
            title="JSON Schema Editor"
          >
            <Code2 size={20} />
          </button>

          <div className="mt-auto">
            <button
              onClick={() => setActiveLeftPanel(null)}
              className={`p-2 rounded-lg transition-colors ${activeLeftPanel === null ? "text-foreground/20 cursor-default" : "text-foreground/50 hover:text-foreground"}`}
              title="Close Left Panel"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Workspace */}
        {activeLeftPanel === "workspace" && (
          <div className="hidden md:flex flex-col z-10 relative shadow-xl shrink-0 print:hidden w-64 bg-background animate-in slide-in-from-left-8 fade-in duration-300 ease-out border-r border-border">
            <WorkspaceSidebar />
          </div>
        )}

        {/* Desktop Editor */}
        {activeLeftPanel === "editor" && (
          <LeftSidebar>
            <JsonEditor />
          </LeftSidebar>
        )}

        {/* Mobile Workspace */}
        {activeLeftPanel === "workspace" && (
          <MobileSidebar
            title="Workspace"
            onClose={() => setActiveLeftPanel(null)}
          >
            <WorkspaceSidebar />
          </MobileSidebar>
        )}

        {/* Mobile Editor */}
        {activeLeftPanel === "editor" && (
          <MobileSidebar
            title="JSON Editor"
            onClose={() => setActiveLeftPanel(null)}
          >
            <JsonEditor />
          </MobileSidebar>
        )}

        <div className="flex-1 flex flex-col h-full relative overflow-hidden print:overflow-visible">
          <div className="flex-1 overflow-hidden relative">
            <DocumentPreview
              isEditorVisible={activeLeftPanel === "editor"}
              onToggleEditor={() => setShowEditor((s) => !s)}
              onToggleWorkspace={() =>
                setActiveLeftPanel((p) =>
                  p === "workspace" ? null : "workspace"
                )
              }
            />
          </div>
          <MobileWidgetsBar
            onSettingsClick={() => setIsMobilePropertiesOpen(true)}
          />
        </div>

        <RightSidebar />
        <MobilePropertiesSheet
          isOpen={isMobilePropertiesOpen}
          onClose={() => setIsMobilePropertiesOpen(false)}
        />

        <McpStatusBadge />

        {isTemplateGalleryOpen && (
          <TemplateGalleryDialog
            onClose={() => setIsTemplateGalleryOpen(false)}
          />
        )}
      </main>
    </EditorProvider>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <PlaygroundContent />
    </ToastProvider>
  );
}
