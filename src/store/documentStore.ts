import { create } from "zustand";
import { DocumentSchema } from "../types/schema";
import { TEST_DOCUMENT } from "./test.data";

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

  // Actions
  setJsonString: (value: string) => void;
  toggleAutoSync: () => void;
  triggerManualSync: () => void;
  setSelectedNodeId: (id: string | null) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  jsonString: INITIAL_JSON_STRING,
  parsedDocument: TEST_DOCUMENT || INITIAL_DOCUMENT,
  isValid: true,
  parseError: null,
  isAutoSync: true,
  selectedNodeId: null,

  setSelectedNodeId: (id: string | null) => {
    set({ selectedNodeId: id });
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
}));
