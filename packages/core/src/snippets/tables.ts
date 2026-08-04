import { SchemaSnippet, baseDocument } from "./types";

export const tableSnippets: SchemaSnippet[] = [
  {
    id: "standard-striped-table",
    name: "Standard Striped Table",
    description:
      "A basic table with alternating row colors and a styled header.",
    category: "tables",
    tags: ["table", "data", "striped", "basic"],
    schema: {
      ...baseDocument,
      data: {
        ...baseDocument.data,
        employees: [
          {
            id: "E01",
            name: "Alice Smith",
            department: "Engineering",
            role: "Developer",
          },
          { id: "E02", name: "Bob Jones", department: "Design", role: "UI/UX" },
          {
            id: "E03",
            name: "Charlie Brown",
            department: "Product",
            role: "Manager",
          },
          {
            id: "E04",
            name: "Diana Prince",
            department: "Engineering",
            role: "Lead",
          },
          {
            id: "E05",
            name: "Evan Wright",
            department: "Sales",
            role: "Executive",
          },
        ],
      },
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "striped-table",
              type: "table",
              bind: { path: "employees", mode: "repeat", itemAlias: "emp" },
              layout: { marginTop: 12 },
              props: {
                columns: [
                  {
                    headerText: "ID",
                    bindPath: "id",
                    widthPx: 60,
                    align: "center",
                  },
                  {
                    headerText: "Name",
                    bindPath: "name",
                    flex: 2,
                    align: "left",
                  },
                  {
                    headerText: "Department",
                    bindPath: "department",
                    flex: 1,
                    align: "left",
                  },
                  {
                    headerText: "Role",
                    bindPath: "role",
                    flex: 1,
                    align: "left",
                  },
                ],
                styleConfig: {
                  headerBackgroundColor: "#333333",
                  headerTextColor: "#ffffff",
                  rowBackgroundColor: "#ffffff",
                  alternateRowBackgroundColor: "#f5f5f5",
                  borderColor: "#dddddd",
                  borderWidthPx: 1,
                  cellPaddingPx: 8,
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    id: "invoice-table-complex-footer",
    name: "Invoice Table with Complex Footer",
    description:
      "A table demonstrating column spanning (colSpan) in the footer for Subtotal, Tax, and Grand Total.",
    category: "tables",
    tags: ["table", "invoice", "footer", "colspan", "complex"],
    schema: {
      ...baseDocument,
      data: {
        ...baseDocument.data,
        lineItems: [
          { desc: "Web Development", hours: 40, rate: 150, total: 6000 },
          { desc: "UI Design", hours: 25, rate: 120, total: 3000 },
          { desc: "Server Setup", hours: 10, rate: 100, total: 1000 },
        ],
      },
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "invoice-table",
              type: "table",
              bind: { path: "lineItems", mode: "repeat", itemAlias: "item" },
              layout: { marginTop: 12 },
              props: {
                columns: [
                  {
                    headerText: "Description",
                    bindPath: "desc",
                    flex: 3,
                    align: "left",
                  },
                  {
                    headerText: "Hours",
                    bindPath: "hours",
                    widthPx: 80,
                    align: "center",
                  },
                  {
                    headerText: "Rate",
                    bindPath: "rate",
                    widthPx: 100,
                    align: "right",
                  },
                  {
                    headerText: "Total",
                    bindPath: "total",
                    widthPx: 120,
                    align: "right",
                  },
                ],
                styleConfig: {
                  headerBackgroundColor: "#f0f0f0",
                  headerFontWeight: "bold",
                  borderColor: "#cccccc",
                  borderWidthPx: 1,
                  cellPaddingPx: 8,
                },
                footerRows: [
                  {
                    id: "footer-subtotal",
                    cells: [
                      {
                        colSpan: 3,
                        content: [
                          {
                            id: "fs-label",
                            type: "text",
                            props: { literal: "Subtotal" },
                            style: { fontWeight: "bold" },
                            layout: { alignItems: "flex-end" },
                          },
                        ],
                      },
                      {
                        content: [
                          {
                            id: "fs-val",
                            type: "text",
                            props: { literal: "$10,000.00" },
                            layout: { alignItems: "flex-end" },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "footer-tax",
                    cells: [
                      {
                        colSpan: 3,
                        content: [
                          {
                            id: "ft-label",
                            type: "text",
                            props: { literal: "Tax (10%)" },
                            style: { fontWeight: "bold" },
                            layout: { alignItems: "flex-end" },
                          },
                        ],
                      },
                      {
                        content: [
                          {
                            id: "ft-val",
                            type: "text",
                            props: { literal: "$1,000.00" },
                            layout: { alignItems: "flex-end" },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "footer-total",
                    cells: [
                      {
                        colSpan: 3,
                        content: [
                          {
                            id: "gt-label",
                            type: "text",
                            props: { literal: "Grand Total" },
                            style: { fontWeight: "bold", fontSizePx: 14 },
                            layout: { alignItems: "flex-end" },
                          },
                        ],
                      },
                      {
                        content: [
                          {
                            id: "gt-val",
                            type: "text",
                            props: { literal: "$11,000.00" },
                            style: { fontWeight: "bold", fontSizePx: 14 },
                            layout: { alignItems: "flex-end" },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
  {
    id: "catalog-grid",
    name: "Catalog Grid",
    description:
      "A flex-wrap layout using DataBinding to repeat a 'Product Card' widget across the page.",
    category: "tables",
    tags: ["grid", "catalog", "flex-wrap", "data-binding", "repeat"],
    schema: {
      ...baseDocument,
      data: {
        ...baseDocument.data,
        products: [
          { name: "Widget A", price: "$19.99", category: "Tools" },
          { name: "Widget B", price: "$24.99", category: "Tools" },
          { name: "Gadget C", price: "$49.99", category: "Electronics" },
          { name: "Gadget D", price: "$99.99", category: "Electronics" },
          { name: "Thingamajig", price: "$4.99", category: "Misc" },
        ],
      },
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "catalog-container",
              type: "row",
              layout: {
                wrap: true,
                columnGap: 16,
                rowGap: 16,
              },
              children: [
                {
                  id: "product-card",
                  type: "column",
                  bind: { path: "products", mode: "repeat", itemAlias: "prod" },
                  layout: {
                    width: 150,
                    borderTopWidth: 1,
                    borderTopColor: "#eaeaea",
                    borderRightWidth: 1,
                    borderRightColor: "#eaeaea",
                    borderBottomWidth: 1,
                    borderBottomColor: "#eaeaea",
                    borderLeftWidth: 1,
                    borderLeftColor: "#eaeaea",
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 12,
                    paddingRight: 12,
                    rowGap: 8,
                    backgroundColor: "#fefefe",
                  },
                  children: [
                    {
                      id: "pc-img",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/120/80",
                        fit: "cover",
                      },
                      layout: { width: 120, height: 80 },
                    },
                    {
                      id: "pc-name",
                      type: "text",
                      props: { literal: "{{prod.name}}" },
                      style: { fontWeight: "bold", fontSizePx: 12 },
                      layout: {},
                    },
                    {
                      id: "pc-cat",
                      type: "text",
                      props: { literal: "{{prod.category}}" },
                      style: { fontSizePx: 10, color: "#888888" },
                      layout: {},
                    },
                    {
                      id: "pc-price",
                      type: "text",
                      props: { literal: "{{prod.price}}" },
                      style: {
                        fontWeight: "bold",
                        fontSizePx: 14,
                        color: "#2a9d8f",
                      },
                      layout: { marginTop: 8 },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  },
];
