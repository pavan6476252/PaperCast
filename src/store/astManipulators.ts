import { DocumentSchema, BaseNode } from "../types/schema";

type ParentInfo = {
  parent: BaseNode;
  index: number;
};

// Helper to find a node and its parent info
export function findNodeAndParent(
  node: BaseNode,
  targetId: string,
  parentInfo?: ParentInfo
): { node: BaseNode; parentInfo?: ParentInfo } | null {
  if (node.id === targetId) {
    return { node, parentInfo };
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const result = findNodeAndParent(child, targetId, {
        parent: node,
        index: i,
      });
      if (result) return result;
    }
  }

  return null;
}

// Search across the entire document
export function findNodeGlobal(
  doc: DocumentSchema,
  targetId: string
): { node: BaseNode; parentInfo?: ParentInfo } | null {
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

export function deleteNodeFromAst(
  doc: DocumentSchema,
  targetId: string
): DocumentSchema {
  // Clone doc
  const newDoc: DocumentSchema = JSON.parse(JSON.stringify(doc));

  const result = findNodeGlobal(newDoc, targetId);
  if (!result || !result.parentInfo) return newDoc; // Cannot delete if no parent (e.g. root)

  const { parent, index } = result.parentInfo;
  if (parent.children) {
    parent.children.splice(index, 1);
  }

  return newDoc;
}

export function moveNodeInAst(
  doc: DocumentSchema,
  targetId: string,
  direction: "up" | "down" | "out"
): DocumentSchema {
  const newDoc: DocumentSchema = JSON.parse(JSON.stringify(doc));

  const result = findNodeGlobal(newDoc, targetId);
  if (!result || !result.parentInfo) return newDoc;

  const { parent, index } = result.parentInfo;

  if (direction === "up" && index > 0 && parent.children) {
    const temp = parent.children[index];
    parent.children[index] = parent.children[index - 1];
    parent.children[index - 1] = temp;
  } else if (
    direction === "down" &&
    parent.children &&
    index < parent.children.length - 1
  ) {
    const temp = parent.children[index];
    parent.children[index] = parent.children[index + 1];
    parent.children[index + 1] = temp;
  } else if (direction === "out") {
    // Find the grandparent
    const grandparentResult = findNodeGlobal(newDoc, parent.id);
    if (
      grandparentResult &&
      grandparentResult.parentInfo &&
      grandparentResult.parentInfo.parent.children
    ) {
      const gp = grandparentResult.parentInfo.parent;
      const pIndex = grandparentResult.parentInfo.index;
      // Remove from current parent
      const [nodeToMove] = parent.children!.splice(index, 1);
      // Insert into grandparent after parent
      gp.children?.splice(pIndex + 1, 0, nodeToMove);
    }
  }

  return newDoc;
}

export function insertNodeIntoAst(
  doc: DocumentSchema,
  parentId: string,
  newNode: BaseNode,
  insertIndex?: number
): DocumentSchema {
  const newDoc: DocumentSchema = JSON.parse(JSON.stringify(doc));

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
  const newDoc: DocumentSchema = JSON.parse(JSON.stringify(doc));

  const nodeResult = findNodeGlobal(newDoc, targetId);
  if (!nodeResult || !nodeResult.parentInfo) return newDoc;

  const { parent: oldParent, index: oldIndex } = nodeResult.parentInfo;

  const parentResult = findNodeGlobal(newDoc, newParentId);
  if (!parentResult) return newDoc;
  const { node: newParent } = parentResult;

  // Prevent moving into itself or its own children
  if (targetId === newParentId) return newDoc;

  // Remove from old
  const [nodeToMove] = oldParent.children!.splice(oldIndex, 1);

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
  newNode: BaseNode
): DocumentSchema {
  const newDoc: DocumentSchema = JSON.parse(JSON.stringify(doc));

  const result = findNodeGlobal(newDoc, targetSiblingId);
  if (!result || !result.parentInfo) return newDoc;

  const { parent, index } = result.parentInfo;

  if (!parent.children) parent.children = [];

  const insertIndex = position === "before" ? index : index + 1;
  parent.children.splice(insertIndex, 0, newNode);

  return newDoc;
}

export function moveNodeToSibling(
  doc: DocumentSchema,
  targetId: string,
  targetSiblingId: string,
  position: "before" | "after"
): DocumentSchema {
  const newDoc: DocumentSchema = JSON.parse(JSON.stringify(doc));

  if (targetId === targetSiblingId) return newDoc;

  const nodeResult = findNodeGlobal(newDoc, targetId);
  if (!nodeResult || !nodeResult.parentInfo) return newDoc;

  const { parent: oldParent, index: oldIndex } = nodeResult.parentInfo;
  const [nodeToMove] = oldParent.children!.splice(oldIndex, 1);

  // Re-find target sibling since tree changed
  const targetResult = findNodeGlobal(newDoc, targetSiblingId);
  if (!targetResult || !targetResult.parentInfo) return newDoc;

  const { parent: newParent, index: targetIndex } = targetResult.parentInfo;

  if (!newParent.children) newParent.children = [];
  const insertIndex = position === "before" ? targetIndex : targetIndex + 1;

  newParent.children.splice(insertIndex, 0, nodeToMove);

  return newDoc;
}

export function replaceNodeInAst(
  doc: DocumentSchema,
  targetId: string,
  newNode: BaseNode
): DocumentSchema {
  const newDoc: DocumentSchema = JSON.parse(JSON.stringify(doc));

  if (newDoc.document.body.id === targetId) {
    newDoc.document.body = newNode;
    return newDoc;
  }

  const result = findNodeGlobal(newDoc, targetId);
  if (!result) return newDoc;

  if (result.parentInfo) {
    const { parent, index } = result.parentInfo;
    if (parent.children) {
      parent.children[index] = newNode;
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
