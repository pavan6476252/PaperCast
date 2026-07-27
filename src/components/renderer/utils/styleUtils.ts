import { BoxModel, TypographyAndColor, BaseNode } from "../../../types/schema";
import { CSSProperties } from "react";

export function getStyle(node: BaseNode): CSSProperties {
  const layout = node.layout || {};
  const style = node.style || {};

  return {
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

    // Flex/Flow
    display: "flex",
    flexDirection: layout.direction,
    flexWrap: layout.wrap ? "wrap" : "nowrap",
    justifyContent: layout.justifyContent,
    alignItems: layout.alignItems,
    rowGap: layout.rowGap,
    columnGap: layout.columnGap,
    flexGrow: layout.flexGrow,
    flexShrink: layout.flexShrink,
    flexBasis: layout.flexBasis,

    // Typography & Color
    fontFamily: style.fontFamily,
    fontSize: style.fontSizePx,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    textAlign: style.textAlign,
    color: style.color,
    backgroundColor: style.backgroundColor,
    lineHeight: style.lineHeight,

    // Pagination hints are omitted from CSS, used during pagination computation
  };
}
