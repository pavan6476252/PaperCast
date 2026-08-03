import { DocumentSchema } from "../schema";

export interface SchemaSnippet {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  schema: DocumentSchema;
}

// A minimal empty template to base smaller components on
export const baseDocument: DocumentSchema = {
  version: 1,
  meta: {
    pageSize: "A4",
    orientation: "portrait",
    baseUnit: "px",
    dpi: 96,
  },
  theme: { defaults: {} },
  data: {},
  definitions: { widgets: {} },
  document: {
    headers: {},
    footers: {},
    pageOverrides: {},
    body: {
      id: "body-root",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        paddingBottom: 20,
      },
      children: [],
    },
  },
};
