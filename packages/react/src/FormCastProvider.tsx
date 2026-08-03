import React, { createContext, useContext, useMemo } from "react";
import { AnyNode } from "@formcast/core";
import { FormCastContext, DefaultTData } from "@formcast/engine";

export interface PageContextType {
  pageNumber: number;
  pageCount: number;
}

export interface FormCastProviderProps<
  TData = DefaultTData,
> extends FormCastContext<TData> {
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

export type FormCastProviderValue<TData = DefaultTData> =
  FormCastProviderProps<TData>;

const Context = createContext<FormCastProviderValue<any> | undefined>(
  undefined
);

const selectionStyle = `
[data-selected="true"] {
  outline: 2px solid var(--formcast-selection-color, #3b82f6);
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
 * and custom node wrappers down the React tree to all rendered FormCast nodes.
 * @param props - FormCast context configuration and children.
 */
export function FormCastProvider<TData = DefaultTData>(
  props: FormCastProviderProps<TData>
) {
  const parent = useContext(Context);

  const value = useMemo(
    () => ({
      data:
        props.data !== undefined ? props.data : parent?.data || ({} as TData),
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
 * Hook to access the current FormCast context, providing access to bound data
 * and pagination context (like current page number vs total pages).
 * Must be used within a <FormCastProvider>.
 * @returns The current FormCast context value.
 */
export function useFormCastContext<TData = DefaultTData>() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useFormCastContext must be used within a FormCastProvider"
    );
  }
  return context as FormCastProviderValue<TData>;
}
