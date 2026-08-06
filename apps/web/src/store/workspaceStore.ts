import { create } from "zustand";
import { get, set, del } from "idb-keyval";

export interface SchemaMetadata {
  id: string;
  name: string;
  updatedAt: number;
}

const WORKSPACE_METADATA_KEY = "workspace_metadata";
const SCHEMA_CONTENT_PREFIX = "workspace_content_";

interface WorkspaceState {
  schemas: SchemaMetadata[];
  activeSchemaId: string | null;
  isLoading: boolean;

  loadWorkspace: () => Promise<void>;
  createSchema: (name: string, content: string) => Promise<string>;
  saveSchema: (id: string, name: string, content: string) => Promise<void>;
  loadSchemaContent: (id: string) => Promise<string | null>;
  deleteSchema: (id: string) => Promise<void>;
  setActiveSchema: (id: string | null) => void;

  isWorkspaceAutoSave: boolean;
  setIsWorkspaceAutoSave: (val: boolean) => void;
  lastSavedJsonString: string | null;
  setLastSavedJsonString: (val: string | null) => void;
  isTemplateGalleryOpen: boolean;
  setIsTemplateGalleryOpen: (val: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>(
  (setStore, getStore) => ({
    schemas: [],
    activeSchemaId: null,
    isLoading: true,
    isWorkspaceAutoSave: false,
    lastSavedJsonString: null,
    isTemplateGalleryOpen: false,

    setIsWorkspaceAutoSave: (val: boolean) =>
      setStore({ isWorkspaceAutoSave: val }),
    setLastSavedJsonString: (val: string | null) =>
      setStore({ lastSavedJsonString: val }),
    setIsTemplateGalleryOpen: (val: boolean) =>
      setStore({ isTemplateGalleryOpen: val }),

    loadWorkspace: async () => {
      try {
        const metadata = await get<SchemaMetadata[]>(WORKSPACE_METADATA_KEY);
        if (metadata) {
          setStore({ schemas: metadata, isLoading: false });
        } else {
          setStore({ schemas: [], isLoading: false });
        }
      } catch (e) {
        console.error("Failed to load workspace metadata", e);
        setStore({ schemas: [], isLoading: false });
      }
    },

    createSchema: async (name: string, content: string) => {
      const id = Math.random().toString(36).substring(2, 10);
      const newSchema: SchemaMetadata = {
        id,
        name,
        updatedAt: Date.now(),
      };

      const currentSchemas = getStore().schemas;
      const newSchemas = [newSchema, ...currentSchemas];

      await set(WORKSPACE_METADATA_KEY, newSchemas);
      await set(`${SCHEMA_CONTENT_PREFIX}${id}`, content);

      setStore({
        schemas: newSchemas,
        activeSchemaId: id,
        lastSavedJsonString: content,
      });
      return id;
    },

    saveSchema: async (id: string, name: string, content: string) => {
      const currentSchemas = getStore().schemas;
      const existingIndex = currentSchemas.findIndex((s) => s.id === id);

      let newSchemas = [...currentSchemas];
      if (existingIndex >= 0) {
        newSchemas[existingIndex] = {
          ...newSchemas[existingIndex],
          name,
          updatedAt: Date.now(),
        };
      } else {
        newSchemas = [{ id, name, updatedAt: Date.now() }, ...newSchemas];
      }

      await set(WORKSPACE_METADATA_KEY, newSchemas);
      await set(`${SCHEMA_CONTENT_PREFIX}${id}`, content);

      setStore({ schemas: newSchemas, lastSavedJsonString: content });
    },

    loadSchemaContent: async (id: string) => {
      try {
        const content = await get<string>(`${SCHEMA_CONTENT_PREFIX}${id}`);
        return content || null;
      } catch (e) {
        console.error(`Failed to load content for schema ${id}`, e);
        return null;
      }
    },

    deleteSchema: async (id: string) => {
      const currentSchemas = getStore().schemas;
      const newSchemas = currentSchemas.filter((s) => s.id !== id);

      await set(WORKSPACE_METADATA_KEY, newSchemas);
      await del(`${SCHEMA_CONTENT_PREFIX}${id}`);

      const updates: Partial<WorkspaceState> = { schemas: newSchemas };
      if (getStore().activeSchemaId === id) {
        updates.activeSchemaId = null;
      }

      setStore(updates);
    },

    setActiveSchema: (id: string | null) => {
      setStore({ activeSchemaId: id });
    },
  })
);
