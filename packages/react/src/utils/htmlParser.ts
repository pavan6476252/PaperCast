import { AnyNode, TypographyAndColor, BoxModel } from "@papercast/core";
import { SchemaRegistry } from "@papercast/engine";

/**
 * Utility to parse HTML strings and convert tags to PaperCast AST widgets.
 * Only supports standard formatting tags that map cleanly to PaperCast equivalents.
 *
 * @param htmlString - Raw HTML content to parse
 * @param preferences - Rich text parsing preferences (e.g., custom tag styles)
 * @returns Array of corresponding PaperCast nodes.
 */
export function convertHtmlToNodes(
  htmlString: string,
  preferences?: {
    tagStyles?: Record<
      string,
      { style?: TypographyAndColor; layout?: BoxModel }
    >;
  }
): AnyNode[] {
  if (typeof window === "undefined") return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString || "", "text/html");
  const body = doc.body;

  const nodes: AnyNode[] = [];
  const tagStyles = preferences?.tagStyles || {};

  const parseInlineStyle = (
    element: Element
  ): TypographyAndColor & BoxModel => {
    const inlineStyle = (element as HTMLElement).style;
    if (!inlineStyle) return {};

    const styleObj: any = {};
    if (inlineStyle.color) styleObj.color = inlineStyle.color;
    if (inlineStyle.backgroundColor)
      styleObj.backgroundColor = inlineStyle.backgroundColor;
    if (inlineStyle.fontSize)
      styleObj.fontSizePx = parseInt(inlineStyle.fontSize, 10);
    if (inlineStyle.fontWeight) styleObj.fontWeight = inlineStyle.fontWeight;
    if (inlineStyle.textAlign) styleObj.textAlign = inlineStyle.textAlign;
    if (inlineStyle.fontStyle) styleObj.fontStyle = inlineStyle.fontStyle;
    if (inlineStyle.textDecoration)
      styleObj.textDecoration = inlineStyle.textDecoration;
    if (inlineStyle.marginTop)
      styleObj.marginTop = parseInt(inlineStyle.marginTop, 10);
    if (inlineStyle.marginBottom)
      styleObj.marginBottom = parseInt(inlineStyle.marginBottom, 10);
    if (inlineStyle.paddingTop)
      styleObj.paddingTop = parseInt(inlineStyle.paddingTop, 10);
    if (inlineStyle.paddingBottom)
      styleObj.paddingBottom = parseInt(inlineStyle.paddingBottom, 10);

    return styleObj;
  };

  const getStyle = (
    tagName: string,
    element: Element,
    defaultStyle?: TypographyAndColor
  ): TypographyAndColor | undefined => {
    return {
      ...defaultStyle,
      ...tagStyles[tagName]?.style,
      ...parseInlineStyle(element),
    };
  };

  const getLayout = (
    tagName: string,
    element: Element,
    defaultLayout?: BoxModel
  ): BoxModel => {
    return {
      ...defaultLayout,
      ...tagStyles[tagName]?.layout,
      ...parseInlineStyle(element),
    };
  };

  const walk = (
    element: Element,
    indexRef: { val: number }
  ): AnyNode | null => {
    const tagName = element.tagName.toLowerCase();
    indexRef.val++;
    const id = `node-${Date.now()}-${indexRef.val}-${Math.random().toString(36).substr(2, 5)}`;

    if (SchemaRegistry.get(tagName)) {
      const children: AnyNode[] = [];
      Array.from(element.children).forEach((child) => {
        const parsedChild = walk(child, indexRef);
        if (parsedChild) children.push(parsedChild);
      });

      let props: any = undefined;
      if (children.length === 0 && element.textContent?.trim()) {
        props = { literal: element.textContent };
      }

      return {
        id,
        type: tagName as any,
        ...(children.length > 0 ? { children } : {}),
        ...(props ? { props } : {}),
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element),
      };
    }

    if (tagName === "p") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { marginBottom: 8 }),
      };
    }

    if (tagName === "code") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, {
          fontFamily: "monospace",
          color: "#1f2937",
        }),
        layout: getLayout(tagName, element, {
          backgroundColor: "#f3f4f6",
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 2,
          paddingBottom: 2,
          marginBottom: 8,
        }),
      };
    }

    if (tagName === "hr") {
      return {
        id,
        type: "spacer",
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, {
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          marginBottom: 16,
          marginTop: 16,
        }),
      };
    }

    if (tagName === "cite") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, {
          fontStyle: "italic",
          color: "#6b7280",
        }),
        layout: getLayout(tagName, element, { marginBottom: 8 }),
      };
    }

    if (tagName === "blockquote") {
      const children: AnyNode[] = [];
      Array.from(element.children).forEach((child) => {
        const parsedChild = walk(child, indexRef);
        if (parsedChild) children.push(parsedChild);
      });
      // Also grab loose text in blockquote
      if (children.length === 0 && element.textContent?.trim()) {
        children.push({
          id: `node-${Date.now()}-${indexRef.val}-txt`,
          type: "text",
          props: { literal: element.textContent.trim() },
          style: getStyle("p", element),
          layout: getLayout("p", element, { marginBottom: 4 }),
        });
      }
      return {
        id,
        type: "column",
        children,
        style: getStyle(tagName, element, {
          fontStyle: "italic",
          color: "#374151",
        }),
        layout: getLayout(tagName, element, {
          backgroundColor: "#f9fafb",
          paddingLeft: 12,
          borderLeftWidth: 4,
          borderLeftColor: "#9ca3af",
          marginBottom: 16,
        }),
      };
    }

    if (tagName === "h1") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, {
          fontSizePx: 24,
          fontWeight: "bold",
        }),
        layout: getLayout(tagName, element, { marginTop: 12, marginBottom: 8 }),
      };
    }

    if (tagName === "h2") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, {
          fontSizePx: 20,
          fontWeight: "bold",
        }),
        layout: getLayout(tagName, element, { marginTop: 12, marginBottom: 8 }),
      };
    }

    if (tagName === "h3") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, {
          fontSizePx: 16,
          fontWeight: "bold",
        }),
        layout: getLayout(tagName, element, { marginTop: 8, marginBottom: 6 }),
      };
    }

    if (tagName === "ul" || tagName === "ol") {
      const children: AnyNode[] = [];
      Array.from(element.children).forEach((li) => {
        if (li.tagName.toLowerCase() === "li") {
          indexRef.val++;
          // For li with block children, we could parse deeply, but simple text mapping is safer for lists
          const isNested = li.children.length > 0;
          const content = isNested
            ? li.textContent?.replace(/\s+/g, " ").trim()
            : li.textContent;
          const prefix = tagName === "ul" ? "• " : "1. "; // For OL we'd need index, simplified for now

          children.push({
            id: `node-${Date.now()}-${indexRef.val}-${Math.random().toString(36).substr(2, 5)}`,
            type: "text",
            props: { literal: `${prefix}${content || ""}` },
            style: getStyle("li", li),
            layout: getLayout("li", li, { marginBottom: 4 }),
          });
        }
      });
      return {
        id,
        type: "column",
        children,
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, {
          paddingLeft: 16,
          marginBottom: 12,
          minHeight: 20,
        }),
      };
    }

    if (tagName === "table") {
      const columns: any[] = [];
      const data: any[] = [];

      const rows = element.querySelectorAll("tr");

      // Determine max columns to ensure grid alignment
      let maxCols = 0;
      Array.from(rows).forEach((tr) => {
        if (tr.children.length > maxCols) maxCols = tr.children.length;
      });

      // Initialize columns
      for (let i = 0; i < maxCols; i++) {
        columns.push({
          bindPath: `col${i}`,
          headerText: `Column ${i + 1}`,
          align: "left",
          flex: 1,
        });
      }

      Array.from(rows).forEach((tr, rowIdx) => {
        indexRef.val++;
        const isHeaderRow =
          tr.closest("thead") !== null ||
          (rowIdx === 0 && tr.querySelector("th") !== null);

        if (isHeaderRow) {
          // Update headers
          Array.from(tr.children).forEach((td, colIdx) => {
            if (colIdx < columns.length) {
              columns[colIdx].headerText =
                td.textContent?.trim() || columns[colIdx].headerText;

              const align =
                (td as HTMLElement).style.textAlign || td.getAttribute("align");
              if (align === "center" || align === "right") {
                columns[colIdx].align = align;
              }
            }
          });
        } else {
          // Add data row
          const rowData: Record<string, string> = {};
          Array.from(tr.children).forEach((td, colIdx) => {
            if (colIdx < columns.length) {
              rowData[`col${colIdx}`] = td.textContent?.trim() || "";
            }
          });
          data.push(rowData);
        }
      });

      return {
        id,
        type: "table",
        props: {
          columns,
          data,
          tableSplitBehaviour: "withHeader",
        },
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, {
          marginBottom: 16,
        }),
      };
    }

    if (tagName === "img") {
      const src = element.getAttribute("src") || "";
      return {
        id,
        type: "image",
        props: { srcLiteral: src },
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, {
          width: "100%",
          height: 200,
          marginBottom: 12,
        }),
      };
    }

    // Default container parsing
    if (element.children.length > 0) {
      const children: AnyNode[] = [];
      Array.from(element.children).forEach((child) => {
        const parsedChild = walk(child, indexRef);
        if (parsedChild) children.push(parsedChild);
      });
      return {
        id,
        type: "column",
        children,
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { marginBottom: 8 }),
      };
    }

    if (element.textContent?.trim()) {
      return {
        id,
        type: "text",
        props: { literal: element.textContent },
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { marginBottom: 8 }),
      };
    }

    return null;
  };

  const indexRef = { val: 0 };
  Array.from(body.children).forEach((child) => {
    const parsed = walk(child, indexRef);
    if (parsed) nodes.push(parsed);
  });

  // Fallback if no children parsed but plain text exists
  if (nodes.length === 0 && body.textContent?.trim()) {
    nodes.push({
      id: `node-${Date.now()}`,
      type: "text",
      props: { literal: body.textContent },
      layout: { marginBottom: 8 },
    });
  }

  return nodes;
}

/**
 * Recursively traverses the AST and replaces all `richText` nodes configured for
 * auto-deconstruction with their discrete, parsed widget representations.
 * This is crucial for enabling native pagination inside of long text blocks.
 *
 * @param node - The starting node (usually the document body)
 * @param preferences - Global rich text preferences containing tag styles
 * @returns A new AST with rich text nodes deconstructed into primitives.
 */
export function autoDeconstructRichTextAst(node: AnyNode): AnyNode {
  // Use node-level config
  const shouldDeconstruct = node.config?.autoDeconstruct;

  if (shouldDeconstruct) {
    let htmlToParse: string | undefined;

    if (node.type === "richText") {
      htmlToParse = node.props?.htmlLiteral;
    } else if (node.type === "text") {
      htmlToParse = node.props?.literal;
    }

    if (htmlToParse) {
      // Pass node.config.tagStyles
      const tagStyles = node.config?.tagStyles;
      const parsedNodes = convertHtmlToNodes(htmlToParse, { tagStyles });

      // If it parsed into exactly one node, we can return it directly, keeping the original ID
      if (parsedNodes.length === 1) {
        return {
          ...parsedNodes[0],
          id: node.id,
          layout: { ...parsedNodes[0].layout, ...node.layout },
          style: { ...parsedNodes[0].style, ...node.style },
        };
      }

      // Otherwise, wrap it in a column to maintain the single-node AST structure
      return {
        id: node.id,
        type: "column",
        children: parsedNodes,
        layout: node.layout || { direction: "column", marginBottom: 8 },
      };
    }
  }

  if (node.children && node.children.length > 0) {
    return {
      ...node,
      children: node.children.map((child) => autoDeconstructRichTextAst(child)),
    };
  }

  return node;
}
