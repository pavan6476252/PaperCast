import React from "react";
import { AnyNode } from "@papercast/core";
import { NodeRegistry } from "./registry";
import { usePaperCastContext } from "./PaperCastProvider";

export interface PageContext {
  pageNumber: number;
  pageCount: number;
}

export interface NodeRendererProps {
  /** The AST node to render */
  node: AnyNode;
  /** The data binding path hierarchy (if applicable) */
  path?: string;
  /** The pagination context (if rendered on a specific page) */
  pageContext?: PageContext;
}

/**
 * The core React component that resolves a PaperCast AST Node to its respective
 * React component via the internal NodeRegistry.
 *
 * If a `NodeWrapper` is configured in the `PaperCastProvider` (e.g. for the visual builder),
 * it will automatically wrap the resolved component.
 */
export const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  path,
  pageContext,
}) => {
  const def = NodeRegistry.get(node.type);

  let paperCastCtx;
  try {
    paperCastCtx = usePaperCastContext();
  } catch {
    // Context may not be defined in OffscreenMeasurer
  }

  if (!def) {
    return (
      <div style={{ color: "red", border: "1px solid red", padding: 4 }}>
        Unknown node type: {node.type}
      </div>
    );
  }

  const Component = def.render;

  const baseProps = {
    "data-node-id": node.id,
    "data-node-type": node.type,
  };

  if (paperCastCtx?.NodeWrapper) {
    const Wrapper = paperCastCtx.NodeWrapper;
    const renderContent = (
      injectedProps?: React.HTMLAttributes<HTMLDivElement> & {
        "data-selected"?: boolean;
      },
      overlays?: React.ReactNode
    ) => (
      <React.Fragment>
        {overlays}
        <Component
          node={node}
          path={path}
          pageContext={pageContext}
          injectedProps={{ ...baseProps, ...injectedProps } as any}
        />
      </React.Fragment>
    );
    return <Wrapper node={node} renderContent={renderContent} />;
  }

  return (
    <Component
      node={node}
      path={path}
      pageContext={pageContext}
      injectedProps={baseProps as any}
    />
  );
};
