"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const JsonEditor = dynamic(
  () =>
    import("../../../components/editor/JsonEditor").then(
      (mod) => mod.JsonEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] text-gray-400 w-full min-w-[300px]">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium animate-pulse">
          Initializing Editor...
        </p>
      </div>
    ),
  }
);
import { DocumentPreview } from "../../../components/renderer/DocumentPreview";
import {
  EditorProvider,
  PropertyPanel,
  WidgetsPanel,
} from "@formcast/react/editor";
import { useDocumentStore } from "../../../store/documentStore";
import { useMcpSync } from "../../../hooks/useMcpSync";
import { registerDefaultWidgets } from "@formcast/react/widgets";

// Register default FormCast widgets on client load
registerDefaultWidgets();

const usePlaygroundShortcuts = (
  setShowEditor: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const setZoom = useDocumentStore((state) => state.setZoom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod) {
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault();
            setZoom((z) => Math.min(2, z + 0.1));
            break;
          case "-":
            e.preventDefault();
            setZoom((z) => Math.max(0.25, z - 0.1));
            break;
          case "0":
            e.preventDefault();
            setZoom(1);
            break;
          case "\\":
          case "b":
          case "e":
            e.preventDefault();
            setShowEditor((s) => !s);
            break;
          case "s":
          case "S":
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("formcast-download-pdf"));
            break;
          case "p":
          case "P":
            e.preventDefault();
            window.print();
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [setZoom, setShowEditor]);
};

const LeftSidebar = ({ children }: { children: React.ReactNode }) => {
  const [leftWidth, setLeftWidth] = useState(400);
  const isLeftDragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    isLeftDragging.current = true;
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
  }, []);

  const handleMouseUp = useCallback(() => {
    isLeftDragging.current = false;
    setIsDragging(false);
    document.body.style.cursor = "default";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isLeftDragging.current) {
      const newWidth = Math.max(
        200,
        Math.min(e.clientX, window.innerWidth - 400)
      );
      setLeftWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div
        style={{ width: leftWidth }}
        className="flex flex-col z-10 shadow-xl relative shrink-0 print:hidden"
      >
        {children}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="w-2 bg-gray-200 hover:bg-blue-500 transition-colors cursor-col-resize z-20 flex items-center justify-center shrink-0 print:hidden"
      >
        <div className="h-8 w-1 bg-gray-400 rounded-full" />
      </div>
    </>
  );
};

const RightSidebar = () => {
  const [rightWidth, setRightWidth] = useState(320);
  const isRightDragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    isRightDragging.current = true;
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
  }, []);

  const handleMouseUp = useCallback(() => {
    isRightDragging.current = false;
    setIsDragging(false);
    document.body.style.cursor = "default";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isRightDragging.current) {
      const newWidth = Math.max(
        200,
        Math.min(window.innerWidth - e.clientX, window.innerWidth - 400)
      );
      setRightWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const rightPanelMode = useDocumentStore((state) => state.rightPanelMode);
  const setRightPanelMode = useDocumentStore(
    (state) => state.setRightPanelMode
  );
  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        className="w-2 bg-gray-200 hover:bg-blue-500 transition-colors cursor-col-resize z-20 flex items-center justify-center shrink-0 print:hidden"
      >
        <div className="h-8 w-1 bg-gray-400 rounded-full" />
      </div>
      <div
        style={{ width: rightWidth, minWidth: 260 }}
        className="flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)] relative shrink-0 print:hidden bg-white h-full"
      >
        <div className="flex border-b border-gray-200 shrink-0">
          <button
            className={`flex-1 py-3 text-xs font-medium text-center focus:outline-none ${rightPanelMode === "widgets" ? "border-b-2 border-blue-500 text-blue-600 bg-white" : "text-gray-500 hover:text-gray-700 bg-gray-50"}`}
            onClick={() => setRightPanelMode("widgets")}
          >
            Widgets
          </button>
          <button
            className={`flex-1 py-3 text-xs font-medium text-center focus:outline-none ${rightPanelMode === "properties" ? "border-b-2 border-blue-500 text-blue-600 bg-white" : "text-gray-500 hover:text-gray-700 bg-gray-50"}`}
            onClick={() => setRightPanelMode("properties")}
          >
            Properties {selectedNodeId ? "•" : ""}
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {rightPanelMode === "widgets" && (
            <WidgetsPanel
              onSettingsClick={() => setRightPanelMode("properties")}
            />
          )}
          {rightPanelMode === "properties" && <PropertyPanel />}
        </div>
      </div>
    </>
  );
};

export default function Home() {
  const { isConnected, sessionId } = useMcpSync();
  const [showEditor, setShowEditor] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load schema from session storage if available
    try {
      const storedSchema = sessionStorage.getItem("formcast_schema");
      if (storedSchema) {
        JSON.parse(storedSchema); // Validate JSON
        useDocumentStore.getState().setJsonString(storedSchema);
        // Clear it so it doesn't persist across fresh navigations later
        sessionStorage.removeItem("formcast_schema");
      }
    } catch (e) {
      console.error("Failed to load schema from session storage", e);
    }
  }, []);

  usePlaygroundShortcuts(setShowEditor);

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
      <div className="flex items-center justify-center h-screen bg-[#1e1e1e] text-gray-400">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
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
      <main className="flex h-screen w-screen overflow-hidden bg-white text-black font-sans print:h-auto print:w-auto print:overflow-visible">
        {showEditor && (
          <LeftSidebar>
            <JsonEditor />
          </LeftSidebar>
        )}

        <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden print:overflow-visible">
          <DocumentPreview
            isEditorVisible={showEditor}
            onToggleEditor={() => setShowEditor((s) => !s)}
          />
        </div>

        <RightSidebar />

        {/* MCP Connection Status Badge */}
        <div className="absolute bottom-4 left-4 z-50 print:hidden">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border text-xs font-medium bg-white ${isConnected ? "border-green-200 text-green-700" : "border-gray-200 text-gray-500"}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            />
            {isConnected ? `MCP Connected: ${sessionId}` : "MCP Disconnected"}
          </div>
        </div>
      </main>
    </EditorProvider>
  );
}
