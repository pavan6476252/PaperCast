import { create } from "zustand";
import { DocumentSchema, AnyNode, PageRegion } from "@papercast/core";
// to-replace
import { TEST_DOCUMENT } from "@papercast/core/test";
// to-replace
import { updateJsonNodeProperty } from "../utils/jsonUpdater";
import {
  deleteNodeFromAst,
  moveNodeInAst,
  insertNodeIntoAst,
  moveNodeToNewParent,
  insertNodeSibling,
  moveNodeToSibling,
} from "@papercast/core";
import { autoDeconstructRichTextAst } from "@papercast/react";

const INITIAL_DOCUMENT: DocumentSchema = {
  version: 1,
  meta: {
    pageSize: "A4",
    orientation: "portrait",
    baseUnit: "px",
    dpi: 96,
  },
  theme: {
    defaults: {
      base: {
        fontFamily: "Inter, sans-serif",
        fontSizePx: 14,
        color: "#000000",
        lineHeight: 1.5,
      },
    },
  },
  data: {
    title: "Hello PaperCast!",
    description: "Start editing the JSON on the left to see live updates.",
  },
  definitions: {
    widgets: {},
  },
  document: {
    headers: {},
    footers: {},
    pageOverrides: {},
    body: {
      id: "root-1",
      type: "root",
      layout: {
        paddingTop: 40,
        paddingRight: 40,
        paddingBottom: 40,
        paddingLeft: 40,
        direction: "column",
        rowGap: 16,
      },
      children: [
        {
          id: "text-1",
          type: "text",
          bind: { path: "title" },
          layout: {
            marginBottom: 8,
          },
          style: {
            fontSizePx: 24,
            fontWeight: "bold",
          },
        },
        {
          id: "text-2",
          type: "text",
          bind: { path: "description" },
          layout: {},
        },
      ],
    },
  },
};

function applyAutoDeconstruct(doc: DocumentSchema): DocumentSchema {
  const newDoc = structuredClone(doc);
  newDoc.document.body = autoDeconstructRichTextAst(newDoc.document.body);

  Object.keys(newDoc.document.headers || {}).forEach((id) => {
    newDoc.document.headers[id].root = autoDeconstructRichTextAst(
      newDoc.document.headers[id].root
    );
  });

  Object.keys(newDoc.document.footers || {}).forEach((id) => {
    newDoc.document.footers[id].root = autoDeconstructRichTextAst(
      newDoc.document.footers[id].root
    );
  });

  return newDoc;
}

const DECONSTRUCTED_INITIAL = applyAutoDeconstruct(
  TEST_DOCUMENT || INITIAL_DOCUMENT
);

const INITIAL_JSON_STRING = JSON.stringify(DECONSTRUCTED_INITIAL, null, 2);

interface DocumentStore {
  // State
  jsonString: string;
  parsedDocument: DocumentSchema | null;
  isValid: boolean;
  parseError: string | null;
  isAutoSync: boolean;
  selectedNodeId: string | null;
  rightPanelMode: "widgets" | "properties";
  lastVisualEdit: { timestamp: number; newString: string } | null;
  zoom: number;
  allowHeaderFooterEditing: boolean;

  // Actions
  setJsonString: (value: string) => void;
  toggleAutoSync: () => void;
  triggerManualSync: () => void;
  setSelectedNodeId: (id: string | null) => void;
  setRightPanelMode: (mode: "widgets" | "properties") => void;
  updateNodeProperty: <
    G extends "layout" | "style" | "props" | "bind" | "config",
    K extends string,
  >(
    nodeId: string,
    propertyGroup: G,
    propertyKey: K,
    newValue: unknown
  ) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setAllowHeaderFooterEditing: (allowed: boolean) => void;

  // Header and Footer Management
  addHeader: (id: string, headerData: PageRegion) => void;
  updateHeaderProperty: <K extends keyof PageRegion>(
    id: string,
    key: K,
    value: PageRegion[K]
  ) => void;
  deleteHeader: (id: string) => void;
  addFooter: (id: string, footerData: PageRegion) => void;
  updateFooterProperty: <K extends keyof PageRegion>(
    id: string,
    key: K,
    value: PageRegion[K]
  ) => void;
  deleteFooter: (id: string) => void;
  updatePageOverrides: (
    overrides: Record<
      string,
      { headerId?: string | null; footerId?: string | null }
    >
  ) => void;

  // Structural Edits
  deleteNode: (id: string) => void;
  moveNode: (id: string, direction: "up" | "down" | "out") => void;
  insertNode: (
    parentId: string,
    index: number | undefined,
    node: AnyNode
  ) => void;
  moveNodeToParent: (id: string, newParentId: string, index?: number) => void;
  insertNodeSibling: (
    targetSiblingId: string,
    position: "before" | "after",
    node: AnyNode
  ) => void;
  moveNodeToSibling: (
    id: string,
    targetSiblingId: string,
    position: "before" | "after"
  ) => void;
  replaceNode: (id: string, newNode: AnyNode) => void;
  deconstructAllRichText: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  jsonString: INITIAL_JSON_STRING,
  parsedDocument: DECONSTRUCTED_INITIAL,
  isValid: true,
  parseError: null,
  isAutoSync: true,
  selectedNodeId: null,
  rightPanelMode: "widgets",
  lastVisualEdit: null,
  zoom: 1,
  allowHeaderFooterEditing: false,

  setSelectedNodeId: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  setRightPanelMode: (mode: "widgets" | "properties") => {
    set({ rightPanelMode: mode });
  },

  setAllowHeaderFooterEditing: (allowed) => {
    set({ allowHeaderFooterEditing: allowed });
  },

  setZoom: (zoom) => {
    if (typeof zoom === "function") {
      set((state) => ({ zoom: zoom(state.zoom) }));
    } else {
      set({ zoom });
    }
  },

  setJsonString: (value: string) => {
    set({ jsonString: value });
    if (get().isAutoSync) {
      get().triggerManualSync();
    }
  },

  toggleAutoSync: () => {
    set((state) => ({ isAutoSync: !state.isAutoSync }));
    // If we just turned auto-sync ON, immediately sync
    if (get().isAutoSync) {
      get().triggerManualSync();
    }
  },

  updateNodeProperty: <
    G extends "layout" | "style" | "props" | "bind" | "config",
    K extends string,
  >(
    nodeId: string,
    propertyGroup: G,
    propertyKey: K,
    newValue: unknown
  ) => {
    const { parsedDocument, jsonString, isAutoSync } = get();
    if (!parsedDocument) return;

    const baseNodeId = nodeId.split("-part")[0];

    import("../utils/jsonUpdater").then(({ findNodePath }) => {
      const nodePath = findNodePath(parsedDocument, baseNodeId);
      if (nodePath) {
        try {
          const updatedJsonString = updateJsonNodeProperty(
            jsonString,
            nodePath,
            propertyGroup,
            propertyKey,
            newValue
          );
          // Set both jsonString and lastVisualEdit so Monaco can intercept if mounted
          set({
            jsonString: updatedJsonString,
            lastVisualEdit: {
              timestamp: Date.now(),
              newString: updatedJsonString,
            },
          });
          if (isAutoSync) {
            get().triggerManualSync();
          }
        } catch (e) {
          console.error("Failed to update node property visually", e);
        }
      } else {
        console.warn(`Node with id ${baseNodeId} not found in parsedDocument.`);
      }
    });
  },

  triggerManualSync: () => {
    try {
      let parsed = JSON.parse(get().jsonString) as DocumentSchema;

      // Destructively apply autoDeconstruct synchronously for any nodes configured for it
      parsed = applyAutoDeconstruct(parsed);

      const newJsonString = JSON.stringify(parsed, null, 2);

      set({
        parsedDocument: parsed,
        jsonString: newJsonString,
        isValid: true,
        parseError: null,
      });
    } catch (e: any) {
      set({
        isValid: false,
        parseError: e.message,
      });
    }
  },

  deleteNode: (id) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split("-part")[0];
    const newAst = deleteNodeFromAst(parsedDocument, baseId);
    setJsonString(JSON.stringify(newAst, null, 2));

    if (get().selectedNodeId?.split("-part")[0] === baseId) {
      get().setSelectedNodeId(null);
    }
  },

  moveNode: (id, direction) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split("-part")[0];
    const newAst = moveNodeInAst(parsedDocument, baseId, direction);
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  insertNode: (parentId, index, node) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseParentId = parentId.split("-part")[0];
    const newAst = insertNodeIntoAst(parsedDocument, baseParentId, node, index);
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  moveNodeToParent: (id, newParentId, index) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split("-part")[0];
    const baseParentId = newParentId.split("-part")[0];
    const newAst = moveNodeToNewParent(
      parsedDocument,
      baseId,
      baseParentId,
      index
    );
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  insertNodeSibling: (targetSiblingId, position, node) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseSiblingId = targetSiblingId.split("-part")[0];
    const newAst = insertNodeSibling(
      parsedDocument,
      baseSiblingId,
      position,
      node
    );
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  moveNodeToSibling: (id, targetSiblingId, position) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split("-part")[0];
    const baseSiblingId = targetSiblingId.split("-part")[0];
    const newAst = moveNodeToSibling(
      parsedDocument,
      baseId,
      baseSiblingId,
      position
    );
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  replaceNode: (id, newNode) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split("-part")[0];
    import("@papercast/core").then(({ replaceNodeInAst }) => {
      const newAst = replaceNodeInAst(parsedDocument, baseId, newNode);
      setJsonString(JSON.stringify(newAst, null, 2));
    });
  },

  deconstructAllRichText: () => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;

    // Create deep copy
    const newDoc: DocumentSchema = structuredClone(parsedDocument);

    newDoc.document.body = autoDeconstructRichTextAst(newDoc.document.body);

    // Also process headers and footers
    Object.keys(newDoc.document.headers || {}).forEach((id) => {
      newDoc.document.headers[id].root = autoDeconstructRichTextAst(
        newDoc.document.headers[id].root
      );
    });

    Object.keys(newDoc.document.footers || {}).forEach((id) => {
      newDoc.document.footers[id].root = autoDeconstructRichTextAst(
        newDoc.document.footers[id].root
      );
    });

    setJsonString(JSON.stringify(newDoc, null, 2));
  },

  addHeader: (id, headerData) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const newDoc = { ...parsedDocument };
    newDoc.document.headers = { ...newDoc.document.headers, [id]: headerData };
    setJsonString(JSON.stringify(newDoc, null, 2));
  },

  updateHeaderProperty: (id, key, value) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument || !parsedDocument.document.headers[id]) return;
    const newDoc = { ...parsedDocument };
    newDoc.document.headers[id] = {
      ...newDoc.document.headers[id],
      [key]: value,
    };
    setJsonString(JSON.stringify(newDoc, null, 2));
  },

  deleteHeader: (id) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument || !parsedDocument.document.headers[id]) return;
    const newDoc = { ...parsedDocument };
    const newHeaders = { ...newDoc.document.headers };
    delete newHeaders[id];
    newDoc.document.headers = newHeaders;

    // Also remove any pageOverrides for this header
    const newOverrides = { ...newDoc.document.pageOverrides };
    Object.keys(newOverrides).forEach((page) => {
      if (newOverrides[page].headerId === id) {
        newOverrides[page] = { ...newOverrides[page], headerId: null };
        if (!newOverrides[page].headerId && !newOverrides[page].footerId) {
          delete newOverrides[page];
        }
      }
    });
    newDoc.document.pageOverrides = newOverrides;

    setJsonString(JSON.stringify(newDoc, null, 2));
  },

  addFooter: (id, footerData) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const newDoc = { ...parsedDocument };
    newDoc.document.footers = { ...newDoc.document.footers, [id]: footerData };
    setJsonString(JSON.stringify(newDoc, null, 2));
  },

  updateFooterProperty: (id, key, value) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument || !parsedDocument.document.footers[id]) return;
    const newDoc = { ...parsedDocument };
    newDoc.document.footers[id] = {
      ...newDoc.document.footers[id],
      [key]: value,
    };
    setJsonString(JSON.stringify(newDoc, null, 2));
  },

  deleteFooter: (id) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument || !parsedDocument.document.footers[id]) return;
    const newDoc = { ...parsedDocument };
    const newFooters = { ...newDoc.document.footers };
    delete newFooters[id];
    newDoc.document.footers = newFooters;

    // Also remove any pageOverrides for this footer
    const newOverrides = { ...newDoc.document.pageOverrides };
    Object.keys(newOverrides).forEach((page) => {
      if (newOverrides[page].footerId === id) {
        newOverrides[page] = { ...newOverrides[page], footerId: null };
        if (!newOverrides[page].headerId && !newOverrides[page].footerId) {
          delete newOverrides[page];
        }
      }
    });
    newDoc.document.pageOverrides = newOverrides;

    setJsonString(JSON.stringify(newDoc, null, 2));
  },

  updatePageOverrides: (overrides) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const newDoc = { ...parsedDocument };
    newDoc.document.pageOverrides = overrides;
    setJsonString(JSON.stringify(newDoc, null, 2));
  },
}));
