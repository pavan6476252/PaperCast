import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpLeft,
  Trash2,
  CornerLeftUp,
} from "lucide-react";
import { AnyNode } from "@papercast/core";
import { usePaperCastEditor } from "../EditorProvider";

export const HoverToolbar: React.FC<{
  nodeId: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}> = ({ nodeId, onMouseEnter, onMouseLeave }) => {
  const {
    deleteNode,
    moveNode,
    setSelectedNodeId,
    document: parsedDocument,
  } = usePaperCastEditor();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [positionAtBottom, setPositionAtBottom] = useState(false);

  useEffect(() => {
    const el =
      document.querySelector(`.print-page [data-node-id="${nodeId}"]`) ||
      document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!el) return;

    const updatePosition = () => {
      const bounds = el.getBoundingClientRect();
      setRect(bounds);

      const pageEl = el.closest(".print-page");
      if (pageEl) {
        const pageRect = pageEl.getBoundingClientRect();
        const relativeTop = bounds.top - pageRect.top;
        if (relativeTop < 28) {
          setPositionAtBottom(true);
        } else {
          setPositionAtBottom(false);
        }
      }
    };

    updatePosition();

    // Update on scroll/resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [nodeId]);

  const findParentId = (node: AnyNode, targetId: string): string | null => {
    if (node.children) {
      for (const child of node.children) {
        if (child.id === targetId) return node.id;
        const found = findParentId(child, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFocusParent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!parsedDocument) return;
    const roots: AnyNode[] = [parsedDocument.document.body];
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

  if (!rect) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    top: positionAtBottom ? rect.bottom + 4 : rect.top - 28,
    left: rect.right - 120, // Approximate width of toolbar
    zIndex: 9999,
  };

  return createPortal(
    <div
      style={style}
      className="bg-gray-900 text-white rounded-md shadow-lg flex items-center p-1 print-hidden animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
      onMouseOut={(e) => e.stopPropagation()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
    </div>,
    document.body
  );
};
