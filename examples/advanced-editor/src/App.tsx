import { useState, useCallback, useRef, useEffect } from "react";
import { JsonEditor } from "./components/editor/JsonEditor";
import { DocumentPreview } from "./components/renderer/DocumentPreview";
import {
  WidgetsPanel,
  PropertyPanel,
  EditorProvider,
} from "@formcast/react/editor";
import { useDocumentStore } from "./store/documentStore";
import "./index.css";

const usePlaygroundShortcuts = (
  setShowEditor: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const setZoom = useDocumentStore((state) => state.setZoom);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCommandDown = isMac ? e.metaKey : e.ctrlKey;
      if (isCommandDown) {
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

export default function App() {
  const [showEditor, setShowEditor] = useState(true);

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
      </main>
    </EditorProvider>
  );
}
