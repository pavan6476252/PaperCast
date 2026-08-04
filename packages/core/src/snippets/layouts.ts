import { SchemaSnippet, baseDocument } from "./types";

export const layoutSnippets: SchemaSnippet[] = [
  {
    id: "two-column-split",
    name: "Two-Column Split",
    description:
      "A 50/50 split layout, perfect for side-by-side addresses or details.",
    category: "layouts",
    tags: ["layout", "columns", "split", "address"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "split-row",
              type: "row",
              layout: {
                alignItems: "flex-start",
                columnGap: 40,
              },
              children: [
                {
                  id: "col-left",
                  type: "column",
                  layout: { flex: 1, rowGap: 4 },
                  children: [
                    {
                      id: "left-title",
                      type: "text",
                      props: { literal: "Billing Address" },
                      style: { fontWeight: "bold" },
                      layout: { marginBottom: 8 },
                    },
                    {
                      id: "left-name",
                      type: "text",
                      props: { literal: "Bruce Wayne" },
                      layout: {},
                    },
                    {
                      id: "left-addr1",
                      type: "text",
                      props: { literal: "1007 Mountain Drive" },
                      layout: {},
                    },
                    {
                      id: "left-addr2",
                      type: "text",
                      props: { literal: "Gotham, NJ 07097" },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "col-right",
                  type: "column",
                  layout: { flex: 1, rowGap: 4 },
                  children: [
                    {
                      id: "right-title",
                      type: "text",
                      props: { literal: "Shipping Address" },
                      style: { fontWeight: "bold" },
                      layout: { marginBottom: 8 },
                    },
                    {
                      id: "right-name",
                      type: "text",
                      props: { literal: "Wayne Enterprises" },
                      layout: {},
                    },
                    {
                      id: "right-addr1",
                      type: "text",
                      props: { literal: "Wayne Tower, 1000th Floor" },
                      layout: {},
                    },
                    {
                      id: "right-addr2",
                      type: "text",
                      props: { literal: "Gotham, NJ 07098" },
                      layout: {},
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
  {
    id: "three-column-highlights",
    name: "Three-Column Highlights",
    description:
      "A row with three columns, useful for 'Key Statistics' or 'Summary' blocks.",
    category: "layouts",
    tags: ["layout", "columns", "summary", "stats"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "stats-row",
              type: "row",
              layout: {
                alignItems: "flex-start",
                justifyContent: "space-between",
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 24,
                paddingRight: 24,
                backgroundColor: "#f9f9f9",
              },
              children: [
                {
                  id: "stat-1",
                  type: "column",
                  layout: { flex: 1, rowGap: 4 },
                  children: [
                    {
                      id: "stat-1-label",
                      type: "text",
                      props: { literal: "TOTAL AMOUNT" },
                      style: { color: "#666666", fontSizePx: 10 },
                      layout: {},
                    },
                    {
                      id: "stat-1-value",
                      type: "text",
                      props: { literal: "$12,450.00" },
                      style: { fontWeight: "bold", fontSizePx: 18 },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "stat-2",
                  type: "column",
                  layout: { flex: 1, rowGap: 4, alignItems: "center" },
                  children: [
                    {
                      id: "stat-2-label",
                      type: "text",
                      props: { literal: "DUE DATE" },
                      style: { color: "#666666", fontSizePx: 10 },
                      layout: {},
                    },
                    {
                      id: "stat-2-value",
                      type: "text",
                      props: { literal: "Oct 24, 2026" },
                      style: { fontWeight: "bold", fontSizePx: 18 },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "stat-3",
                  type: "column",
                  layout: { flex: 1, rowGap: 4, alignItems: "flex-end" },
                  children: [
                    {
                      id: "stat-3-label",
                      type: "text",
                      props: { literal: "INVOICE #" },
                      style: { color: "#666666", fontSizePx: 10 },
                      layout: {},
                    },
                    {
                      id: "stat-3-value",
                      type: "text",
                      props: { literal: "INV-29934" },
                      style: { fontWeight: "bold", fontSizePx: 18 },
                      layout: {},
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
  {
    id: "signature-block",
    name: "Signature Block",
    description:
      "A structured area at the bottom of a document with lines for 'Authorized Signatory' and 'Date'.",
    category: "layouts",
    tags: ["layout", "signature", "bottom"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "signature-row",
              type: "row",
              layout: {
                justifyContent: "space-between",
                paddingTop: 60,
              },
              children: [
                {
                  id: "sig-left",
                  type: "column",
                  layout: { width: 200, rowGap: 8 },
                  children: [
                    {
                      id: "sig-line-left",
                      type: "spacer",
                      props: { sizePx: 1 },
                      layout: {
                        borderTopWidth: 1,
                        borderTopColor: "#000000",
                      },
                    },
                    {
                      id: "sig-text-left",
                      type: "text",
                      props: { literal: "Authorized Signatory" },
                      style: { fontSizePx: 10, color: "#666666" },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "sig-right",
                  type: "column",
                  layout: { width: 150, rowGap: 8 },
                  children: [
                    {
                      id: "sig-line-right",
                      type: "spacer",
                      props: { sizePx: 1 },
                      layout: {
                        borderTopWidth: 1,
                        borderTopColor: "#000000",
                      },
                    },
                    {
                      id: "sig-text-right",
                      type: "text",
                      props: { literal: "Date" },
                      style: { fontSizePx: 10, color: "#666666" },
                      layout: {},
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
  {
    id: "terms-and-conditions",
    name: "Terms & Conditions Block",
    description: "A small-text, multi-column layout for legal jargon.",
    category: "layouts",
    tags: ["layout", "terms", "legal", "columns"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "tc-title",
              type: "text",
              props: { literal: "Terms and Conditions" },
              style: { fontWeight: "bold", fontSizePx: 12, color: "#333333" },
              layout: { marginBottom: 12 },
            },
            {
              id: "tc-row",
              type: "row",
              layout: { columnGap: 24, alignItems: "flex-start" },
              children: [
                {
                  id: "tc-col-1",
                  type: "column",
                  layout: { flex: 1, rowGap: 8 },
                  children: [
                    {
                      id: "tc-1-1",
                      type: "text",
                      props: { literal: "1. Acceptance of Terms" },
                      style: { fontWeight: "bold", fontSizePx: 8 },
                      layout: {},
                    },
                    {
                      id: "tc-1-2",
                      type: "text",
                      props: {
                        literal:
                          "By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.",
                      },
                      style: { fontSizePx: 8, color: "#666666" },
                      layout: {},
                    },
                    {
                      id: "tc-1-3",
                      type: "text",
                      props: { literal: "2. Provision of Services" },
                      style: { fontWeight: "bold", fontSizePx: 8 },
                      layout: {},
                    },
                    {
                      id: "tc-1-4",
                      type: "text",
                      props: {
                        literal:
                          "We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.",
                      },
                      style: { fontSizePx: 8, color: "#666666" },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "tc-col-2",
                  type: "column",
                  layout: { flex: 1, rowGap: 8 },
                  children: [
                    {
                      id: "tc-2-1",
                      type: "text",
                      props: { literal: "3. Limitation of Liability" },
                      style: { fontWeight: "bold", fontSizePx: 8 },
                      layout: {},
                    },
                    {
                      id: "tc-2-2",
                      type: "text",
                      props: {
                        literal:
                          "In no event shall the company be liable for any direct, indirect, incidental, special, or consequential damages.",
                      },
                      style: { fontSizePx: 8, color: "#666666" },
                      layout: {},
                    },
                    {
                      id: "tc-2-3",
                      type: "text",
                      props: { literal: "4. Governing Law" },
                      style: { fontWeight: "bold", fontSizePx: 8 },
                      layout: {},
                    },
                    {
                      id: "tc-2-4",
                      type: "text",
                      props: {
                        literal:
                          "These terms and conditions are governed by and construed in accordance with the laws of the applicable jurisdiction.",
                      },
                      style: { fontSizePx: 8, color: "#666666" },
                      layout: {},
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
