export const DEFAULT_WIDGET_CONFIGS = {
  row: {
    type: "row",
    id: "row-temp",
    layout: { direction: "row", columnGap: 12 },
    children: [],
  },
  column: {
    type: "column",
    id: "col-temp",
    layout: { direction: "column", rowGap: 12 },
    children: [],
  },
  text: {
    type: "text",
    id: "text-temp",
    layout: {},
    props: { literal: "Sample Text" },
  },
  image: {
    type: "image",
    id: "img-temp",
    layout: { width: 150, height: 150 },
    props: { srcLiteral: "" },
  },
  table: {
    type: "table",
    id: "table-temp",
    layout: {},
    props: { columns: [{ headerText: "Col 1", bindPath: "col1" }] },
  },
  input: {
    type: "input",
    id: "input-temp",
    layout: {},
    props: { label: "Input Label", placeholder: "Enter text..." },
  },
};

export const WIDGET_DOCUMENTATION = {
  description:
    "FormCast schema nodes must always include 'id', 'type', and a 'layout' object. The 'props' structure depends on the widget type. Use *Literal fields for static data, and *Bind fields for data-binding.",
  widgets: {
    row: {
      type: "row",
      id: "row-id",
      layout: { direction: "row", columnGap: 12, width: "100%" },
      children: [],
    },
    column: {
      type: "column",
      id: "col-id",
      layout: { direction: "column", rowGap: 12 },
      children: [],
    },
    text: {
      type: "text",
      id: "text-id",
      layout: {},
      props: { literal: "Static text string", hrefLiteral: "Optional URL" },
      bind: { path: "data.path" },
    },
    richText: {
      type: "richText",
      id: "rich-text-id",
      layout: {},
      props: { htmlLiteral: "<p>HTML</p>" },
    },
    image: {
      type: "image",
      id: "image-id",
      layout: {},
      props: { srcLiteral: "https://...", fit: "contain|cover|stretch" },
    },
    listTile: {
      type: "listTile",
      id: "list-tile-id",
      layout: {},
      props: { titleLiteral: "Title", subtitleLiteral: "Subtitle" },
    },
    checkbox: {
      type: "checkbox",
      id: "check-id",
      layout: {},
      props: { labelLiteral: "Label", checkedLiteral: true },
    },
    table: {
      type: "table",
      id: "table-id",
      layout: {},
      bind: { path: "dataArrayKey", mode: "repeat" },
      props: {
        columns: [
          { headerText: "Col 1", bindPath: "field1", flex: 1, align: "left" },
        ],
      },
    },
  },
};
