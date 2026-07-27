import React from "react";
import { BaseNode, RootNode, RowNode, ColumnNode, TextNode, ImageNode, SpacerNode } from "../../../types/schema";
import { getStyle } from "../utils/styleUtils";
import { NodeRenderer } from "../NodeRenderer";
import { NodeRegistry } from "../../../registry/NodeRegistry";
import { useDocumentStore } from "../../../store/documentStore";
import { useRendererContext } from "../RendererContext";

// Helper to render children
const renderChildren = (node: BaseNode) => {
  return node.children?.map((child, index) => (
    <NodeRenderer key={child.id || index} node={child} />
  ));
};

interface BaseProps {
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
  pageContext?: { pageNumber: number; pageCount: number };
}

const getInteractionStyle = (isSelected?: boolean) => ({
  outline: isSelected ? "2px solid #3b82f6" : "none",
  outlineOffset: "-2px",
  cursor: "pointer",
});

// --- Root Node ---
const RootComponent: React.FC<{ node: RootNode } & BaseProps> = ({ node, isSelected, onSelect }) => {
  return (
    <div
      style={{ ...getStyle(node), position: "relative", ...getInteractionStyle(isSelected) }}
      onClick={onSelect}
    >
      {renderChildren(node)}
    </div>
  );
};
NodeRegistry.register({
  type: "root",
  measure: () => 0, // Placeholder
  render: RootComponent,
});

// --- Row Node ---
const RowComponent: React.FC<{ node: RowNode } & BaseProps> = ({ node, isSelected, onSelect }) => {
  return (
    <div
      style={{ ...getStyle(node), flexDirection: "row", ...getInteractionStyle(isSelected) }}
      onClick={onSelect}
    >
      {renderChildren(node)}
    </div>
  );
};
NodeRegistry.register({
  type: "row",
  measure: () => 0,
  render: RowComponent,
});

// --- Column Node ---
const ColumnComponent: React.FC<{ node: ColumnNode } & BaseProps> = ({ node, isSelected, onSelect }) => {
  return (
    <div
      style={{ ...getStyle(node), flexDirection: "column", ...getInteractionStyle(isSelected) }}
      onClick={onSelect}
    >
      {renderChildren(node)}
    </div>
  );
};
NodeRegistry.register({
  type: "column",
  measure: () => 0,
  render: ColumnComponent,
});

// Helper to resolve nested object path
const resolvePath = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// --- Text Node ---
const TextComponent: React.FC<{ node: TextNode } & BaseProps> = ({ node, isSelected, onSelect }) => {
  const { data, pageContext } = useRendererContext();
  let content = "";

  if (node.props?.literal) {
    content = node.props.literal;
    // Interpolate any {{ path.to.value }}
    content = content.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, path) => {
      const trimmed = path.trim();
      if (trimmed === "pageNumber") {
        return pageContext ? String(pageContext.pageNumber) : "";
      }
      if (trimmed === "pageCount") {
        return pageContext ? String(pageContext.pageCount) : "";
      }

      const val = resolvePath(data, trimmed);
      return val !== undefined ? String(val) : match;
    });
  } else if (node.bind?.path) {
    const val = resolvePath(data, node.bind.path);
    content = val !== undefined ? String(val) : `[Missing: ${node.bind.path}]`;
  } else {
    content = "";
  }

  return (
    <div
      style={{ ...getStyle(node), ...getInteractionStyle(isSelected) }}
      onClick={onSelect}
    >
      {content}
    </div>
  );
};
NodeRegistry.register({
  type: "text",
  measure: () => 0,
  render: TextComponent,
});

// --- Image Node ---
const ImageComponent: React.FC<{ node: ImageNode } & BaseProps> = ({ node, isSelected, onSelect }) => {
  const { data } = useRendererContext();
  const isBound = !!node.props?.srcBind;
  let src = "";

  if (isBound && node.props?.srcBind) {
    const val = resolvePath(data, node.props.srcBind);
    src = val !== undefined ? String(val) : "";
  } else {
    src = (node.props?.srcLiteral) || "";
  }

  const fit = (node.props?.fit) || "contain";

  const objectFitMap = {
    contain: "contain",
    cover: "cover",
    stretch: "fill"
  } as const;

  return (
    <div
      style={{ ...getStyle(node), overflow: "hidden", ...getInteractionStyle(isSelected) }}
      onClick={onSelect}
    >
      {src ? (
        <img src={src} style={{ width: "100%", height: "100%", objectFit: objectFitMap[fit] }} alt="" />
      ) : (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
          [Image]
        </div>
      )}
    </div>
  );
};
NodeRegistry.register({
  type: "image",
  measure: () => 0,
  render: ImageComponent,
});

// --- Spacer Node ---
const SpacerComponent: React.FC<{ node: SpacerNode } & BaseProps> = ({ node, isSelected, onSelect }) => {
  const sizePx = (node.props?.sizePx) || 16;
  return (
    <div
      style={{ ...getStyle(node), flexBasis: sizePx, flexShrink: 0, flexGrow: 0, ...getInteractionStyle(isSelected) }}
      onClick={onSelect}
    />
  );
};
NodeRegistry.register({
  type: "spacer",
  measure: () => 0,
  render: SpacerComponent,
});
