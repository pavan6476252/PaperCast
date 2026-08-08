import { DocumentSchema, AnyNode } from "@papercast/core";
import { findNodeGlobal } from "@papercast/core";

const stripHtml = (html: string | undefined): string => {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>?/gm, "")
    .trim();
};

const extractTextualContent = (node: AnyNode): string => {
  if (node.type === "text" && node.props?.literal !== undefined) {
    return stripHtml(node.props.literal);
  }
  if (node.type === "richText" && node.props?.htmlLiteral !== undefined) {
    return stripHtml(node.props.htmlLiteral);
  }
  if (node.type === "image" && node.props?.srcLiteral !== undefined) {
    return String(node.props.srcLiteral).trim();
  }

  // Fallback for custom/other nodes
  return JSON.stringify(("props" in node ? node.props : {}) || {});
};

const traverseAndEnforce = (nodes: AnyNode[], oldDoc: DocumentSchema): void => {
  for (const node of nodes) {
    if (node.config?.lockContent) {
      const oldNodeResult = findNodeGlobal(oldDoc, node.id);
      if (oldNodeResult) {
        const oldNode = oldNodeResult.node;
        const newText = extractTextualContent(node);
        const oldText = extractTextualContent(oldNode);

        if (newText !== oldText) {
          throw new Error(
            `Node [${node.id}] is content-locked. Textual content cannot be modified.`
          );
        }

        // Also check if bind path was illegally changed while locked
        if (node.bind?.path !== oldNode.bind?.path) {
          throw new Error(
            `Node [${node.id}] is content-locked. Data binding cannot be modified.`
          );
        }
      }
    }

    if (node.children && node.children.length > 0) {
      traverseAndEnforce(node.children, oldDoc);
    }

    // Table footer content
    if (node.type === "table" && node.props?.footerRows) {
      const footerRows = node.props.footerRows;
      for (const row of footerRows) {
        if (row.cells) {
          for (const cell of row.cells) {
            if (cell.content) {
              traverseAndEnforce(cell.content, oldDoc);
            }
          }
        }
      }
    }
  }
};

export const enforceContentLocks = (
  oldDoc: DocumentSchema,
  newDoc: DocumentSchema
): void => {
  if (newDoc.document.body) {
    traverseAndEnforce([newDoc.document.body], oldDoc);
  }

  if (newDoc.document.headers) {
    for (const h of Object.values(newDoc.document.headers)) {
      if (h.root) traverseAndEnforce([h.root], oldDoc);
    }
  }

  if (newDoc.document.footers) {
    for (const f of Object.values(newDoc.document.footers)) {
      if (f.root) traverseAndEnforce([f.root], oldDoc);
    }
  }
};
