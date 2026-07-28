import React, { useState } from "react";
import { BaseNode } from "../../types/schema";
import { NodeRegistry } from "../../registry/NodeRegistry";
import { useDocumentStore } from "../../store/documentStore";
import { HoverToolbar } from "../editor/HoverToolbar";
import { useRendererContext } from "./RendererContext";

export interface PageContext {
  pageNumber: number;
  pageCount: number;
}

interface NodeRendererProps {
  node: BaseNode;
  path?: string;
  pageContext?: PageContext;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({ node, path, pageContext }) => {
  const def = NodeRegistry.get(node.type);
  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useDocumentStore((state) => state.setSelectedNodeId);
  const insertNode = useDocumentStore((state) => state.insertNode);
  const insertNodeSibling = useDocumentStore((state) => state.insertNodeSibling);
  const moveNodeToParent = useDocumentStore((state) => state.moveNodeToParent);
  const moveNodeToSibling = useDocumentStore((state) => state.moveNodeToSibling);
  const [isHovered, setIsHovered] = useState(false);
  const [dropPosition, setDropPosition] = useState<'top' | 'bottom' | 'inside' | null>(null);

  // Retrieve rendering contexts
  let rendererCtx;
  try {
    rendererCtx = useRendererContext();
  } catch (e) {
    // context may not be defined (e.g. in OffscreenMeasurer)
  }

  const activeTab = rendererCtx?.activeTab;
  const location = rendererCtx?.location;

  const allowHeaderFooterEditing = useDocumentStore((state) => state.allowHeaderFooterEditing);

  // Determine if this element is editable in the current active tab
  const isEditable =
    !activeTab || // If no activeTab, fallback to editable
    (activeTab === "content" && (location === "body" || !location || allowHeaderFooterEditing)) ||
    (activeTab === "headers" && location === "header") ||
    (activeTab === "footers" && location === "footer");

  const isSelected = selectedNodeId ? (node.id.split('-part')[0] === selectedNodeId.split('-part')[0]) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditable) return;
    setSelectedNodeId(node.id);
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(true);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    if (!isEditable) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('application/formcast-node-id', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditable) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const isContainer = node.children !== undefined || ['row', 'column', 'root', 'ul', 'ol', 'radioGroup'].includes(node.type);

    let isEmptyContainer = false;
    if (isContainer && (!node.children || node.children.length === 0)) {
      isEmptyContainer = true;
    }

    const yRatio = (e.clientY - rect.top) / rect.height;

    if (node.type === 'root' || isEmptyContainer) {
      setDropPosition('inside');
    } else if (isContainer) {
      if (yRatio < 0.25) {
        setDropPosition('top');
      } else if (yRatio > 0.75) {
        setDropPosition('bottom');
      } else {
        setDropPosition('inside');
      }
    } else {
      if (yRatio < 0.5) {
        setDropPosition('top');
      } else {
        setDropPosition('bottom');
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

    const widgetType = e.dataTransfer.getData('application/formcast-widget');
    const existingNodeId = e.dataTransfer.getData('application/formcast-node-id');

    if (widgetType) {
      let defaultProps: any = undefined;
      let defaultLayout: any = undefined;
      if (widgetType === 'text') defaultProps = { literal: 'New Text' };
      if (widgetType === 'richText') defaultProps = { htmlLiteral: '<p>New Rich Text</p>' };
      if (widgetType === 'listTile') defaultProps = { titleLiteral: 'Title', subtitleLiteral: 'Subtitle' };
      if (widgetType === 'checkbox' || widgetType === 'radio') defaultProps = { labelLiteral: 'Option' };
      if (['row', 'column', 'ul', 'ol', 'radioGroup'].includes(widgetType)) defaultLayout = { minHeight: 40 };

      const newNode: BaseNode = {
        id: `node-${Date.now()}`,
        type: widgetType as any,
        layout: defaultLayout || {},
        ...(defaultProps ? { props: defaultProps } : {})
      };

      if (currentDropPosition === 'inside') {
        insertNode(node.id, undefined, newNode);
      } else if (currentDropPosition === 'top' || currentDropPosition === 'bottom') {
        insertNodeSibling(node.id, currentDropPosition === 'top' ? 'before' : 'after', newNode);
      } else {
        insertNode(node.id, undefined, newNode); // fallback
      }
    } else if (existingNodeId && existingNodeId !== node.id) {
      if (currentDropPosition === 'inside') {
        moveNodeToParent(existingNodeId, node.id);
      } else if (currentDropPosition === 'top' || currentDropPosition === 'bottom') {
        moveNodeToSibling(existingNodeId, node.id, currentDropPosition === 'top' ? 'before' : 'after');
      }
    }
  };

  if (!def) {
    return (
      <div
        style={{ color: "red", border: "1px solid red", padding: 4 }}
        onClick={handleClick}
      >
        Unknown node type: {node.type}
      </div>
    );
  }

  const Component = def.render;

  let isEmpty = false;
  const isContainerType = ['row', 'column', 'root', 'ul', 'ol', 'radioGroup'].includes(node.type);
  if (isContainerType && (!node.children || node.children.length === 0)) isEmpty = true;
  if (node.type === 'text' && !node.props?.literal && !node.bind?.path) isEmpty = true;
  if (node.type === 'richText' && !node.props?.htmlLiteral && !node.props?.htmlBind) isEmpty = true;

  let dropStyle: React.CSSProperties = {};
  if (dropPosition === 'inside') {
    dropStyle = { outline: '2px dashed #3b82f6', outlineOffset: '-2px', backgroundColor: 'rgba(59, 130, 246, 0.05)' };
  } else if (dropPosition === 'top') {
    dropStyle = { borderTop: '3px solid #3b82f6' };
  } else if (dropPosition === 'bottom') {
    dropStyle = { borderBottom: '3px solid #3b82f6' };
  }

  const layout = node.layout || {};
  const wrapperStyle: React.CSSProperties = {
    ...dropStyle,
    display: "flex",
    flexDirection: "column",
    flex: layout.flex,
    flexGrow: layout.flex !== undefined ? undefined : layout.flexGrow,
    flexShrink: layout.flex !== undefined ? undefined : layout.flexShrink,
    flexBasis: layout.flex !== undefined ? undefined : layout.flexBasis,
    width: layout.width,
    height: layout.height,
    minHeight: layout.minHeight,
    cursor: !isEditable ? "not-allowed" : undefined,
  };

  Object.keys(wrapperStyle).forEach(key => {
    if ((wrapperStyle as any)[key] === undefined) {
      delete (wrapperStyle as any)[key];
    }
  });

  return (
    <div
      data-node-id={node.id}
      className={`relative group transition-all ${isEmpty ? 'empty-widget' : ''} ${!isEditable ? 'cursor-not-allowed pointer-events-auto [&_*]:pointer-events-none' : ''}`}
      style={wrapperStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      draggable={isEditable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isEditable && isHovered && !isSelected && (
        <div className="absolute inset-0 border border-blue-300 pointer-events-none z-40 print-hidden" />
      )}
      {isEditable && isHovered && <HoverToolbar nodeId={node.id} />}
      {!isEditable && isHovered && (
        <div className="absolute top-2 right-2 bg-gray-950/95 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-md z-50 pointer-events-none whitespace-nowrap border border-gray-800/80 backdrop-blur-sm print-hidden animate-in fade-in zoom-in-95 duration-100">
          🔒 Editing disabled. Go to "{location}s" screen or enable "Edit Header/Footer" in Page Setup.
        </div>
      )}
      <Component
        node={node}
        path={path}
        isSelected={isSelected && isEditable}
        onSelect={handleClick}
        pageContext={pageContext}
      />
    </div>
  );
};
