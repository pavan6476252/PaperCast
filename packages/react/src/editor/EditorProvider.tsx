import React, { createContext, useContext, useMemo } from "react";
import { DocumentSchema, AnyNode } from "@papercast/core";

export interface EditorState {
  document: DocumentSchema | null;
  selectedNodeId: string | null;
  isValid: boolean;
}

export interface EditorActions {
  setSelectedNodeId: (id: string | null) => void;
  updateNodeProperty: <
    G extends "layout" | "style" | "props" | "bind",
    K extends string,
  >(
    id: string,
    group: G,
    key: K,
    value: unknown
  ) => void;
  replaceNode: (id: string, newNode: AnyNode) => void;
  insertNode: (parentId: string, node: AnyNode, index?: number) => void;
  deleteNode: (id: string) => void;
  moveNode: (id: string, direction: "up" | "down" | "out") => void;
}

export type EditorContextType = EditorState & EditorActions;

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({
  state,
  actions,
  children,
}: {
  state: EditorState;
  actions: EditorActions;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function usePaperCastEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("usePaperCastEditor must be used within an EditorProvider");
  }
  return context;
}
