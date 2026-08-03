import { parse } from "json-source-map";
import { DocumentSchema, BaseNode } from "@formcast/core";

/**
 * Finds the JSON pointer path to a node by its ID.
 */
export function findNodePath(
  doc: DocumentSchema,
  targetId: string
): string | null {
  // Check body
  const bodyPath = findInNode(doc.document.body, targetId, "/document/body");
  if (bodyPath) return bodyPath;

  // Check headers
  if (doc.document.headers) {
    for (const [key, header] of Object.entries(doc.document.headers)) {
      if (header.root) {
        const path = findInNode(
          header.root,
          targetId,
          `/document/headers/${key}/root`
        );
        if (path) return path;
      }
    }
  }

  // Check footers
  if (doc.document.footers) {
    for (const [key, footer] of Object.entries(doc.document.footers)) {
      if (footer.root) {
        const path = findInNode(
          footer.root,
          targetId,
          `/document/footers/${key}/root`
        );
        if (path) return path;
      }
    }
  }

  // Check definitions
  if (doc.definitions?.widgets) {
    for (const [key, widget] of Object.entries(doc.definitions.widgets)) {
      if (widget.root) {
        const path = findInNode(
          widget.root,
          targetId,
          `/definitions/widgets/${key}/root`
        );
        if (path) return path;
      }
    }
  }

  return null;
}

function findInNode(
  node: BaseNode,
  targetId: string,
  currentPath: string
): string | null {
  if (node.id === targetId) {
    return currentPath;
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childPath = findInNode(
        child,
        targetId,
        `${currentPath}/children/${i}`
      );
      if (childPath) return childPath;
    }
  }
  return null;
}

/**
 * Updates a property in the JSON string while preserving formatting and comments.
 * It uses json-source-map to find the exact byte range to replace.
 */
export function updateJsonNodeProperty(
  jsonString: string,
  nodePointer: string,
  propertyGroup: "layout" | "style" | "props" | "bind",
  propertyKey: string,
  newValue: any
): string {
  const parsed = parse(jsonString);

  // 1. Check if the exact property exists
  const exactPointerStr = `${nodePointer}/${propertyGroup}/${propertyKey}`;
  const exactPointer = parsed.pointers[exactPointerStr];

  if (exactPointer) {
    if (newValue === undefined) {
      // Removing a single property is tricky due to trailing commas.
      // We fall back to replacing the whole group.
    } else {
      const start = exactPointer.value.pos;
      const end = exactPointer.valueEnd.pos;
      return (
        jsonString.slice(0, start) +
        JSON.stringify(newValue) +
        jsonString.slice(end)
      );
    }
  }

  // 2. The exact property doesn't exist, replace/update the entire group
  const groupPointerStr = `${nodePointer}/${propertyGroup}`;
  const groupPointer = parsed.pointers[groupPointerStr];

  if (groupPointer) {
    const start = groupPointer.value.pos;
    const end = groupPointer.valueEnd.pos;
    const groupJson = jsonString.slice(start, end);
    let groupObj: Record<string, any> = {};
    try {
      groupObj = JSON.parse(groupJson);
    } catch (_e) {
      console.warn(
        "Failed to parse group JSON segment. Rebuilding from scratch.",
        _e
      );
    }

    if (newValue === undefined) {
      delete groupObj[propertyKey];
    } else {
      groupObj[propertyKey] = newValue;
    }

    // Attempt to guess indentation
    const indentLevel = groupPointer.value.column;
    const indent = " ".repeat(Math.max(0, indentLevel));

    // Stringify and re-indent
    const newGroupJson = JSON.stringify(groupObj, null, 2).replace(
      /\n/g,
      "\n" + indent
    );
    return jsonString.slice(0, start) + newGroupJson + jsonString.slice(end);
  }

  // 3. The group itself doesn't exist on the node. We must inject it.
  const nodePointerObj = parsed.pointers[nodePointer];
  if (!nodePointerObj) {
    console.warn("Node not found in JSON string", nodePointer);
    return jsonString;
  }

  // nodePointerObj.valueEnd points to the closing `}` of the node.
  const insertPos = nodePointerObj.valueEnd.pos - 1; // index of '}'
  const indentLevel = nodePointerObj.value.column;
  const indent = " ".repeat(Math.max(0, indentLevel + 2)); // 2 spaces for properties

  const newGroupObj = { [propertyKey]: newValue };
  const newGroupJson = JSON.stringify(newGroupObj, null, 2).replace(
    /\n/g,
    "\n" + indent
  );

  const injection = `,\n${indent}"${propertyGroup}": ${newGroupJson}\n${" ".repeat(Math.max(0, indentLevel))}`;
  return (
    jsonString.slice(0, insertPos) + injection + jsonString.slice(insertPos)
  );
}
