import { CSSProperties } from "react";
import { AnyNode } from "@formcast/core";

export function getStyle(node: AnyNode): CSSProperties {
  const layout = node.layout || {};
  const style = node.style || {};

  const css: CSSProperties = {
    // Sizing
    width: layout.width,
    height: layout.height,
    minHeight: layout.minHeight,

    // Margin
    marginTop: layout.marginTop,
    marginRight: layout.marginRight,
    marginBottom: layout.marginBottom,
    marginLeft: layout.marginLeft,

    // Padding
    paddingTop: layout.paddingTop,
    paddingRight: layout.paddingRight,
    paddingBottom: layout.paddingBottom,
    paddingLeft: layout.paddingLeft,

    // Border
    borderTopWidth: layout.borderTopWidth,
    borderTopStyle: layout.borderTopStyle,
    borderTopColor: layout.borderTopColor,
    borderRightWidth: layout.borderRightWidth,
    borderRightStyle: layout.borderRightStyle,
    borderRightColor: layout.borderRightColor,
    borderBottomWidth: layout.borderBottomWidth,
    borderBottomStyle: layout.borderBottomStyle,
    borderBottomColor: layout.borderBottomColor,
    borderLeftWidth: layout.borderLeftWidth,
    borderLeftStyle: layout.borderLeftStyle,
    borderLeftColor: layout.borderLeftColor,
    borderRadius: layout.borderRadius,
    borderTopLeftRadius: layout.borderTopLeftRadius,
    borderTopRightRadius: layout.borderTopRightRadius,
    borderBottomRightRadius: layout.borderBottomRightRadius,
    borderBottomLeftRadius: layout.borderBottomLeftRadius,

    // Flex/Flow
    display: "flex",
    flexDirection: layout.direction,
    flexWrap: layout.flexWrap
      ? layout.flexWrap
      : layout.wrap
        ? "wrap"
        : "nowrap",
    justifyContent: layout.justifyContent,
    alignItems: layout.alignItems,
    rowGap: layout.rowGap,
    columnGap: layout.columnGap,
    flex: layout.flex,
    flexGrow: layout.flex !== undefined ? undefined : layout.flexGrow,
    flexShrink: layout.flex !== undefined ? undefined : layout.flexShrink,
    flexBasis: layout.flex !== undefined ? undefined : layout.flexBasis,

    // Typography & Color
    fontFamily: style.fontFamily,
    fontSize: style.fontSizePx,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    textAlign: style.textAlign,
    color: style.color,
    backgroundColor: layout.backgroundColor,
    lineHeight: style.lineHeight,

    // Pagination hints are omitted from CSS, used during pagination computation
  };

  // Remove undefined properties to prevent React warnings about mixing shorthand/non-shorthand
  Object.keys(css).forEach((key) => {
    if ((css as any)[key] === undefined) {
      delete (css as any)[key];
    }
  });

  return css;
}
