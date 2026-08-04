/**
 * The standard CSS box model properties supported by the rendering engine.
 * Maps closely to standard CSS styling.
 */
export interface BoxModel {
  // sizing
  width?: number | string;
  height?: number | string;
  minHeight?: number;

  // margin
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;

  // padding
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;

  // background
  backgroundColor?: string;

  // border
  borderTopWidth?: number;
  borderTopStyle?: "solid" | "dashed" | "none";
  borderTopColor?: string;
  borderRightWidth?: number;
  borderRightStyle?: "solid" | "dashed" | "none";
  borderRightColor?: string;
  borderBottomWidth?: number;
  borderBottomStyle?: "solid" | "dashed" | "none";
  borderBottomColor?: string;
  borderLeftWidth?: number;
  borderLeftStyle?: "solid" | "dashed" | "none";
  borderLeftColor?: string;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;

  // flex/flow controls
  direction?: "row" | "column";
  wrap?: boolean;
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  justifyContent?:
    "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  rowGap?: number;
  columnGap?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  flex?: number | string;

  // pagination hints
  breakInside?: "auto" | "avoid";
  keepWithNext?: boolean;
  pageBreakBefore?: boolean;
}

export interface TypographyAndColor {
  fontFamily?: string;
  fontSizePx?: number;
  fontWeight?: "normal" | "bold" | number;
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: "left" | "center" | "right" | "justify";
  color?: string;
  lineHeight?: number;
}

/**
 * Configuration for binding dynamic values (e.g. JSON data variables, arrays)
 * into node properties or layouts.
 */
export interface DataBinding {
  path: string;
  mode?: "single" | "repeat";
  itemAlias?: string;
  layoutMode?: "stack" | "grid";
  columns?: number;
}

export interface TableColumnConfig {
  bindPath?: string;
  headerText?: string;
  widthPx?: number;
  flex?: number;
  align?: "left" | "center" | "right";
  hidden?: boolean;
}

export interface TableFooterCell {
  colSpan?: number;
  rowSpan?: number;
  content?: AnyNode[];
  borderRight?: boolean;
  borderLeft?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
}

export interface TableFooterRow {
  id: string;
  cells: TableFooterCell[];
}

export interface TableStyleConfig {
  borderColor?: string;
  borderWidthPx?: number;
  cellPaddingPx?: number;
  gridLines?: "all" | "horizontal" | "none";

  headerBackgroundColor?: string;
  headerTextColor?: string;
  headerFontSizePx?: number;
  headerFontWeight?: string;

  footerBackgroundColor?: string;
  footerTextColor?: string;
  footerFontSizePx?: number;
  footerFontWeight?: string;

  rowBackgroundColor?: string;
  alternateRowBackgroundColor?: string;
  rowTextColor?: string;
  rowFontSizePx?: number;
}

export interface TableProps {
  columns?: TableColumnConfig[];
  data?: any[];
  footerRows?: TableFooterRow[];
  footerSplitIndex?: number;
  footerEndIndex?: number;
  splitIndex?: number;
  endIndex?: number;
  hideHeaderOnSplit?: boolean;
  tableSplitBehaviour?: "withHeader" | "withoutHeader";
  styleConfig?: TableStyleConfig;
}

/**
 * The foundational shape of every node in the PaperCast AST.
 */
export interface BaseNode<
  TType extends string = string,
  TProps = Record<string, any> | undefined,
> {
  id: string;
  type: TType;
  layout: BoxModel;
  style?: TypographyAndColor;
  bind?: DataBinding;
  children?: AnyNode[];
  overrides?: Record<string, Partial<AnyNode>>;
  props?: TProps;
}

export type RootNode = BaseNode<"root", undefined>;
export type RowNode = BaseNode<"row", undefined>;
export type ColumnNode = BaseNode<"column", undefined>;
export type TextNode = BaseNode<
  "text",
  {
    literal?: string;
    isAnchor?: boolean;
    hrefLiteral?: string;
    hrefBind?: string;
  }
>;
export type ImageNode = BaseNode<
  "image",
  {
    srcBind?: string;
    srcLiteral?: string;
    fit?: "contain" | "cover" | "stretch";
  }
>;
export type SpacerNode = BaseNode<"spacer", { sizePx?: number }>;
export type TableNode = BaseNode<"table", TableProps>;
export type WidgetInstanceNode = BaseNode<
  "widgetInstance",
  { definitionId: string }
>;

export type ListTileNode = BaseNode<
  "listTile",
  {
    titleLiteral?: string;
    titleBind?: string;
    subtitleLiteral?: string;
    subtitleBind?: string;
  }
>;

export type RichTextNode = BaseNode<
  "richText",
  {
    htmlLiteral?: string;
    htmlBind?: string;
  }
>;

export type UnorderedListNode = BaseNode<"ul", undefined>;
export type OrderedListNode = BaseNode<"ol", undefined>;

export type CheckboxNode = BaseNode<
  "checkbox",
  {
    labelLiteral?: string;
    labelBind?: string;
    checkedLiteral?: boolean;
    checkedBind?: string;
  }
>;

export type RadioNode = BaseNode<
  "radio",
  {
    labelLiteral?: string;
    labelBind?: string;
    checkedLiteral?: boolean;
    checkedBind?: string;
    value?: string;
    name?: string;
  }
>;

export type RadioGroupNode = BaseNode<
  "radioGroup",
  {
    name?: string;
    valueLiteral?: string;
    valueBind?: string;
  }
>;

/**
 * Interface for module augmentation.
 * Package consumers can extend this interface to add their custom node types
 * for strict typing and autocomplete.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomNodesRegistry {}

/**
 * Union of all native PaperCast nodes.
 */
export type BuiltInNode =
  | RootNode
  | RowNode
  | ColumnNode
  | TextNode
  | ImageNode
  | SpacerNode
  | TableNode
  | WidgetInstanceNode
  | ListTileNode
  | RichTextNode
  | UnorderedListNode
  | OrderedListNode
  | CheckboxNode
  | RadioNode
  | RadioGroupNode;

/**
 * Comprehensive union representing any valid node (built-in or custom).
 */
export type AnyNode =
  BuiltInNode | CustomNodesRegistry[keyof CustomNodesRegistry];

export interface Theme {
  defaults: {
    base?: TypographyAndColor & BoxModel;
    [nodeType: string]: (TypographyAndColor & BoxModel) | undefined;
  };
}

export interface WidgetDefinition {
  id: string;
  type: "widgetDefinition";
  contextShape?: string;
  root: AnyNode;
}

export type RegionCondition =
  | "all"
  | "first"
  | "last"
  | "even"
  | "odd"
  | { type: "custom"; expression: string };

export interface PageRegion {
  id?: string;
  name?: string;
  condition?: RegionCondition;
  heightPx?: number;
  root: AnyNode;
}

export interface RichTextPreferences {
  autoDeconstruct?: boolean;
  tagStyles?: Record<
    string,
    {
      style?: TypographyAndColor;
      layout?: BoxModel;
    }
  >;
}

/**
 * Represents the entire state of a PaperCast document, including its hierarchy,
 * widget definitions, theme configuration, static data, and metadata.
 */
export interface DocumentSchema {
  version: number;
  meta: {
    pageSize: "A4" | "A3" | "Letter" | { widthPx: number; heightPx: number };
    orientation: "portrait" | "landscape";
    baseUnit: "px";
    dpi: number;
    richTextPreferences?: RichTextPreferences;
  };
  theme: Theme;
  data: Record<string, any>;
  definitions: {
    widgets: Record<string, WidgetDefinition>;
  };
  document: {
    headers: Record<string, PageRegion>;
    footers: Record<string, PageRegion>;
    pageOverrides: Record<string, Record<string, string | null>>;
    body: AnyNode;
  };
}
