import React, { createContext, useContext, useMemo } from "react";
import { AnyNode } from "@papercast/core";
import { PaperCastContext, DefaultTData } from "@papercast/engine";

export interface PageContextType {
  pageNumber: number;
  pageCount: number;
}

export interface PaperCastProviderProps<
  TData = DefaultTData,
> extends PaperCastContext<TData> {
  pageContext?: PageContextType;
  activeTab?: "content" | "headers" | "footers";
  location?: "body" | "header" | "footer";
  NodeWrapper?: React.ComponentType<{
    node: AnyNode;
    renderContent: (
      props?: React.HTMLAttributes<HTMLDivElement> & {
        "data-selected"?: boolean;
      },
      overlays?: React.ReactNode
    ) => React.ReactNode;
  }>;
  children?: React.ReactNode;
}

export type PaperCastProviderValue<TData = DefaultTData> =
  PaperCastProviderProps<TData>;

const Context = createContext<PaperCastProviderValue<any> | undefined>(
  undefined
);

const selectionStyle = `
[data-selected="true"] {
  outline: 2px solid var(--papercast-selection-color, #3b82f6);
  outline-offset: -2px;
}
@media print {
  [data-selected="true"] {
    outline: none !important;
  }
}
`;

/**
 * Provider component that propagates dynamic data binding values, pagination context,
 * and custom node wrappers down the React tree to all rendered PaperCast nodes.
 * @param props - PaperCast context configuration and children.
 */
export function PaperCastProvider<TData = DefaultTData>(
  props: PaperCastProviderProps<TData>
) {
  const parent = useContext(Context);

  const value = useMemo(
    () => ({
      data:
        props.data !== undefined ? props.data : parent?.data || ({} as TData),
      theme: props.theme !== undefined ? props.theme : parent?.theme,
      pageContext:
        props.pageContext !== undefined
          ? props.pageContext
          : parent?.pageContext,
      activeTab:
        props.activeTab !== undefined ? props.activeTab : parent?.activeTab,
      location:
        props.location !== undefined ? props.location : parent?.location,
      NodeWrapper:
        props.NodeWrapper !== undefined
          ? props.NodeWrapper
          : parent?.NodeWrapper,
    }),
    [
      props.data,
      props.theme,
      props.pageContext,
      props.activeTab,
      props.location,
      props.NodeWrapper,
      parent,
    ]
  );

  return (
    <Context.Provider value={value}>
      <style>{selectionStyle}</style>
      {props.children}
    </Context.Provider>
  );
}

/**
 * Hook to access the current PaperCast context, providing access to bound data
 * and pagination context (like current page number vs total pages).
 * Must be used within a <PaperCastProvider>.
 * @returns The current PaperCast context value.
 */
export function usePaperCastContext<TData = DefaultTData>() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "usePaperCastContext must be used within a PaperCastProvider"
    );
  }
  return context as PaperCastProviderValue<TData>;
}
