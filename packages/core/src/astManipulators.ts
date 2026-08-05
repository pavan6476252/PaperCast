import { DocumentSchema, AnyNode } from "./schema";

export interface ParentInfo {
  parent: AnyNode;
  index: number;
  containerArray?: AnyNode[];
}

// Helper to find a node and its parent info
export function findNodeAndParent(
  node: AnyNode,
  targetId: string,
  parentInfo?: ParentInfo
): { node: AnyNode; parentInfo?: ParentInfo } | null {
  if (!node) return null;

  if (node.id === targetId) {
    return { node, parentInfo };
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const result = findNodeAndParent(child, targetId, {
        parent: node,
        index: i,
        containerArray: node.children,
      });
      if (result) return result;
    }
  }

  if (node.type === "table" && (node as any).props?.footerRows) {
    const footerRows = (node as any).props.footerRows;
    for (let rIdx = 0; rIdx < footerRows.length; rIdx++) {
      const row = footerRows[rIdx];
      if (row.cells) {
        for (let cIdx = 0; cIdx < row.cells.length; cIdx++) {
          const cell = row.cells[cIdx];
          if (cell.content) {
            for (let i = 0; i < cell.content.length; i++) {
              const child = cell.content[i];
              const result = findNodeAndParent(child, targetId, {
                parent: node,
                index: i,
                containerArray: cell.content,
              });
              if (result) return result;
            }
          }
        }
      }
    }
  }

  return null;
}

/**
 * Searches the entire document (body, headers, footers) for a node by its ID.
 *
 * @param doc - The document schema to search within.
 * @param targetId - The unique ID of the node to find.
 * @returns The target node and information about its parent, or null if not found.
 */
export function findNodeGlobal(
  doc: DocumentSchema,
  targetId: string
): { node: AnyNode; parentInfo?: ParentInfo } | null {
  let result = findNodeAndParent(doc.document.body, targetId);
  if (result) return result;

  if (doc.document.headers) {
    for (const key of Object.keys(doc.document.headers)) {
      const root = doc.document.headers[key].root;
      if (root) {
        result = findNodeAndParent(root, targetId);
        if (result) return result;
      }
    }
  }

  if (doc.document.footers) {
    for (const key of Object.keys(doc.document.footers)) {
      const root = doc.document.footers[key].root;
      if (root) {
        result = findNodeAndParent(root, targetId);
        if (result) return result;
      }
    }
  }

  return null;
}

/**
 * Safely deletes a node from the document AST.
 * Returns a new deep-cloned DocumentSchema, preserving immutability.
 *
 * @param doc - The current document schema.
 * @param targetId - The ID of the node to delete.
 * @returns A new immutable DocumentSchema with the node removed.
 */
export function deleteNodeFromAst(
  doc: DocumentSchema,
  targetId: string
): DocumentSchema {
  // Clone doc
  const newDoc: DocumentSchema = structuredClone(doc);

  const result = findNodeGlobal(newDoc, targetId);
  if (!result || !result.parentInfo) return newDoc; // Cannot delete if no parent (e.g. root)

  const { parent, index, containerArray } = result.parentInfo;
  const arr = containerArray || parent.children;
  if (arr) {
    arr.splice(index, 1);
  }

  return newDoc;
}

export function moveNodeInAst(
  doc: DocumentSchema,
  targetId: string,
  direction: "up" | "down" | "out"
): DocumentSchema {
  const newDoc: DocumentSchema = structuredClone(doc);

  const result = findNodeGlobal(newDoc, targetId);
  if (!result || !result.parentInfo) return newDoc;

  const { parent, index, containerArray } = result.parentInfo;
  const arr = containerArray || parent.children;

  if (direction === "up" && index > 0 && arr) {
    const temp = arr[index];
    arr[index] = arr[index - 1];
    arr[index - 1] = temp;
  } else if (direction === "down" && arr && index < arr.length - 1) {
    const temp = arr[index];
    arr[index] = arr[index + 1];
    arr[index + 1] = temp;
  } else if (direction === "out") {
    // Find the grandparent
    const grandparentResult = findNodeGlobal(newDoc, parent.id);
    if (
      grandparentResult &&
      grandparentResult.parentInfo &&
      grandparentResult.parentInfo.parent.children
    ) {
      const gp = grandparentResult.parentInfo.parent;
      const gpArr = grandparentResult.parentInfo.containerArray || gp.children;
      const pIndex = grandparentResult.parentInfo.index;
      // Remove from current parent
      const [nodeToMove] = arr!.splice(index, 1);
      // Insert into grandparent after parent
      gpArr?.splice(pIndex + 1, 0, nodeToMove);
    }
  }

  return newDoc;
}

/**
 * Inserts a new node into the AST as a child of the specified parent.
 * Returns a new deep-cloned DocumentSchema, preserving immutability.
 *
 * @param doc - The current document schema.
 * @param parentId - The ID of the parent node to insert into.
 * @param newNode - The new AST node to insert.
 * @param insertIndex - Optional index to insert the child at. Appends if omitted.
 * @returns A new immutable DocumentSchema.
 */
export function insertNodeIntoAst(
  doc: DocumentSchema,
  parentId: string,
  newNode: AnyNode,
  insertIndex?: number
): DocumentSchema {
  const newDoc: DocumentSchema = structuredClone(doc);

  const result = findNodeGlobal(newDoc, parentId);
  if (!result) return newDoc;

  const { node: parent } = result;

  if (!parent.children) {
    parent.children = [];
  }

  if (insertIndex !== undefined && insertIndex >= 0) {
    parent.children.splice(insertIndex, 0, newNode);
  } else {
    parent.children.push(newNode);
  }

  return newDoc;
}

export function moveNodeToNewParent(
  doc: DocumentSchema,
  targetId: string,
  newParentId: string,
  insertIndex?: number
): DocumentSchema {
  const newDoc: DocumentSchema = structuredClone(doc);

  const nodeResult = findNodeGlobal(newDoc, targetId);
  if (!nodeResult || !nodeResult.parentInfo) return newDoc;

  const {
    parent: oldParent,
    index: oldIndex,
    containerArray: oldContainer,
  } = nodeResult.parentInfo;
  const oldArr = oldContainer || oldParent.children;

  const parentResult = findNodeGlobal(newDoc, newParentId);
  if (!parentResult) return newDoc;
  const { node: newParent } = parentResult;

  // Prevent moving into itself or its own children
  if (targetId === newParentId) return newDoc;

  // Remove from old
  const [nodeToMove] = oldArr!.splice(oldIndex, 1);

  // Add to new
  if (!newParent.children) newParent.children = [];

  if (insertIndex !== undefined && insertIndex >= 0) {
    newParent.children.splice(insertIndex, 0, nodeToMove);
  } else {
    newParent.children.push(nodeToMove);
  }

  return newDoc;
}

export function insertNodeSibling(
  doc: DocumentSchema,
  targetSiblingId: string,
  position: "before" | "after",
  newNode: AnyNode
): DocumentSchema {
  const newDoc: DocumentSchema = structuredClone(doc);

  const result = findNodeGlobal(newDoc, targetSiblingId);
  if (!result || !result.parentInfo) return newDoc;

  const { parent, index, containerArray } = result.parentInfo;
  const arr = containerArray || parent.children;

  if (!arr && !containerArray) parent.children = [];
  const targetArr = containerArray || parent.children!;

  const insertIndex = position === "before" ? index : index + 1;
  targetArr.splice(insertIndex, 0, newNode);

  return newDoc;
}

export function moveNodeToSibling(
  doc: DocumentSchema,
  targetId: string,
  targetSiblingId: string,
  position: "before" | "after"
): DocumentSchema {
  const newDoc: DocumentSchema = structuredClone(doc);

  if (targetId === targetSiblingId) return newDoc;

  const nodeResult = findNodeGlobal(newDoc, targetId);
  if (!nodeResult || !nodeResult.parentInfo) return newDoc;

  const {
    parent: oldParent,
    index: oldIndex,
    containerArray: oldContainer,
  } = nodeResult.parentInfo;
  const oldArr = oldContainer || oldParent.children;
  const [nodeToMove] = oldArr!.splice(oldIndex, 1);

  // Re-find target sibling since tree changed
  const targetResult = findNodeGlobal(newDoc, targetSiblingId);
  if (!targetResult || !targetResult.parentInfo) return newDoc;

  const {
    parent: newParent,
    index: targetIndex,
    containerArray: newContainer,
  } = targetResult.parentInfo;
  const newArr = newContainer || newParent.children;

  if (!newArr && !newContainer) newParent.children = [];
  const targetArr = newContainer || newParent.children!;
  const insertIndex = position === "before" ? targetIndex : targetIndex + 1;

  targetArr.splice(insertIndex, 0, nodeToMove);

  return newDoc;
}

/**
 * Replaces an existing node in the AST with a new node entirely.
 * Returns a new deep-cloned DocumentSchema, preserving immutability.
 *
 * @param doc - The current document schema.
 * @param targetId - The ID of the node to replace.
 * @param newNode - The new replacement AST node.
 * @returns A new immutable DocumentSchema.
 */
export function replaceNodeInAst(
  doc: DocumentSchema,
  targetId: string,
  newNode: AnyNode
): DocumentSchema {
  const newDoc: DocumentSchema = structuredClone(doc);

  if (newDoc.document.body.id === targetId) {
    newDoc.document.body = newNode;
    return newDoc;
  }

  const result = findNodeGlobal(newDoc, targetId);
  if (!result) return newDoc;

  if (result.parentInfo) {
    const { parent, index, containerArray } = result.parentInfo;
    const arr = containerArray || parent.children;
    if (arr) {
      arr[index] = newNode;
    }
  } else {
    if (newDoc.document.headers) {
      for (const key of Object.keys(newDoc.document.headers)) {
        if (newDoc.document.headers[key].root?.id === targetId) {
          newDoc.document.headers[key].root = newNode;
          return newDoc;
        }
      }
    }
    if (newDoc.document.footers) {
      for (const key of Object.keys(newDoc.document.footers)) {
        if (newDoc.document.footers[key].root?.id === targetId) {
          newDoc.document.footers[key].root = newNode;
          return newDoc;
        }
      }
    }
  }

  return newDoc;
}
