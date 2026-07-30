import React, { useRef, useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpLeft,
  Trash2,
  CornerLeftUp,
} from "lucide-react";
import { useDocumentStore } from "../../store/documentStore";
import { BaseNode } from "@formcast/core";

export const HoverToolbar: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { moveNode, deleteNode, setSelectedNodeId, parsedDocument } =
    useDocumentStore();
  const ref = useRef<HTMLDivElement>(null);
  const [positionAtBottom, setPositionAtBottom] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const parent = ref.current.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        const pageEl = parent.closest(".print-page");
        if (pageEl) {
          const pageRect = pageEl.getBoundingClientRect();
          const relativeTop = rect.top - pageRect.top;
          if (relativeTop < 28) {
            setPositionAtBottom(true);
          }
        }
      }
    }
  }, []);

  const findParentId = (node: BaseNode, targetId: string): string | null => {
    if (node.children) {
      for (const child of node.children) {
        if (child.id === targetId) return node.id;
        const found = findParentId(child as BaseNode, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFocusParent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!parsedDocument) return;
    const roots: BaseNode[] = [parsedDocument.document.body];
    if (parsedDocument.document.headers)
      Object.values(parsedDocument.document.headers).forEach(
        (h) => h.root && roots.push(h.root)
      );
    if (parsedDocument.document.footers)
      Object.values(parsedDocument.document.footers).forEach(
        (f) => f.root && roots.push(f.root)
      );
    if (parsedDocument.definitions?.widgets)
      Object.values(parsedDocument.definitions.widgets).forEach(
        (w) => w.root && roots.push(w.root)
      );

    for (const root of roots) {
      const parentId = findParentId(root, nodeId);
      if (parentId) {
        setSelectedNodeId(parentId);
        return;
      }
    }
  };

  const handleAction = (
    e: React.MouseEvent,
    action: "up" | "down" | "out" | "delete"
  ) => {
    e.stopPropagation();
    if (action === "delete") {
      deleteNode(nodeId);
    } else {
      moveNode(nodeId, action);
      // Select the node so the user sees the properties update
      setSelectedNodeId(nodeId);
    }
  };

  return (
    <div
      ref={ref}
      className={`absolute ${positionAtBottom ? "top-full mt-1 before:-top-2" : "top-0 -mt-6 before:-bottom-2"} right-0 mr-1 bg-gray-900 text-white rounded-md shadow-lg flex items-center p-1 z-50 print-hidden before:content-[''] before:absolute before:left-0 before:right-0 before:h-2 before:bg-transparent`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="p-1 hover:bg-gray-700 rounded transition-colors text-blue-300 hover:text-blue-200"
        onClick={handleFocusParent}
        title="Select Parent Widget"
      >
        <CornerLeftUp size={14} />
      </button>
      <div className="w-px h-3 bg-gray-600 mx-1"></div>
      <button
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        onClick={(e) => handleAction(e, "up")}
        title="Move Up"
      >
        <ArrowUp size={14} />
      </button>
      <button
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        onClick={(e) => handleAction(e, "down")}
        title="Move Down"
      >
        <ArrowDown size={14} />
      </button>
      <button
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        onClick={(e) => handleAction(e, "out")}
        title="Move out of Parent"
      >
        <ArrowUpLeft size={14} />
      </button>
      <div className="w-px h-3 bg-gray-600 mx-1"></div>
      <button
        className="p-1 text-red-400 hover:bg-red-900/50 hover:text-red-300 rounded transition-colors"
        onClick={(e) => handleAction(e, "delete")}
        title="Delete Node"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
