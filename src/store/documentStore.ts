import { create } from "zustand";
import { DocumentSchema, BaseNode } from "../types/schema";
import { TEST_DOCUMENT } from "./test.data";
import { updateJsonNodeProperty } from "../utils/jsonUpdater";
import { deleteNodeFromAst, moveNodeInAst, insertNodeIntoAst, moveNodeToNewParent, insertNodeSibling, moveNodeToSibling } from "./astManipulators";
import { autoDeconstructRichTextAst } from "../utils/htmlParser";

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
    title: "Hello FormCast!",
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

const INITIAL_JSON_STRING = JSON.stringify(TEST_DOCUMENT || INITIAL_DOCUMENT, null, 2);

interface DocumentStore {
  // State
  jsonString: string;
  parsedDocument: DocumentSchema | null;
  isValid: boolean;
  parseError: string | null;
  isAutoSync: boolean;
  selectedNodeId: string | null;
  rightPanelMode: 'widgets' | 'properties';
  lastVisualEdit: { timestamp: number; newString: string } | null;
  zoom: number;
  allowHeaderFooterEditing: boolean;

  // Actions
  setJsonString: (value: string) => void;
  toggleAutoSync: () => void;
  triggerManualSync: () => void;
  setSelectedNodeId: (id: string | null) => void;
  setRightPanelMode: (mode: 'widgets' | 'properties') => void;
  updateNodeProperty: (nodeId: string, propertyGroup: 'layout' | 'style' | 'props' | 'bind', propertyKey: string, newValue: any) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setAllowHeaderFooterEditing: (allowed: boolean) => void;
  // Structural Edits
  deleteNode: (id: string) => void;
  moveNode: (id: string, direction: 'up' | 'down' | 'out') => void;
  insertNode: (parentId: string, index: number | undefined, node: BaseNode) => void;
  moveNodeToParent: (id: string, newParentId: string, index?: number) => void;
  insertNodeSibling: (targetSiblingId: string, position: 'before' | 'after', node: BaseNode) => void;
  moveNodeToSibling: (id: string, targetSiblingId: string, position: 'before' | 'after') => void;
  replaceNode: (id: string, newNode: BaseNode) => void;
  deconstructAllRichText: () => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  jsonString: INITIAL_JSON_STRING,
  parsedDocument: TEST_DOCUMENT || INITIAL_DOCUMENT,
  isValid: true,
  parseError: null,
  isAutoSync: true,
  selectedNodeId: null,
  rightPanelMode: 'widgets',
  lastVisualEdit: null,
  zoom: 1,
  allowHeaderFooterEditing: false,

  setSelectedNodeId: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  setRightPanelMode: (mode: 'widgets' | 'properties') => {
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

  updateNodeProperty: (nodeId: string, propertyGroup: 'layout' | 'style' | 'props' | 'bind', propertyKey: string, newValue: any) => {
    const { parsedDocument, jsonString, isAutoSync } = get();
    if (!parsedDocument) return;

    const baseNodeId = nodeId.split('-part')[0];

    import('../utils/jsonUpdater').then(({ findNodePath }) => {
      const nodePath = findNodePath(parsedDocument, baseNodeId);
      if (nodePath) {
        try {
          const updatedJsonString = updateJsonNodeProperty(jsonString, nodePath, propertyGroup, propertyKey, newValue);
          // Set both jsonString and lastVisualEdit so Monaco can intercept if mounted
          set({ 
            jsonString: updatedJsonString,
            lastVisualEdit: { timestamp: Date.now(), newString: updatedJsonString }
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
      const parsed = JSON.parse(get().jsonString) as DocumentSchema;
      // In a real app we'd run the JSON Schema validator here before accepting it.
      // For now, if it parses as JSON, we trust it matches the schema shape loosely.
      set({
        parsedDocument: parsed,
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
    const baseId = id.split('-part')[0];
    const newAst = deleteNodeFromAst(parsedDocument, baseId);
    setJsonString(JSON.stringify(newAst, null, 2));
    
    if (get().selectedNodeId?.split('-part')[0] === baseId) {
      get().setSelectedNodeId(null);
    }
  },

  moveNode: (id, direction) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split('-part')[0];
    const newAst = moveNodeInAst(parsedDocument, baseId, direction);
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  insertNode: (parentId, index, node) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseParentId = parentId.split('-part')[0];
    const newAst = insertNodeIntoAst(parsedDocument, baseParentId, node, index);
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  moveNodeToParent: (id, newParentId, index) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split('-part')[0];
    const baseParentId = newParentId.split('-part')[0];
    const newAst = moveNodeToNewParent(parsedDocument, baseId, baseParentId, index);
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  insertNodeSibling: (targetSiblingId, position, node) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseSiblingId = targetSiblingId.split('-part')[0];
    const newAst = insertNodeSibling(parsedDocument, baseSiblingId, position, node);
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  moveNodeToSibling: (id, targetSiblingId, position) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split('-part')[0];
    const baseSiblingId = targetSiblingId.split('-part')[0];
    const newAst = moveNodeToSibling(parsedDocument, baseId, baseSiblingId, position);
    setJsonString(JSON.stringify(newAst, null, 2));
  },

  replaceNode: (id, newNode) => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const baseId = id.split('-part')[0];
    import('./astManipulators').then(({ replaceNodeInAst }) => {
      const newAst = replaceNodeInAst(parsedDocument, baseId, newNode);
      setJsonString(JSON.stringify(newAst, null, 2));
    });
  },

  deconstructAllRichText: () => {
    const { parsedDocument, setJsonString } = get();
    if (!parsedDocument) return;
    const prefs = parsedDocument.meta.richTextPreferences;
    
    // Create deep copy
    const newDoc: DocumentSchema = JSON.parse(JSON.stringify(parsedDocument));
    
    newDoc.document.body = autoDeconstructRichTextAst(newDoc.document.body, prefs);
    
    // Also process headers and footers
    Object.keys(newDoc.document.headers).forEach(id => {
      newDoc.document.headers[id].root = autoDeconstructRichTextAst(newDoc.document.headers[id].root, prefs);
    });
    Object.keys(newDoc.document.footers).forEach(id => {
      newDoc.document.footers[id].root = autoDeconstructRichTextAst(newDoc.document.footers[id].root, prefs);
    });
    
    setJsonString(JSON.stringify(newDoc, null, 2));
  }
}));
