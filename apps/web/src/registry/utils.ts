import { AnyNode, DocumentSchema } from "@formcast/core";

export interface WidgetRegistryItem {
  id: string;
  categoryId: "headers" | "footers" | "tables" | "layout" | "advanced";
  title: string;
  description: string;
  schema: DocumentSchema;
}

const baseTheme = {
  defaults: {
    base: {
      fontFamily: "Inter",
      fontSizePx: 12,
      lineHeight: 1.4,
      color: "#222222",
    },
    text: { marginBottom: 2 },
    row: { direction: "row" as const, alignItems: "center" as const },
    column: { direction: "column" as const },
    table: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderTopColor: "#d8d8d8",
      borderBottomColor: "#d8d8d8",
      borderLeftColor: "#d8d8d8",
      borderRightColor: "#d8d8d8",
    },
  },
};

const baseMeta = {
  pageSize: "A4" as const,
  orientation: "portrait" as const,
  baseUnit: "px" as const,
  dpi: 96,
};

const baseData = {
  company: {
    name: "Acme Corp",
    logo: "/assets/logo.png",
    address1: "123 Business Rd.",
    address2: "Suite 100",
    city: "Metropolis",
    state: "NY",
    postalCode: "10001",
    phone: "+1 555-0198",
    email: "hello@acme.com",
    website: "acme.com",
  },
  customer: {
    name: "Wayne Enterprises",
    email: "billing@wayne.com",
    address: "1007 Mountain Dr, Gotham, NJ",
  },
  invoice: {
    number: "INV-2026-001",
    date: "2026-07-28",
    dueDate: "2026-08-28",
    total: "$4,500.00",
  },
  items: [
    { desc: "Consulting", qty: 10, rate: 150, total: 1500 },
    { desc: "Development", qty: 20, rate: 150, total: 3000 },
    { desc: "Server Hosting", qty: 1, rate: 500, total: 500 },
  ],
};

function wrapBase(
  node: AnyNode,
  heightPx?: number,
  section: "body" | "header" | "footer" = "body"
): DocumentSchema {
  return {
    version: 1,
    meta: {
      ...baseMeta,
      pageSize: heightPx ? { widthPx: 794, heightPx } : "A4",
    },
    theme: baseTheme,
    data: baseData,
    definitions: { widgets: {} },
    document: {
      headers:
        section === "header"
          ? {
              default: {
                root: {
                  id: node.id + "-header-root",
                  type: "column",
                  layout: {
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingTop: 20,
                    paddingBottom: 0,
                    width: "100%",
                    direction: "column",
                  },
                  children: [node],
                } as any,
              },
            }
          : {},
      footers:
        section === "footer"
          ? {
              default: {
                root: {
                  id: node.id + "-footer-root",
                  type: "column",
                  layout: {
                    paddingLeft: 40,
                    paddingRight: 40,
                    paddingTop: 0,
                    paddingBottom: 20,
                    width: "100%",
                    direction: "column",
                  },
                  children: [node],
                } as any,
              },
            }
          : {},
      pageOverrides: {},
      body: {
        id: node.id + "-body-root",
        type: "root",
        layout: {
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: section === "body" ? 20 : 0,
          paddingBottom: section === "body" ? 20 : 0,
          direction: "column",
          rowGap: 16,
        },
        children: section === "body" ? [node] : [],
      },
    },
  };
}

export function wrap(node: AnyNode, heightPx?: number): DocumentSchema {
  return wrapBase(node, heightPx, "body");
}

export function wrapHeader(node: AnyNode, heightPx?: number): DocumentSchema {
  return wrapBase(node, heightPx, "header");
}

export function wrapFooter(node: AnyNode, heightPx?: number): DocumentSchema {
  return wrapBase(node, heightPx, "footer");
}
