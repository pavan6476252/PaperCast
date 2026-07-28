import { BaseNode, RichTextPreferences, TypographyAndColor, BoxModel } from "../types/schema";

/**
 * Utility to parse HTML strings and convert tags to FormCast AST widgets
 */
export function convertHtmlToNodes(htmlString: string, preferences?: RichTextPreferences): BaseNode[] {
  if (typeof window === "undefined") return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString || "", "text/html");
  const body = doc.body;

  const nodes: BaseNode[] = [];
  const tagStyles = preferences?.tagStyles || {};

  const parseInlineStyle = (element: Element): TypographyAndColor & BoxModel => {
    const inlineStyle = (element as HTMLElement).style;
    if (!inlineStyle) return {};
    
    const styleObj: any = {};
    if (inlineStyle.color) styleObj.color = inlineStyle.color;
    if (inlineStyle.backgroundColor) styleObj.backgroundColor = inlineStyle.backgroundColor;
    if (inlineStyle.fontSize) styleObj.fontSizePx = parseInt(inlineStyle.fontSize, 10);
    if (inlineStyle.fontWeight) styleObj.fontWeight = inlineStyle.fontWeight;
    if (inlineStyle.textAlign) styleObj.textAlign = inlineStyle.textAlign;
    if (inlineStyle.fontStyle) styleObj.fontStyle = inlineStyle.fontStyle;
    if (inlineStyle.textDecoration) styleObj.textDecoration = inlineStyle.textDecoration;
    if (inlineStyle.marginTop) styleObj.marginTop = parseInt(inlineStyle.marginTop, 10);
    if (inlineStyle.marginBottom) styleObj.marginBottom = parseInt(inlineStyle.marginBottom, 10);
    if (inlineStyle.paddingTop) styleObj.paddingTop = parseInt(inlineStyle.paddingTop, 10);
    if (inlineStyle.paddingBottom) styleObj.paddingBottom = parseInt(inlineStyle.paddingBottom, 10);
    
    return styleObj;
  };

  const getStyle = (tagName: string, element: Element, defaultStyle?: TypographyAndColor): TypographyAndColor | undefined => {
    return { ...defaultStyle, ...tagStyles[tagName]?.style, ...parseInlineStyle(element) };
  };

  const getLayout = (tagName: string, element: Element, defaultLayout?: BoxModel): BoxModel => {
    return { ...defaultLayout, ...tagStyles[tagName]?.layout, ...parseInlineStyle(element) };
  };

  const walk = (element: Element, indexRef: { val: number }): BaseNode | null => {
    const tagName = element.tagName.toLowerCase();
    indexRef.val++;
    const id = `node-${Date.now()}-${indexRef.val}-${Math.random().toString(36).substr(2, 5)}`;

    if (tagName === "p") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { marginBottom: 8 })
      };
    }

    if (tagName === "code") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, { fontFamily: "monospace", backgroundColor: "#f3f4f6", color: "#1f2937" }),
        layout: getLayout(tagName, element, { paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2, marginBottom: 8 })
      };
    }
    
    if (tagName === "hr") {
      return {
        id,
        type: "spacer",
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { borderTopWidth: 1, borderTopColor: "#e5e7eb", marginBottom: 16, marginTop: 16 })
      };
    }
    
    if (tagName === "cite") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, { fontStyle: "italic", color: "#6b7280" }),
        layout: getLayout(tagName, element, { marginBottom: 8 })
      };
    }
    
    if (tagName === "blockquote") {
      const children: BaseNode[] = [];
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
           layout: getLayout("p", element, { marginBottom: 4 })
         });
      }
      return {
        id,
        type: "column",
        children,
        style: getStyle(tagName, element, { fontStyle: "italic", color: "#374151", backgroundColor: "#f9fafb" }),
        layout: getLayout(tagName, element, { paddingLeft: 12, borderLeftWidth: 4, borderLeftColor: "#9ca3af", marginBottom: 16 })
      };
    }

    if (tagName === "h1") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, { fontSizePx: 24, fontWeight: "bold" }),
        layout: getLayout(tagName, element, { marginTop: 12, marginBottom: 8 })
      };
    }

    if (tagName === "h2") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, { fontSizePx: 20, fontWeight: "bold" }),
        layout: getLayout(tagName, element, { marginTop: 12, marginBottom: 8 })
      };
    }

    if (tagName === "h3") {
      return {
        id,
        type: "text",
        props: { literal: element.textContent || "" },
        style: getStyle(tagName, element, { fontSizePx: 16, fontWeight: "bold" }),
        layout: getLayout(tagName, element, { marginTop: 8, marginBottom: 6 })
      };
    }

    if (tagName === "ul" || tagName === "ol") {
      const children: BaseNode[] = [];
      Array.from(element.children).forEach((li) => {
        if (li.tagName.toLowerCase() === "li") {
          indexRef.val++;
          // For li with block children, we could parse deeply, but simple text mapping is safer for lists
          const isNested = li.children.length > 0;
          let content = isNested ? li.textContent?.replace(/\s+/g, ' ').trim() : li.textContent;
          const prefix = tagName === "ul" ? "• " : "1. "; // For OL we'd need index, simplified for now
          
          children.push({
            id: `node-${Date.now()}-${indexRef.val}-${Math.random().toString(36).substr(2, 5)}`,
            type: "text",
            props: { literal: `${prefix}${content || ""}` },
            style: getStyle("li", li),
            layout: getLayout("li", li, { marginBottom: 4 })
          });
        }
      });
      return {
        id,
        type: "column",
        children,
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { paddingLeft: 16, marginBottom: 12, minHeight: 20 })
      };
    }
    
    if (tagName === "table") {
      const children: BaseNode[] = [];
      const rows = element.querySelectorAll("tr");
      Array.from(rows).forEach((tr) => {
        indexRef.val++;
        const rowChildren: BaseNode[] = [];
        Array.from(tr.children).forEach((td) => {
           const tdTag = td.tagName.toLowerCase();
           if (tdTag === "th" || tdTag === "td") {
              indexRef.val++;
              const isHeader = tdTag === "th" || tr.closest("thead") !== null;
              rowChildren.push({
                 id: `node-${Date.now()}-${indexRef.val}-${Math.random().toString(36).substr(2, 5)}`,
                 type: "text",
                 props: { literal: td.textContent?.trim() || "" },
                 style: getStyle(tdTag, td, isHeader ? { fontWeight: "bold" } : {}),
                 layout: getLayout(tdTag, td, { flex: 1, paddingLeft: 8, paddingRight: 8, paddingTop: 6, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" })
              });
           }
        });
        if (rowChildren.length > 0) {
           children.push({
             id: `node-${Date.now()}-${indexRef.val}-${Math.random().toString(36).substr(2, 5)}`,
             type: "row",
             children: rowChildren,
             layout: { minHeight: 20 }
           });
        }
      });
      return {
        id,
        type: "column",
        children,
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { marginBottom: 16, borderTopWidth: 1, borderTopColor: "#e5e7eb", borderLeftWidth: 1, borderLeftColor: "#e5e7eb", borderRightWidth: 1, borderRightColor: "#e5e7eb" })
      };
    }

    if (tagName === "img") {
      const src = element.getAttribute("src") || "";
      return {
        id,
        type: "image",
        props: { srcLiteral: src },
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { width: "100%", height: 200, marginBottom: 12 })
      };
    }

    // Default container parsing
    if (element.children.length > 0) {
      const children: BaseNode[] = [];
      Array.from(element.children).forEach((child) => {
        const parsedChild = walk(child, indexRef);
        if (parsedChild) children.push(parsedChild);
      });
      return {
        id,
        type: "column",
        children,
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { marginBottom: 8 })
      };
    }

    if (element.textContent?.trim()) {
      return {
        id,
        type: "text",
        props: { literal: element.textContent },
        style: getStyle(tagName, element),
        layout: getLayout(tagName, element, { marginBottom: 8 })
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
      layout: { marginBottom: 8 }
    });
  }

  return nodes;
}

/**
 * Recursively traverses the AST and replaces all `richText` nodes with their parsed widget representations.
 */
export function autoDeconstructRichTextAst(node: BaseNode, preferences?: RichTextPreferences): BaseNode {
  if (node.type === "richText" && node.props?.htmlLiteral) {
    const parsedNodes = convertHtmlToNodes(node.props.htmlLiteral, preferences);
    
    // If it parsed into exactly one node, we can return it directly, keeping the original ID
    if (parsedNodes.length === 1) {
      return { ...parsedNodes[0], id: node.id };
    }
    
    // Otherwise, wrap it in a column to maintain the single-node AST structure
    return {
      id: node.id,
      type: "column",
      children: parsedNodes,
      layout: node.layout || { direction: "column", marginBottom: 8 }
    };
  }

  if (node.children && node.children.length > 0) {
    return {
      ...node,
      children: node.children.map(child => autoDeconstructRichTextAst(child, preferences))
    };
  }

  return node;
}
