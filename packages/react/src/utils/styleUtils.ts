import { CSSProperties } from "react";
import { AnyNode, Theme } from "@papercast/core";

export function getStyle(node: AnyNode, theme?: Theme): CSSProperties {
  const layout = node.layout ? { ...node.layout } : {};
  const style = node.style ? { ...node.style } : {};

  if (theme?.classes && node.classNames && Array.isArray(node.classNames)) {
    for (const className of node.classNames) {
      const cls = theme.classes[className];
      if (cls) {
        if (cls.backgroundColor && layout.backgroundColor === undefined)
          layout.backgroundColor = cls.backgroundColor;
        if (cls.borderColor && layout.borderColor === undefined)
          layout.borderColor = cls.borderColor;

        if (cls.color && style.color === undefined) style.color = cls.color;
        if (cls.fontFamily && style.fontFamily === undefined)
          style.fontFamily = cls.fontFamily;
        if (cls.fontSizePx && style.fontSizePx === undefined)
          style.fontSizePx = cls.fontSizePx;
        if (cls.fontWeight && style.fontWeight === undefined)
          style.fontWeight = cls.fontWeight;
        if (cls.fontStyle && style.fontStyle === undefined)
          style.fontStyle = cls.fontStyle;
        if (cls.textDecoration && style.textDecoration === undefined)
          style.textDecoration = cls.textDecoration;
        if (cls.textAlign && style.textAlign === undefined)
          style.textAlign = cls.textAlign;
        if (cls.lineHeight && style.lineHeight === undefined)
          style.lineHeight = cls.lineHeight;
      }
    }
  }

  const css: CSSProperties = {
    // Sizing
    width: layout.width,
    height: layout.height,
    minHeight: layout.minHeight,

    // Margin
    margin: layout.margin,
    marginTop: layout.marginTop,
    marginRight: layout.marginRight,
    marginBottom: layout.marginBottom,
    marginLeft: layout.marginLeft,

    // Padding
    padding: layout.padding,
    paddingTop: layout.paddingTop,
    paddingRight: layout.paddingRight,
    paddingBottom: layout.paddingBottom,
    paddingLeft: layout.paddingLeft,

    // Border
    borderWidth: layout.borderWidth,
    borderStyle: layout.borderStyle,
    borderColor: layout.borderColor,
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

    boxShadow: layout.boxShadow,

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
