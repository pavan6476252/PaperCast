import React, { useState } from "react";
import { AnyNode } from "@papercast/core";
import { useDocumentStore } from "../../store/documentStore";

import { usePaperCastContext } from "@papercast/react";
import { HoverToolbar } from "@papercast/react/editor";

export const EditorNodeWrapper: React.FC<{
  node: AnyNode;
  renderContent: (
    props?: React.HTMLAttributes<HTMLDivElement> & {
      "data-selected"?: boolean;
    },
    overlays?: React.ReactNode
  ) => React.ReactNode;
}> = ({ node, renderContent }) => {
  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useDocumentStore(
    (state) => state.setSelectedNodeId
  );
  const insertNode = useDocumentStore((state) => state.insertNode);
  const insertNodeSibling = useDocumentStore(
    (state) => state.insertNodeSibling
  );
  const moveNodeToParent = useDocumentStore((state) => state.moveNodeToParent);
  const moveNodeToSibling = useDocumentStore(
    (state) => state.moveNodeToSibling
  );
  const allowHeaderFooterEditing = useDocumentStore(
    (state) => state.allowHeaderFooterEditing
  );
  const [isHovered, setIsHovered] = useState(false);
  const [dropPosition, setDropPosition] = useState<
    "top" | "bottom" | "inside" | null
  >(null);

  let rendererCtx;
  try {
    rendererCtx = usePaperCastContext();
  } catch {}

  const activeTab = rendererCtx?.activeTab;
  const location = rendererCtx?.location;

  const isEditable =
    !activeTab ||
    (activeTab === "content" &&
      (location === "body" || !location || allowHeaderFooterEditing)) ||
    (activeTab === "headers" && location === "header") ||
    (activeTab === "footers" && location === "footer");

  const isSelected = selectedNodeId
    ? node.id.split("-part")[0] === selectedNodeId.split("-part")[0]
    : false;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditable) return;
    setSelectedNodeId(node.id);
  };

  const hoverTimeoutRef = React.useRef<NodeJS.Timeout>(null);

  const handleMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    if (!isEditable) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("application/papercast-node-id", node.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 50);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditable) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const isContainer =
      node.children !== undefined ||
      ["row", "column", "root", "ul", "ol", "radioGroup"].includes(node.type);

    let isEmptyContainer = false;
    if (isContainer && (!node.children || node.children.length === 0)) {
      isEmptyContainer = true;
    }

    const yRatio = (e.clientY - rect.top) / rect.height;

    if (node.type === "root" || isEmptyContainer) {
      setDropPosition("inside");
    } else if (isContainer) {
      if (yRatio < 0.25) {
        setDropPosition("top");
      } else if (yRatio > 0.75) {
        setDropPosition("bottom");
      } else {
        setDropPosition("inside");
      }
    } else {
      if (yRatio < 0.5) {
        setDropPosition("top");
      } else {
        setDropPosition("bottom");
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditable) return;

    const currentDropPosition = dropPosition; // capture before reset
    setDropPosition(null);

    const widgetType = e.dataTransfer.getData("application/papercast-widget");
    const existingNodeId = e.dataTransfer.getData(
      "application/papercast-node-id"
    );

    if (widgetType) {
      let defaultProps: Record<string, unknown> | undefined = undefined;
      let defaultLayout: Record<string, unknown> | undefined = undefined;
      if (widgetType === "text") defaultProps = { literal: "New Text" };
      if (widgetType === "richText")
        defaultProps = { htmlLiteral: "<p>New Rich Text</p>" };
      if (widgetType === "listTile")
        defaultProps = { titleLiteral: "Title", subtitleLiteral: "Subtitle" };
      if (widgetType === "checkbox" || widgetType === "radio")
        defaultProps = { labelLiteral: "Option" };
      if (["row", "column", "ul", "ol", "radioGroup"].includes(widgetType))
        defaultLayout = { minHeight: 40 };

      const newNode: AnyNode = {
        // eslint-disable-next-line react-hooks/purity
        id: `node-${Date.now()}`,
        type: widgetType as AnyNode["type"],
        layout: defaultLayout || {},
        ...(defaultProps ? { props: defaultProps } : {}),
      } as AnyNode;

      if (currentDropPosition === "inside") {
        insertNode(node.id, undefined, newNode);
      } else if (
        currentDropPosition === "top" ||
        currentDropPosition === "bottom"
      ) {
        insertNodeSibling(
          node.id,
          currentDropPosition === "top" ? "before" : "after",
          newNode
        );
      } else {
        insertNode(node.id, undefined, newNode); // fallback
      }
    } else if (existingNodeId && existingNodeId !== node.id) {
      if (currentDropPosition === "inside") {
        moveNodeToParent(existingNodeId, node.id);
      } else if (
        currentDropPosition === "top" ||
        currentDropPosition === "bottom"
      ) {
        moveNodeToSibling(
          existingNodeId,
          node.id,
          currentDropPosition === "top" ? "before" : "after"
        );
      }
    }
  };

  let dropStyle: React.CSSProperties = {};
  if (dropPosition === "inside") {
    dropStyle = {
      outline: "2px dashed #3b82f6",
      outlineOffset: "-2px",
      backgroundColor: "rgba(59, 130, 246, 0.05)",
    };
  } else if (dropPosition === "top") {
    dropStyle = { borderTop: "3px solid #3b82f6" };
  } else if (dropPosition === "bottom") {
    dropStyle = { borderBottom: "3px solid #3b82f6" };
  }

  const overlays = (
    <>
      {isEditable && isHovered && !isSelected && (
        <div className="absolute inset-0 border border-blue-300 pointer-events-none z-40 print-hidden" />
      )}
      {isEditable && (isHovered || isSelected) && (
        <HoverToolbar
          nodeId={node.id}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
        />
      )}
      {!isEditable && isHovered && (
        <div className="absolute top-2 right-2 bg-foreground text-background text-[10px] font-semibold px-2 py-1 rounded-md shadow-md z-50 pointer-events-none whitespace-nowrap border border-border/80 backdrop-blur-sm print-hidden animate-in fade-in zoom-in-95 duration-100">
          🔒 Editing disabled. Go to "{location}s" screen or enable "Edit
          Header/Footer" in Page Setup.
        </div>
      )}
    </>
  );

  const renderProps = {
    "data-selected": isSelected && isEditable,
    onClick: handleClick,
    onMouseOver: handleMouseOver,
    onMouseOut: handleMouseOut,
    draggable: isEditable,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    style: {
      ...dropStyle,
      position: "relative" as React.CSSProperties["position"],
    },
    className: !isEditable
      ? "cursor-not-allowed pointer-events-auto [&_*]:pointer-events-none"
      : "",
  };

  return (
    <>
      {/* eslint-disable-next-line react-hooks/refs */}
      {renderContent(renderProps, overlays)}
    </>
  );
};
