import { useMemo } from "react";
import { AnyNode } from "@papercast/core";
import { getStyle } from "../utils/styleUtils";
import React from "react";

export function useNodeStyle(
  node: AnyNode,
  injectedProps?: React.HTMLAttributes<HTMLDivElement> & {
    "data-selected"?: boolean;
  }
) {
  return useMemo(() => {
    const layout = node.layout || {};
    const s: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      flex: layout.flex,
      flexGrow: layout.flex !== undefined ? undefined : layout.flexGrow,
      flexShrink: layout.flex !== undefined ? undefined : layout.flexShrink,
      flexBasis: layout.flex !== undefined ? undefined : layout.flexBasis,
      width: layout.width,
      height: layout.height,
      minHeight: layout.minHeight,
      ...getStyle(node),
      ...(injectedProps?.style || {}),
    };

    Object.keys(s).forEach((key) => {
      if ((s as any)[key] === undefined) {
        delete (s as any)[key];
      }
    });
    return s;
  }, [node, injectedProps]);
}
