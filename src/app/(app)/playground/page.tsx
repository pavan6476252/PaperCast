"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { JsonEditor } from "../../../components/editor/JsonEditor";
import { DocumentPreview } from "../../../components/renderer/DocumentPreview";
import { PropertyPanel } from "../../../components/editor/PropertyPanel";
import { WidgetsPanel } from "../../../components/editor/WidgetsPanel";
import { useDocumentStore } from "../../../store/documentStore";

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(400); // initial width in pixels
  const [rightWidth, setRightWidth] = useState(320); // initial right width
  const [showEditor, setShowEditor] = useState(true);
  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);
  const rightPanelMode = useDocumentStore((state) => state.rightPanelMode);
  const setRightPanelMode = useDocumentStore(
    (state) => state.setRightPanelMode
  );
  const isLeftDragging = useRef(false);
  const isRightDragging = useRef(false);

  const handleLeftMouseDown = useCallback((_e: React.MouseEvent) => {
    isLeftDragging.current = true;
    document.body.style.cursor = "col-resize";
  }, []);

  const handleRightMouseDown = useCallback((__e: React.MouseEvent) => {
    isRightDragging.current = true;
    document.body.style.cursor = "col-resize";
  }, []);

  const handleMouseUp = useCallback(() => {
    isLeftDragging.current = false;
    isRightDragging.current = false;
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
    if (isRightDragging.current) {
      const newWidth = Math.max(
        200,
        Math.min(window.innerWidth - e.clientX, window.innerWidth - 400)
      );
      setRightWidth(newWidth);
    }
  }, []);

  const setZoom = useDocumentStore((state) => state.setZoom);
  const parsedDocument = useDocumentStore((state) => state.parsedDocument);
  const deconstructAllRichText = useDocumentStore(
    (state) => state.deconstructAllRichText
  );
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (
      !initialLoadDone.current &&
      parsedDocument?.meta?.richTextPreferences?.autoDeconstruct
    ) {
      initialLoadDone.current = true;
      deconstructAllRichText();
    }
  }, [parsedDocument, deconstructAllRichText]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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
            // Check if key is one of the toggles (e.g. Cmd+\ or Cmd+B or Cmd+E)
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
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture to intercept keys before editor or browser actions
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [setZoom]);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-white text-black font-sans print:h-auto print:w-auto print:overflow-visible">
      {showEditor && (
        <>
          <div
            style={{ width: leftWidth }}
            className="flex flex-col z-10 shadow-xl relative shrink-0 print:hidden"
          >
            <JsonEditor />
          </div>

          {/* Resizer Handle */}
          <div
            onMouseDown={handleLeftMouseDown}
            className="w-2 bg-gray-200 hover:bg-blue-500 transition-colors cursor-col-resize z-20 flex items-center justify-center shrink-0 print:hidden"
          >
            <div className="h-8 w-1 bg-gray-400 rounded-full" />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden print:overflow-visible">
        <DocumentPreview
          isEditorVisible={showEditor}
          onToggleEditor={() => setShowEditor((s) => !s)}
        />
      </div>

      {/* Right Resizer Handle */}
      <div
        onMouseDown={handleRightMouseDown}
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
          {rightPanelMode === "widgets" && <WidgetsPanel />}
          {rightPanelMode === "properties" && <PropertyPanel />}
        </div>
      </div>
    </main>
  );
}
