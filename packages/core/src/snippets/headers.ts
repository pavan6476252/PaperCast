import { SchemaSnippet, baseDocument } from "./types";

export const headerSnippets: SchemaSnippet[] = [
  {
    id: "standard-corporate-header",
    name: "Standard Corporate Header",
    description: "Left-aligned logo, right-aligned company details.",
    category: "headers",
    tags: ["header", "corporate", "logo", "company"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "header-default",
            condition: "all",
            root: {
              id: "header-root",
              type: "root",
              layout: {
                direction: "column",
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 20,
              },
              children: [
                {
                  id: "top-row",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#d8d8d8",
                    paddingBottom: 16,
                  },
                  children: [
                    {
                      id: "logo",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/150/50",
                        fit: "contain",
                      },
                      layout: { width: 150, height: 50 },
                    },
                    {
                      id: "company-info",
                      type: "column",
                      layout: { alignItems: "flex-end", rowGap: 4 },
                      children: [
                        {
                          id: "company-name",
                          type: "text",
                          props: { literal: "Acme Corporation" },
                          style: { fontSizePx: 20, fontWeight: "bold" },
                          layout: {},
                        },
                        {
                          id: "address",
                          type: "text",
                          props: { literal: "123 Business Rd, Metropolis" },
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
    },
  },
  {
    id: "minimalist-header",
    name: "Minimalist Header",
    description: "Centered logo with a thin bottom border.",
    category: "headers",
    tags: ["header", "minimal", "centered"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "header-default",
            condition: "all",
            root: {
              id: "header-root",
              type: "root",
              layout: {
                direction: "column",
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 20,
              },
              children: [
                {
                  id: "header-row",
                  type: "row",
                  layout: {
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#eaeaea",
                    paddingBottom: 16,
                  },
                  children: [
                    {
                      id: "logo",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/120/40",
                        fit: "contain",
                      },
                      layout: { width: 120, height: 40 },
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "alternating-headers",
    name: "Alternating Headers (Even/Odd)",
    description:
      "Demonstrates FormCast's condition logic. Logo on left for even pages, right for odd pages.",
    category: "headers",
    tags: ["header", "alternating", "even", "odd", "conditions"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        body: {
          ...baseDocument.document.body,
          children: [
            {
              id: "page-1-text",
              type: "text",
              props: { literal: "This is page 1 (Odd). Look at the header." },
              layout: {},
            },
            {
              id: "page-break-spacer",
              type: "spacer",
              props: { sizePx: 1200 },
              layout: {},
            },
            {
              id: "page-2-text",
              type: "text",
              props: {
                literal:
                  "This is page 2 (Even). Notice the header logo flipped sides.",
              },
              layout: {},
            },
          ],
        },
        headers: {
          even: {
            id: "header-even",
            condition: "even",
            root: {
              id: "root-even",
              type: "root",
              layout: {
                direction: "column",
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 20,
              },
              children: [
                {
                  id: "row-even",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#eaeaea",
                    paddingBottom: 16,
                  },
                  children: [
                    {
                      id: "title-even",
                      type: "text",
                      props: { literal: "Annual Report 2026" },
                      style: { color: "#888888" },
                      layout: {},
                    },
                    {
                      id: "logo-even",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/100/30",
                        fit: "contain",
                      },
                      layout: { width: 100, height: 30 },
                    },
                  ],
                },
              ],
            },
          },
          odd: {
            id: "header-odd",
            condition: "odd",
            root: {
              id: "root-odd",
              type: "root",
              layout: {
                direction: "column",
                paddingLeft: 40,
                paddingRight: 40,
                paddingTop: 20,
              },
              children: [
                {
                  id: "row-odd",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBottomColor: "#eaeaea",
                    paddingBottom: 16,
                  },
                  children: [
                    {
                      id: "logo-odd",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/100/30",
                        fit: "contain",
                      },
                      layout: { width: 100, height: 30 },
                    },
                    {
                      id: "title-odd",
                      type: "text",
                      props: { literal: "Annual Report 2026" },
                      style: { color: "#888888" },
                      layout: {},
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "legacy-report-header",
    name: "Legacy Report Header",
    description:
      "Classic double-border, center-aligned serif text, formal title.",
    category: "headers",
    tags: ["header", "legacy", "formal", "serif"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 140 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Times New Roman, serif" } } },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h1",
            condition: "all",
            heightPx: 100,
            root: {
              id: "h1-r",
              type: "column",
              layout: {
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 4,
                borderBottomStyle: "solid",
                borderBottomColor: "#000",
                paddingBottom: 10,
                paddingTop: 10,
                paddingLeft: 40,
                paddingRight: 40,
              },
              children: [
                {
                  id: "h1-t",
                  type: "text",
                  props: { literal: "CONFIDENTIAL MEMORANDUM" },
                  style: { fontSizePx: 18, fontWeight: "bold" },
                  layout: {},
                },
                {
                  id: "h1-st",
                  type: "text",
                  props: { literal: "Department of Internal Affairs" },
                  style: { fontSizePx: 12 },
                  layout: {},
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "modern-saas-header",
    name: "Modern SaaS Header",
    description:
      "Clean sans-serif, flex-spaced layout, colored accents, minimalist.",
    category: "headers",
    tags: ["header", "modern", "saas", "clean"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 120 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Inter, sans-serif" } } },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h2",
            condition: "all",
            heightPx: 80,
            root: {
              id: "h2-r",
              type: "row",
              layout: {
                justifyContent: "space-between",
                alignItems: "center",

                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 15,
                paddingBottom: 15,
              },
              children: [
                {
                  id: "h2-l",
                  type: "row",
                  layout: { alignItems: "center", columnGap: 10 },
                  children: [
                    {
                      id: "h2-logo",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/32",
                        fit: "contain",
                      },
                      layout: { width: 32, height: 32 },
                    },
                    {
                      id: "h2-name",
                      type: "text",
                      props: { literal: "SaaSFlow" },
                      style: {
                        fontSizePx: 16,
                        fontWeight: "bold",
                        color: "#0f172a",
                      },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "h2-r",
                  type: "text",
                  props: { literal: "Workspace Report" },
                  style: {
                    fontSizePx: 12,
                    color: "#64748b",
                    fontWeight: "bold",
                  },
                  layout: {},
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "advanced-tech-header",
    name: "Advanced Tech Header",
    description: "Dark mode theme, monospaced fonts, system status metadata.",
    category: "headers",
    tags: ["header", "tech", "dark", "mono"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 130 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: {
        defaults: {
          base: { fontFamily: "Courier New, monospace", color: "#00ff00" },
        },
      },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h3",
            condition: "all",
            heightPx: 90,
            root: {
              id: "h3-r",
              type: "column",
              layout: {
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 15,
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#333",
                borderBottomStyle: "solid",
              },
              children: [
                {
                  id: "h3-r1",
                  type: "row",
                  layout: { justifyContent: "space-between" },
                  children: [
                    {
                      id: "h3-sys",
                      type: "text",
                      props: { literal: "SYS.INIT // TERMINAL_OUTPUT" },
                      layout: {},
                    },
                    {
                      id: "h3-ts",
                      type: "text",
                      props: { literal: "TS: {{timestamp}}" },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "h3-r2",
                  type: "row",
                  layout: { justifyContent: "space-between" },
                  children: [
                    {
                      id: "h3-env",
                      type: "text",
                      props: { literal: "ENV: PRODUCTION" },
                      style: { color: "#888" },
                      layout: {},
                    },
                    {
                      id: "h3-bld",
                      type: "text",
                      props: { literal: "BUILD: v2.4.9-rc" },
                      style: { color: "#888" },
                      layout: {},
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "complex-enterprise-header",
    name: "Complex Enterprise Header",
    description:
      "Multi-column grid containing company logo, document metadata, barcode placeholder.",
    category: "headers",
    tags: ["header", "enterprise", "complex", "metadata"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 700, heightPx: 160 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h4",
            condition: "all",
            heightPx: 120,
            root: {
              id: "h4-r",
              type: "row",
              layout: {
                justifyContent: "space-between",
                borderBottomWidth: 2,
                borderBottomColor: "#003366",
                borderBottomStyle: "solid",
                paddingBottom: 10,
                paddingTop: 15,
                paddingLeft: 30,
                paddingRight: 30,
              },
              children: [
                {
                  id: "h4-c1",
                  type: "column",
                  layout: { width: 150, justifyContent: "center" },
                  children: [
                    {
                      id: "h4-logo",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/120/40",
                        fit: "contain",
                      },
                      layout: { width: 120, height: 40 },
                    },
                  ],
                },
                {
                  id: "h4-c2",
                  type: "column",
                  layout: {
                    width: 250,
                    rowGap: 4,
                    justifyContent: "center",
                    borderLeftWidth: 1,
                    borderLeftColor: "#eee",
                    borderLeftStyle: "solid",
                    paddingLeft: 15,
                  },
                  children: [
                    {
                      id: "h4-t1",
                      type: "text",
                      props: { literal: "Form: SEC-99A" },
                      style: { fontSizePx: 14, fontWeight: "bold" },
                      layout: {},
                    },
                    {
                      id: "h4-t2",
                      type: "text",
                      props: { literal: "Rev: 2026.1" },
                      style: { fontSizePx: 10, color: "#666" },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "h4-c3",
                  type: "column",
                  layout: {
                    width: 150,
                    alignItems: "flex-end",
                    justifyContent: "center",
                  },
                  children: [
                    {
                      id: "h4-bc",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/100/30",
                        fit: "contain",
                      },
                      layout: { width: 100, height: 30 },
                    },
                    {
                      id: "h4-bct",
                      type: "text",
                      props: { literal: "DOC-908123" },
                      style: { fontSizePx: 8 },
                      layout: {},
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "retail-receipt-header",
    name: "Retail Receipt Header",
    description: "Narrow format layout, centered text, dashed divider lines.",
    category: "headers",
    tags: ["header", "retail", "receipt", "narrow"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 300, heightPx: 160 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: {
        defaults: {
          base: {
            fontFamily: "monospace",
            fontSizePx: 11,
          },
        },
      },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h5",
            condition: "all",
            heightPx: 120,
            root: {
              id: "h5-r",
              type: "column",
              layout: {
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
              },
              children: [
                {
                  id: "h5-n",
                  type: "text",
                  props: { literal: "THE LOCAL GROCER" },
                  style: { fontSizePx: 16, fontWeight: "bold" },
                  layout: {},
                },
                {
                  id: "h5-a1",
                  type: "text",
                  props: { literal: "123 Main Street" },
                  layout: {},
                },
                {
                  id: "h5-a2",
                  type: "text",
                  props: { literal: "Springfield, OR 97477" },
                  layout: {},
                },
                {
                  id: "h5-tel",
                  type: "text",
                  props: { literal: "(555) 123-4567" },
                  layout: {},
                },
                {
                  id: "h5-div",
                  type: "text",
                  props: { literal: "------------------------" },
                  layout: {},
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "healthcare-patient-header",
    name: "Healthcare Patient Header",
    description:
      "High-contrast, dense grid with patient demographics (DOB, MRN).",
    category: "headers",
    tags: ["header", "healthcare", "medical", "patient"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 150 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Arial, sans-serif" } } },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h6",
            condition: "all",
            heightPx: 110,
            root: {
              id: "h6-r",
              type: "row",
              layout: {
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 15,
                paddingBottom: 15,
                borderBottomWidth: 3,
                borderBottomColor: "#0284c7",
                borderBottomStyle: "solid",
                justifyContent: "space-between",
              },
              children: [
                {
                  id: "h6-l",
                  type: "column",
                  layout: { rowGap: 4 },
                  children: [
                    {
                      id: "h6-n",
                      type: "text",
                      props: { literal: "Patient: DOE, JOHN A." },
                      style: {
                        fontSizePx: 14,
                        fontWeight: "bold",
                        color: "#0369a1",
                      },
                      layout: {},
                    },
                    {
                      id: "h6-dob",
                      type: "text",
                      props: { literal: "DOB: 1980-05-15 (46Y)  Gender: M" },
                      style: { fontSizePx: 11 },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "h6-r2",
                  type: "column",
                  layout: { rowGap: 4, alignItems: "flex-end" },
                  children: [
                    {
                      id: "h6-mrn",
                      type: "text",
                      props: { literal: "MRN: 998877665" },
                      style: { fontSizePx: 12, fontWeight: "bold" },
                      layout: {},
                    },
                    {
                      id: "h6-enc",
                      type: "text",
                      props: { literal: "Encounter: 100234" },
                      style: { fontSizePx: 11 },
                      layout: {},
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "academic-running-head",
    name: "Academic Running Head",
    description:
      "Simple flex-between layout with a short title on the left and page number on the right.",
    category: "headers",
    tags: ["header", "academic", "running-head", "serif"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 100 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: {
        defaults: {
          base: { fontFamily: "Times New Roman, serif", fontSizePx: 12 },
        },
      },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h7",
            condition: "all",
            heightPx: 60,
            root: {
              id: "h7-r",
              type: "row",
              layout: {
                justifyContent: "space-between",
                paddingTop: 30,
                paddingLeft: 50,
                paddingRight: 50,
              },
              children: [
                {
                  id: "h7-t",
                  type: "text",
                  props: { literal: "EFFECTS OF MICROGRAVITY" },
                  layout: {},
                },
                {
                  id: "h7-p",
                  type: "text",
                  props: { literal: "{{pageNumber}}" },
                  layout: {},
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "creative-studio-header",
    name: "Creative Studio Header",
    description:
      "Bold typography, vibrant accent colors, left-aligned heavy emphasis.",
    category: "headers",
    tags: ["header", "creative", "bold", "vibrant"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 200 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Helvetica, sans-serif" } } },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h8",
            condition: "all",
            heightPx: 160,
            root: {
              id: "h8-r",
              type: "column",
              layout: {
                paddingTop: 40,
                paddingBottom: 20,
                paddingLeft: 40,
                paddingRight: 40,
              },
              children: [
                {
                  id: "h8-t1",
                  type: "text",
                  props: { literal: "STUDIO" },
                  style: { fontSizePx: 48, fontWeight: 900, color: "#000" },
                  layout: { minHeight: 1 },
                },
                {
                  id: "h8-t2",
                  type: "text",
                  props: { literal: "CREATIVE REPORT" },
                  style: {
                    fontSizePx: 24,
                    fontWeight: "bold",
                    color: "#e91e63",
                  },
                  layout: {},
                },
                {
                  id: "h8-div",
                  type: "spacer",
                  props: { sizePx: 20 },
                  layout: {},
                },
                {
                  id: "h8-t3",
                  type: "text",
                  props: { literal: "Q3 - 2026" },
                  style: { fontSizePx: 12, fontWeight: "bold" },
                  layout: {},
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "marketing-newsletter-header",
    name: "Marketing Newsletter Header",
    description: "Full-width style background block, bold title, date block.",
    category: "headers",
    tags: ["header", "marketing", "newsletter", "banner"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 180 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Arial, sans-serif" } } },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h9",
            condition: "all",
            heightPx: 140,
            root: {
              id: "h9-r",
              type: "column",
              layout: {
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 30,
                paddingBottom: 30,
              },
              children: [
                {
                  id: "h9-t",
                  type: "text",
                  props: { literal: "THE WEEKLY DIGEST" },
                  style: {
                    fontSizePx: 32,
                    fontWeight: "bold",
                    color: "#ffffff",
                  },
                  layout: {},
                },
                {
                  id: "h9-d",
                  type: "text",
                  props: {
                    literal: "Insights for the Modern Marketer | Vol. 42",
                  },
                  style: {
                    fontSizePx: 14,
                    color: "#c7d2fe",
                  },
                  layout: {},
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "government-form-header",
    name: "Government Form Header",
    description:
      "Strict grid, placeholder for official seal, form control numbers.",
    category: "headers",
    tags: ["header", "government", "official", "grid"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 220 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Times New Roman, serif" } } },
      document: {
        ...baseDocument.document,
        headers: {
          default: {
            id: "h10",
            condition: "all",
            heightPx: 180,
            root: {
              id: "h10-r",
              type: "row",
              layout: {
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#000",
                paddingBottom: 10,
                paddingTop: 20,
                paddingLeft: 30,
                paddingRight: 30,
                columnGap: 20,
              },
              children: [
                {
                  id: "h10-seal",
                  type: "image",
                  props: {
                    srcLiteral: "https://picsum.photos/80",
                    fit: "contain",
                  },
                  layout: { width: 80, height: 80 },
                },
                {
                  id: "h10-mid",
                  type: "column",
                  layout: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  children: [
                    {
                      id: "h10-dep",
                      type: "text",
                      props: { literal: "Department of Revenue" },
                      style: { fontSizePx: 14, fontWeight: "bold" },
                      layout: {},
                    },
                    {
                      id: "h10-title",
                      type: "text",
                      props: { literal: "OFFICIAL DECLARATION OF ASSETS" },
                      style: { fontSizePx: 18, fontWeight: "bold" },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "h10-right",
                  type: "column",
                  layout: {
                    width: 120,
                    borderLeftWidth: 1,
                    borderLeftColor: "#000",
                    borderLeftStyle: "solid",
                    paddingLeft: 10,
                    justifyContent: "center",
                  },
                  children: [
                    {
                      id: "h10-fno",
                      type: "text",
                      props: { literal: "Form: 1040-X" },
                      style: { fontSizePx: 12, fontWeight: "bold" },
                      layout: {},
                    },
                    {
                      id: "h10-omb",
                      type: "text",
                      props: { literal: "OMB No. 1234-5678" },
                      style: { fontSizePx: 10 },
                      layout: {},
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
  },
];
