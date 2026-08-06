import { SchemaSnippet, baseDocument } from "./types";

export const advancedTableSnippets: SchemaSnippet[] = [
  {
    id: "table-static-header",
    name: "Table with Complex Headers",
    description:
      "A table that uses static headerRows to create multi-level spanned column headers.",
    category: "tables",
    tags: ["table", "header", "colspan", "rowspan", "static"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "static-header-table",
              type: "table",
              layout: { marginTop: 12 },
              props: {
                columns: [
                  { headerText: "Q1", bindPath: "q1", flex: 1 },
                  { headerText: "Q2", bindPath: "q2", flex: 1 },
                  { headerText: "Q3", bindPath: "q3", flex: 1 },
                  { headerText: "Q4", bindPath: "q4", flex: 1 },
                ],
                headerRows: [
                  {
                    id: "h1",
                    cells: [
                      {
                        colSpan: 4,
                        content: [
                          {
                            id: "t1",
                            type: "text",
                            props: { literal: "2024 Financials" },
                            style: { fontWeight: "bold" },
                            layout: { alignItems: "center" },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "h2",
                    cells: [
                      {
                        colSpan: 2,
                        content: [
                          {
                            id: "t2",
                            type: "text",
                            props: { literal: "First Half" },
                            layout: { alignItems: "center" },
                          },
                        ],
                      },
                      {
                        colSpan: 2,
                        content: [
                          {
                            id: "t3",
                            type: "text",
                            props: { literal: "Second Half" },
                            layout: { alignItems: "center" },
                          },
                        ],
                      },
                    ],
                  },
                ],
                styleConfig: {
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
    id: "table-dynamic-grouping",
    name: "Dynamic Grouping (mergeBy)",
    description:
      "A table that dynamically spans rows when contiguous cells share the same value.",
    category: "tables",
    tags: ["table", "dynamic", "mergeby", "rowspan"],
    schema: {
      ...baseDocument,
      data: {
        ...baseDocument.data,
        inventory: [
          { category: "Fruits", item: "Apple", qty: 10 },
          { category: "Fruits", item: "Banana", qty: 20 },
          { category: "Vegetables", item: "Carrot", qty: 15 },
          { category: "Vegetables", item: "Broccoli", qty: 5 },
        ],
      },
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "grouped-table",
              type: "table",
              bind: { path: "inventory" },
              layout: { marginTop: 12 },
              props: {
                columns: [
                  {
                    headerText: "Category",
                    bindPath: "category",
                    mergeBy: ["category"],
                    flex: 1,
                    align: "center",
                  },
                  { headerText: "Item", bindPath: "item", flex: 1 },
                  {
                    headerText: "Quantity",
                    bindPath: "qty",
                    widthPx: 100,
                    align: "right",
                  },
                ],
                styleConfig: {
                  borderColor: "#cccccc",
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
    id: "table-static-body",
    name: "Static Body Rows",
    description:
      "A table constructed entirely without data binding using static bodyRows.",
    category: "tables",
    tags: ["table", "static", "bodyRows", "no-binding"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "static-body-table",
              type: "table",
              layout: { marginTop: 12 },
              props: {
                columns: [
                  { headerText: "Feature", flex: 2 },
                  { headerText: "Supported", flex: 1, align: "center" },
                ],
                bodyRows: [
                  {
                    id: "b1",
                    cells: [
                      {
                        content: [
                          {
                            id: "t1",
                            type: "text",
                            props: { literal: "Row Spanning" },
                            layout: {},
                          },
                        ],
                      },
                      {
                        content: [
                          {
                            id: "t2",
                            type: "text",
                            props: { literal: "✅" },
                            layout: { alignItems: "center" },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "b2",
                    cells: [
                      {
                        content: [
                          {
                            id: "t3",
                            type: "text",
                            props: { literal: "Col Spanning" },
                            layout: {},
                          },
                        ],
                      },
                      {
                        content: [
                          {
                            id: "t4",
                            type: "text",
                            props: { literal: "✅" },
                            layout: { alignItems: "center" },
                          },
                        ],
                      },
                    ],
                  },
                ],
                styleConfig: {
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
    id: "table-complex-invoice",
    name: "Complex Grouped Invoice",
    description:
      "Combines mergeBy for category grouping and static footerRows for totals.",
    category: "tables",
    tags: ["table", "complex", "invoice", "mergeby", "footerRows"],
    schema: {
      ...baseDocument,
      data: {
        ...baseDocument.data,
        invoiceItems: [
          {
            dept: "Engineering",
            role: "Frontend",
            hours: 40,
            rate: 100,
            total: 4000,
          },
          {
            dept: "Engineering",
            role: "Backend",
            hours: 35,
            rate: 120,
            total: 4200,
          },
          {
            dept: "Design",
            role: "UI Designer",
            hours: 20,
            rate: 90,
            total: 1800,
          },
        ],
      },
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "complex-invoice",
              type: "table",
              bind: { path: "invoiceItems" },
              layout: { marginTop: 12 },
              props: {
                columns: [
                  {
                    headerText: "Department",
                    bindPath: "dept",
                    mergeBy: ["dept"],
                    flex: 1,
                  },
                  { headerText: "Role", bindPath: "role", flex: 2 },
                  {
                    headerText: "Hours",
                    bindPath: "hours",
                    widthPx: 80,
                    align: "right",
                  },
                  {
                    headerText: "Rate",
                    bindPath: "rate",
                    widthPx: 80,
                    align: "right",
                  },
                  {
                    headerText: "Total",
                    bindPath: "total",
                    widthPx: 100,
                    align: "right",
                  },
                ],
                footerRows: [
                  {
                    id: "f1",
                    cells: [
                      {
                        colSpan: 4,
                        content: [
                          {
                            id: "tf1",
                            type: "text",
                            props: { literal: "Grand Total" },
                            style: { fontWeight: "bold" },
                            layout: { alignItems: "flex-end" },
                          },
                        ],
                      },
                      {
                        content: [
                          {
                            id: "tf2",
                            type: "text",
                            props: { literal: "$10,000" },
                            style: { fontWeight: "bold" },
                            layout: { alignItems: "flex-end" },
                          },
                        ],
                      },
                    ],
                  },
                ],
                styleConfig: {
                  borderColor: "#cccccc",
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
    id: "table-nested-grouping",
    name: "Multi-level Dynamic Grouping",
    description: "Groups rows dynamically by two distinct paths.",
    category: "tables",
    tags: ["table", "mergeby", "multi-level"],
    schema: {
      ...baseDocument,
      data: {
        ...baseDocument.data,
        sales: [
          { region: "North", state: "NY", rep: "Alice", sales: 1500 },
          { region: "North", state: "NY", rep: "Bob", sales: 2000 },
          { region: "North", state: "PA", rep: "Charlie", sales: 1200 },
          { region: "South", state: "TX", rep: "Dave", sales: 3000 },
        ],
      },
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "nested-grouped-table",
              type: "table",
              bind: { path: "sales" },
              layout: { marginTop: 12 },
              props: {
                columns: [
                  {
                    headerText: "Region",
                    bindPath: "region",
                    mergeBy: ["region"],
                    flex: 1,
                    align: "center",
                  },
                  {
                    headerText: "State",
                    bindPath: "state",
                    mergeBy: ["region", "state"],
                    flex: 1,
                    align: "center",
                  },
                  { headerText: "Rep", bindPath: "rep", flex: 1 },
                  {
                    headerText: "Sales",
                    bindPath: "sales",
                    widthPx: 100,
                    align: "right",
                  },
                ],
                styleConfig: {
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
];
