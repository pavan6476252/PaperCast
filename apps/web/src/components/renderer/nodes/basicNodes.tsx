import React from "react";
import {
  BaseNode,
  RootNode,
  RowNode,
  ColumnNode,
  TextNode,
  ImageNode,
  SpacerNode,
  ListTileNode,
  RichTextNode,
} from "@formcast/core";
import { getStyle } from "../utils/styleUtils";
import { NodeRenderer } from "../NodeRenderer";
import { NodeRegistry } from "../../../registry/NodeRegistry";
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
const RootComponent: React.FC<{ node: RootNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      style={{
        ...getStyle(node),
        position: "relative",
        ...getInteractionStyle(isSelected),
      }}
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
const RowComponent: React.FC<{ node: RowNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      style={{
        ...getStyle(node),
        flexDirection: "row",
        ...getInteractionStyle(isSelected),
      }}
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
const ColumnComponent: React.FC<{ node: ColumnNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      style={{
        ...getStyle(node),
        flexDirection: "column",
        ...getInteractionStyle(isSelected),
      }}
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
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// --- Text Node ---
const TextComponent: React.FC<{ node: TextNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const { data, pageContext } = useRendererContext();
  let content = "";
  const isAnchor = node.props?.isAnchor;
  let href = "";

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
    if (val === undefined) {
      content = `[Missing Data: ${node.bind.path}]`;
    } else if (typeof val === "object" && val !== null) {
      content = `[Invalid Data: Expected primitive for ${node.bind.path}]`;
    } else {
      content = String(val);
    }
  } else {
    content = "";
  }

  if (isAnchor) {
    if (node.props?.hrefBind) {
      const val = resolvePath(data, node.props.hrefBind);
      href = val !== undefined ? String(val) : "";
    } else if (node.props?.hrefLiteral) {
      href = node.props.hrefLiteral;
    }
  }

  const style = { ...getStyle(node), ...getInteractionStyle(isSelected) };

  if (isAnchor) {
    return (
      <a
        href={href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...style,
          textDecoration: style.textDecoration || "underline",
          color: style.color || "blue",
          cursor: "pointer",
        }}
        onClick={(e) => {
          if (onSelect) {
            e.preventDefault(); // Prevent navigation when editing
            onSelect(e);
          }
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <div style={style} onClick={onSelect}>
      {content}
    </div>
  );
};
const splitTextNode = (
  node: BaseNode,
  remainingHeight: number,
  ctx: any
): [BaseNode, BaseNode | null, number] | null => {
  const originalId = node.id.split("-part")[0];
  const totalHeight =
    ctx.measurements.blocks[originalId] ||
    ctx.measurements.blocks[node.id] ||
    0;

  if (
    totalHeight <= remainingHeight ||
    totalHeight === 0 ||
    remainingHeight <= 15
  )
    return null;

  let text = (node.props as any)?.literal || "";
  if (node.bind?.path) {
    const val = resolvePath(ctx.data, node.bind.path);
    if (val !== undefined && typeof val !== "object") {
      text = String(val);
    }
  }

  if (!text) return null;

  // We assume the text fits proportionally, subtract safety buffer
  const ratio = (remainingHeight - 12) / totalHeight;
  if (ratio <= 0) return null;

  let splitCharIndex = Math.floor(text.length * ratio);

  // Backtrack to the nearest space
  while (
    splitCharIndex > 0 &&
    text[splitCharIndex] !== " " &&
    text[splitCharIndex] !== "\n"
  ) {
    splitCharIndex--;
  }

  // If no space was found, split exactly at the ratio
  if (splitCharIndex === 0) {
    splitCharIndex = Math.floor(text.length * ratio);
  }

  if (splitCharIndex === 0) return null;

  const chunk1Text = text.substring(0, splitCharIndex);
  const chunk2Text = text.substring(splitCharIndex).trimStart();

  if (!chunk1Text) return null;

  const partNumber = (parseInt(node.id.split("-part")[1]) || 1) + 1;

  const chunk1 = {
    ...node,
    id: `${originalId}-part${partNumber - 1}`,
    props: { ...node.props, literal: chunk1Text },
    layout: { ...node.layout, marginBottom: 0, paddingBottom: 0 },
  };
  delete chunk1.bind;

  const chunk2 = {
    ...node,
    id: `${originalId}-part${partNumber}`,
    props: { ...node.props, literal: chunk2Text },
    layout: { ...node.layout, marginTop: 0, paddingTop: 0 },
  };
  delete chunk2.bind;

  return [chunk1, chunk2, remainingHeight];
};

NodeRegistry.register({
  type: "text",
  measure: () => 0,
  render: TextComponent as any,
  split: splitTextNode,
});

// --- Image Node ---
const ImageComponent: React.FC<{ node: ImageNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const { data } = useRendererContext();
  const isBound = !!node.props?.srcBind;
  let src = "";
  let missingError = "";

  if (isBound && node.props?.srcBind) {
    const val = resolvePath(data, node.props.srcBind);
    if (val === undefined) {
      missingError = `[Missing Data: ${node.props.srcBind}]`;
      src = "";
    } else {
      src = String(val);
    }
  } else {
    src = node.props?.srcLiteral || "";
  }

  const fit = node.props?.fit || "contain";

  const objectFitMap = {
    contain: "contain",
    cover: "cover",
    stretch: "fill",
  } as const;

  return (
    <div
      style={{
        ...getStyle(node),
        overflow: "hidden",
        ...getInteractionStyle(isSelected),
      }}
      onClick={onSelect}
    >
      {src ? (
        <img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: objectFitMap[fit],
          }}
          alt=""
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: missingError ? "#fef2f2" : "#eee",
            color: missingError ? "#dc2626" : "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: missingError ? "1px dashed #f87171" : "none",
            fontSize: "0.85em",
            textAlign: "center",
            padding: "4px",
          }}
        >
          {missingError || "[Image]"}
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
const SpacerComponent: React.FC<{ node: SpacerNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const sizePx = node.props?.sizePx || 16;
  return (
    <div
      style={{
        ...getStyle(node),
        flexBasis: sizePx,
        flexShrink: 0,
        flexGrow: 0,
        ...getInteractionStyle(isSelected),
      }}
      onClick={onSelect}
    />
  );
};
NodeRegistry.register({
  type: "spacer",
  measure: () => 0,
  render: SpacerComponent,
});

// --- ListTile Node ---
const ListTileComponent: React.FC<{ node: ListTileNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const { data } = useRendererContext();

  let title = node.props?.titleLiteral || "";
  let titleError = "";
  if (node.props?.titleBind) {
    const val = resolvePath(data, node.props.titleBind);
    if (val === undefined) {
      titleError = `[Missing Data: ${node.props.titleBind}]`;
      title = "";
    } else {
      title = String(val);
    }
  }

  let subtitle = node.props?.subtitleLiteral || "";
  let subtitleError = "";
  if (node.props?.subtitleBind) {
    const val = resolvePath(data, node.props.subtitleBind);
    if (val === undefined) {
      subtitleError = `[Missing Data: ${node.props.subtitleBind}]`;
      subtitle = "";
    } else {
      subtitle = String(val);
    }
  }

  return (
    <div
      style={{
        ...getStyle(node),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...getInteractionStyle(isSelected),
      }}
      onClick={onSelect}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1em",
          marginBottom: subtitle || subtitleError ? "4px" : "0",
        }}
      >
        {titleError ? (
          <span style={{ color: "#dc2626" }}>{titleError}</span>
        ) : (
          title || "[Title]"
        )}
      </div>
      {(subtitle || subtitleError) && (
        <div
          style={{
            fontSize: "0.85em",
            color: subtitleError ? "#dc2626" : "#666",
          }}
        >
          {subtitleError || subtitle}
        </div>
      )}
    </div>
  );
};
NodeRegistry.register({
  type: "listTile",
  measure: () => 0,
  render: ListTileComponent,
});

// --- RichText Node ---
const RichTextComponent: React.FC<{ node: RichTextNode } & BaseProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const { data } = useRendererContext();

  let htmlContent = node.props?.htmlLiteral || "";
  let richTextError = "";
  if (node.props?.htmlBind) {
    const val = resolvePath(data, node.props.htmlBind);
    if (val === undefined) {
      richTextError = `[Missing Data: ${node.props.htmlBind}]`;
      htmlContent = "";
    } else {
      htmlContent = String(val);
    }
  }

  if (richTextError) {
    return (
      <div
        style={{
          ...getStyle(node),
          color: "#dc2626",
          border: "1px dashed #f87171",
          backgroundColor: "#fef2f2",
          padding: "8px",
          fontSize: "0.9em",
          ...getInteractionStyle(isSelected),
        }}
        onClick={onSelect}
      >
        {richTextError}
      </div>
    );
  }

  return (
    <div
      style={{ ...getStyle(node), ...getInteractionStyle(isSelected) }}
      onClick={onSelect}
      dangerouslySetInnerHTML={{ __html: htmlContent || "<p>[Rich Text]</p>" }}
    />
  );
};
NodeRegistry.register({
  type: "richText",
  measure: () => 0,
  render: RichTextComponent,
});
