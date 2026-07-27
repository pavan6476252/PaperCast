export interface BoxModel {
  // sizing
  width?: number | "auto";
  height?: number | "auto";
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

  // flex/flow controls
  direction?: "row" | "column";
  wrap?: boolean;
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  rowGap?: number;
  columnGap?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | "auto";

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
  backgroundColor?: string;
  lineHeight?: number;
}

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
  align?: "left" | "center" | "right";
}

export interface CustomTableRow {
  index: number;
  cells: any[];
}

export interface TableProps {
  columns?: TableColumnConfig[];
  customRows?: CustomTableRow[];
  splitIndex?: number;
  endIndex?: number;
  hideHeaderOnSplit?: boolean;
  tableSplitBehaviour?: "withHeader" | "withoutHeader";
}

export interface BaseNodeCommon {
  id: string;
  layout: BoxModel;
  style?: TypographyAndColor;
  bind?: DataBinding;
  children?: BaseNode[];
  overrides?: Record<string, Partial<BaseNode>>;
}

export interface RootNode extends BaseNodeCommon { type: "root"; props?: undefined; }
export interface RowNode extends BaseNodeCommon { type: "row"; props?: undefined; }
export interface ColumnNode extends BaseNodeCommon { type: "column"; props?: undefined; }
export interface TextNode extends BaseNodeCommon { type: "text"; props?: { literal?: string }; }
export interface ImageNode extends BaseNodeCommon { type: "image"; props?: { srcBind?: string; srcLiteral?: string; fit?: "contain" | "cover" | "stretch" }; }
export interface SpacerNode extends BaseNodeCommon { type: "spacer"; props?: { sizePx?: number }; }
export interface TableNode extends BaseNodeCommon { type: "table"; props?: TableProps; }
export interface WidgetInstanceNode extends BaseNodeCommon { type: "widgetInstance"; props?: { definitionId: string }; }

export type BaseNode = RootNode | RowNode | ColumnNode | TextNode | ImageNode | SpacerNode | TableNode | WidgetInstanceNode | (BaseNodeCommon & { type: string; props?: Record<string, any> });

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
  root: BaseNode;
}

export interface DocumentSection {
  id?: string;
  name?: string;
  condition?: "all" | "first" | "last" | "even" | "odd";
  heightPx?: number;
  root: BaseNode;
}

export interface DocumentSchema {
  version: number;
  meta: {
    pageSize: "A4" | "A3" | "Letter" | { widthPx: number; heightPx: number };
    orientation: "portrait" | "landscape";
    baseUnit: "px";
    dpi: number;
  };
  theme: Theme;
  data: Record<string, any>;
  definitions: {
    widgets: Record<string, WidgetDefinition>;
  };
  document: {
    headers: Record<string, DocumentSection>;
    footers: Record<string, DocumentSection>;
    headerDefaultId?: string | null;
    footerDefaultId?: string | null;
    pageOverrides: Record<string, { headerId?: string | null; footerId?: string | null }>;
    body: BaseNode;
  };
}

export interface Measurements {
  headers: Record<string, number>;
  footers: Record<string, number>;
  blocks: Record<string, number>;
  tableRows: Record<string, number[]>;
  tableHeaders: Record<string, number>;
}
