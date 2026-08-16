import React from "react";
import {
  AnyNode,
  RootNode,
  RowNode,
  ColumnNode,
  TextNode,
  ImageNode,
  SpacerNode,
  ListTileNode,
  RichTextNode,
} from "@papercast/core";
import { NodeRenderer } from "../NodeRenderer";
import { ComponentTypeDefinition } from "../registry";
import { splitHtmlText } from "../utils/htmlSplitter";
import { ContainerBehavior } from "@papercast/engine";
import { useNodeData } from "../headless/useNodeData";
import { useNodeStyle } from "../headless/useNodeStyle";
import { IconNode as IconNodeComponent } from "./IconNode";

const renderChildren = (node: AnyNode) => {
  return node.children?.map((child, index) => (
    <NodeRenderer key={child.id || index} node={child} />
  ));
};

const isEmptyWidget = (node: AnyNode) => {
  if (node.children && node.children.length > 0) return false;
  if (
    node.layout?.height ||
    node.layout?.minHeight ||
    node.layout?.backgroundColor ||
    node.layout?.borderWidth ||
    node.layout?.borderTopWidth ||
    node.layout?.borderBottomWidth ||
    node.layout?.borderLeftWidth ||
    node.layout?.borderRightWidth
  ) {
    return false;
  }
  return true;
};

interface BaseProps {
  injectedProps?: React.HTMLAttributes<HTMLDivElement> & {
    "data-selected"?: boolean;
  };
  pageContext?: { pageNumber: number; pageCount: number };
}

// --- Root Node ---
const RootComponent: React.FC<{ node: RootNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const style = useNodeStyle(node, injectedProps);
  return (
    <div {...injectedProps} style={{ ...style, position: "relative" }}>
      {renderChildren(node)}
    </div>
  );
};

// --- Row Node ---
const RowComponent: React.FC<{ node: RowNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const style = useNodeStyle(node, injectedProps);
  return (
    <div
      {...injectedProps}
      className={`${injectedProps?.className || ""} ${isEmptyWidget(node) ? "empty-widget" : ""}`}
      style={{ ...style, flexDirection: "row" }}
    >
      {renderChildren(node)}
    </div>
  );
};

// --- Column Node ---
const ColumnComponent: React.FC<{ node: ColumnNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const style = useNodeStyle(node, injectedProps);
  return (
    <div
      {...injectedProps}
      className={`${injectedProps?.className || ""} ${isEmptyWidget(node) ? "empty-widget" : ""}`}
      style={{ ...style, flexDirection: "column" }}
    >
      {renderChildren(node)}
    </div>
  );
};

// --- Text Node ---
const TextComponent: React.FC<{ node: TextNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const { pageContext, resolve } = useNodeData();
  const style = useNodeStyle(node, injectedProps);

  let content = "";
  const isAnchor = node.props?.isAnchor;
  let href = "";

  if (node.props?.literal) {
    content = node.props.literal;
    content = content.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, path) => {
      const trimmed = path.trim();
      if (trimmed === "pageNumber")
        return pageContext ? String(pageContext.pageNumber) : "";
      if (trimmed === "pageCount")
        return pageContext ? String(pageContext.pageCount) : "";
      const val = resolve(trimmed);
      return val !== undefined ? String(val) : match;
    });
  } else if (node.bind?.path) {
    const val = resolve(node.bind.path);
    if (val === undefined) {
      content = `[Missing Data: ${node.bind.path}]`;
    } else if (typeof val === "object" && val !== null) {
      content = `[Invalid Data: Expected primitive for ${node.bind.path}]`;
    } else {
      content = String(val);
    }
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isAnchor) {
    if (node.props?.hrefBind) {
      const val = resolve(node.props.hrefBind);
      href = val !== undefined ? String(val) : "";
    } else if (node.props?.hrefLiteral) {
      href = node.props.hrefLiteral;
    }
    return (
      <a
        {...(injectedProps as any)}
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
          if (injectedProps?.onClick) {
            e.preventDefault();
            injectedProps.onClick(e as any);
          }
        }}
        dangerouslySetInnerHTML={isHtml ? { __html: content } : undefined}
      >
        {!isHtml && content}
      </a>
    );
  }

  if (isHtml) {
    return (
      <div
        {...injectedProps}
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div {...injectedProps} style={style}>
      {content}
    </div>
  );
};

const splitTextNode = (
  node: TextNode,
  remainingHeight: number,
  ctx: any
): [TextNode, TextNode | null, number] | null => {
  // Original split implementation preserved
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

  let text = node.props?.literal || "";
  // In the split function, we don't have access to the hook, so we use ctx.data manually.
  // The engine passes ctx in for exactly this reason.
  if (node.props?.literal) {
    text = text.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, path) => {
      const trimmed = path.trim();
      if (trimmed === "pageNumber" || trimmed === "pageCount") return match;
      const parts = trimmed.split(".");
      let val: any = ctx.data;
      for (const p of parts) {
        if (val) val = val[p];
      }
      return val !== undefined ? String(val) : match;
    });
  } else if (node.bind?.path) {
    // Basic resolution for split phase
    const parts = node.bind.path.split(".");
    let val: any = ctx.data;
    for (const p of parts) {
      if (val) val = val[p];
    }
    if (val !== undefined && typeof val !== "object") {
      text = String(val);
    }
  }

  if (!text) return null;
  const ratio = (remainingHeight - 12) / totalHeight;
  if (ratio <= 0) return null;

  let chunk1Text = "";
  let chunk2Text = "";

  const isHtml = /<[a-z][\s\S]*>/i.test(text);
  if (isHtml) {
    const splitResult = splitHtmlText(text, ratio);
    if (!splitResult) return null;
    [chunk1Text, chunk2Text] = splitResult;
  } else {
    let splitCharIndex = Math.floor(text.length * ratio);
    while (
      splitCharIndex > 0 &&
      text[splitCharIndex] !== " " &&
      text[splitCharIndex] !== "\n"
    ) {
      splitCharIndex--;
    }
    if (splitCharIndex === 0) splitCharIndex = Math.floor(text.length * ratio);
    if (splitCharIndex === 0) return null;

    chunk1Text = text.substring(0, splitCharIndex);
    chunk2Text = text.substring(splitCharIndex).trimStart();
  }

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

  return [chunk1 as TextNode, chunk2 as TextNode, remainingHeight];
};

// --- Image Node ---
const ImageComponent: React.FC<{ node: ImageNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const { resolve } = useNodeData();
  const style = useNodeStyle(node, injectedProps);

  const isBound = !!node.props?.srcBind;
  let src = "";
  let missingError = "";

  if (isBound && node.props?.srcBind) {
    const val = resolve(node.props.srcBind);
    if (val === undefined) {
      missingError = `[Missing Data: ${node.props.srcBind}]`;
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
    <div {...injectedProps} style={{ ...style, overflow: "hidden" }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
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

// --- Spacer Node ---
const SpacerComponent: React.FC<{ node: SpacerNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const style = useNodeStyle(node, injectedProps);
  const sizePx = node.props?.sizePx || 16;
  return (
    <div
      {...injectedProps}
      style={{ ...style, flexBasis: sizePx, flexShrink: 0, flexGrow: 0 }}
    />
  );
};

// --- ListTile Node ---
const ListTileComponent: React.FC<{ node: ListTileNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const { resolve } = useNodeData();
  const style = useNodeStyle(node, injectedProps);

  let title = node.props?.titleLiteral || "";
  let titleError = "";
  if (node.props?.titleBind) {
    const val = resolve(node.props.titleBind);
    if (val === undefined)
      titleError = `[Missing Data: ${node.props.titleBind}]`;
    else title = String(val);
  }

  let subtitle = node.props?.subtitleLiteral || "";
  let subtitleError = "";
  if (node.props?.subtitleBind) {
    const val = resolve(node.props.subtitleBind);
    if (val === undefined)
      subtitleError = `[Missing Data: ${node.props.subtitleBind}]`;
    else subtitle = String(val);
  }

  return (
    <div
      {...injectedProps}
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
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

// --- RichText Node ---
const RichTextComponent: React.FC<{ node: RichTextNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const { resolve } = useNodeData();
  const style = useNodeStyle(node, injectedProps);

  let htmlContent = node.props?.htmlLiteral || "";
  let richTextError = "";
  if (node.props?.htmlBind) {
    const val = resolve(node.props.htmlBind);
    if (val === undefined)
      richTextError = `[Missing Data: ${node.props.htmlBind}]`;
    else htmlContent = String(val);
  }

  if (richTextError) {
    return (
      <div
        {...injectedProps}
        style={{
          color: "#dc2626",
          border: "1px dashed #f87171",
          backgroundColor: "#fef2f2",
          ...style,
        }}
      >
        {richTextError}
      </div>
    );
  }

  return (
    <div
      {...injectedProps}
      style={style}
      dangerouslySetInnerHTML={{ __html: htmlContent || "<p>[Rich Text]</p>" }}
    />
  );
};

// Export the array instead of registering as a side effect
export const basicNodes: ComponentTypeDefinition<any>[] = [
  {
    type: "root",
    measure: ContainerBehavior.measure,
    split: ContainerBehavior.split,
    render: RootComponent,
    createDefaultNode: (id) => ({ id, type: "root", layout: {} }),
  },
  {
    type: "row",
    measure: ContainerBehavior.measure,
    split: ContainerBehavior.split,
    render: RowComponent,
    createDefaultNode: (id) => ({ id, type: "row", layout: {} }),
  },
  {
    type: "column",
    measure: ContainerBehavior.measure,
    split: ContainerBehavior.split,
    render: ColumnComponent,
    createDefaultNode: (id) => ({
      id,
      type: "column",
      layout: {},
    }),
  },
  {
    type: "text",
    measure: () => 0,
    split: splitTextNode as any,
    render: TextComponent as any,
    createDefaultNode: (id) => ({
      id,
      type: "text",
      layout: {},
      props: { literal: "New Text" },
    }),
  },
  {
    type: "image",
    measure: () => 0,
    render: ImageComponent,
    createDefaultNode: (id) => ({ id, type: "image", layout: {} }),
  },
  {
    type: "spacer",
    measure: () => 0,
    render: SpacerComponent,
    createDefaultNode: (id) => ({
      id,
      type: "spacer",
      layout: {},
      props: { sizePx: 16 },
    }),
  },
  {
    type: "icon",
    measure: () => 0,
    render: IconNodeComponent,
    createDefaultNode: (id) => ({
      id,
      type: "icon",
      layout: {},
      props: { iconName: "HelpCircle", sizePx: 24, color: "currentColor" },
    }),
  },
  {
    type: "listTile",
    measure: () => 0,
    render: ListTileComponent,
    createDefaultNode: (id) => ({
      id,
      type: "listTile",
      layout: {},
      props: { titleLiteral: "Title", subtitleLiteral: "Subtitle" },
    }),
  },
  {
    type: "richText",
    measure: () => 0,
    render: RichTextComponent,
    createDefaultNode: (id) => ({
      id,
      type: "richText",
      layout: {},
      props: { htmlLiteral: "<p>New Rich Text</p>" },
    }),
  },
];
