import { SchemaSnippet, baseDocument } from "./types";

export const footerSnippets: SchemaSnippet[] = [
  {
    id: "page-number-footer",
    name: "Page Number Footer",
    description: "Simple centered page number indicator.",
    category: "footers",
    tags: ["footer", "page-number", "centered"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "footer-default",
            condition: "all",
            root: {
              id: "footer-root",
              type: "root",
              layout: {
                direction: "column",
                paddingLeft: 40,
                paddingRight: 40,
                paddingBottom: 20,
              },
              children: [
                {
                  id: "footer-row",
                  type: "row",
                  layout: { justifyContent: "center", paddingTop: 16 },
                  children: [
                    {
                      id: "page-num",
                      type: "text",
                      props: {
                        literal: "Page {{pageNumber}} of {{pageCount}}",
                      },
                      style: { fontSizePx: 10, color: "#666666" },
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
    id: "legal-copyright-footer",
    name: "Legal / Copyright Footer",
    description: "Left-aligned copyright notice, right-aligned page number.",
    category: "footers",
    tags: ["footer", "legal", "copyright", "page-number"],
    schema: {
      ...baseDocument,
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "footer-default",
            condition: "all",
            root: {
              id: "footer-root",
              type: "root",
              layout: {
                direction: "column",
                paddingLeft: 40,
                paddingRight: 40,
                paddingBottom: 20,
              },
              children: [
                {
                  id: "footer-row",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                    borderTopWidth: 1,
                    borderTopColor: "#eaeaea",
                    paddingTop: 16,
                  },
                  children: [
                    {
                      id: "copyright-text",
                      type: "text",
                      props: {
                        literal: "© 2026 Acme Corp. All rights reserved.",
                      },
                      style: { fontSizePx: 10, color: "#666666" },
                      layout: {},
                    },
                    {
                      id: "page-num",
                      type: "text",
                      props: {
                        literal: "Page {{pageNumber}} of {{pageCount}}",
                      },
                      style: { fontSizePx: 10, color: "#666666" },
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
    id: "legacy-formal-footer",
    name: "Legacy Formal Footer",
    description: "Thick top border, simple centered pagination.",
    category: "footers",
    tags: ["footer", "legacy", "formal"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 120 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Times New Roman, serif" } } },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f1",
            condition: "all",
            heightPx: 80,
            root: {
              id: "f1-r",
              type: "row",
              layout: {
                justifyContent: "center",
                borderTopWidth: 2,
                borderTopStyle: "solid",
                paddingTop: 10,
                paddingBottom: 20,
              },
              children: [
                {
                  id: "f1-t",
                  type: "text",
                  props: { literal: "- {{pageNumber}} -" },
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
    id: "modern-ui-footer",
    name: "Modern UI Footer",
    description:
      "Subtle gray text, flex-spaced branding, and minimalist contact info.",
    category: "footers",
    tags: ["footer", "modern", "ui", "minimal"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 100 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Inter, sans-serif" } } },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f2",
            condition: "all",
            heightPx: 60,
            root: {
              id: "f2-r",
              type: "row",
              layout: {
                justifyContent: "space-between",
                paddingTop: 15,
                paddingBottom: 15,
                paddingLeft: 30,
                paddingRight: 30,
                backgroundColor: "#f8fafc",
              },
              children: [
                {
                  id: "f2-l",
                  type: "text",
                  props: { literal: "© 2026 SaaSFlow Inc." },
                  style: { fontSizePx: 10, color: "#94a3b8" },
                  layout: {},
                },
                {
                  id: "f2-r2",
                  type: "text",
                  props: {
                    literal: "hello@saasflow.com | Page {{pageNumber}}",
                  },
                  style: { fontSizePx: 10, color: "#94a3b8" },
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
    id: "advanced-tech-footer",
    name: "Advanced Tech Footer",
    description:
      "Technical metadata including Git commit hash, build date, and machine ID.",
    category: "footers",
    tags: ["footer", "tech", "advanced", "metadata"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 110 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Courier New, monospace" } } },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f3",
            condition: "all",
            heightPx: 70,
            root: {
              id: "f3-r",
              type: "row",
              layout: {
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderTopStyle: "dashed",
                borderTopColor: "#4ade80",
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: "#0f172a",
              },
              children: [
                {
                  id: "f3-l",
                  type: "column",
                  layout: { rowGap: 2 },
                  children: [
                    {
                      id: "f3-h",
                      type: "text",
                      props: { literal: "HASH: {{commitHash}}" },
                      style: { fontSizePx: 9, color: "#4ade80" },
                      layout: {},
                    },
                    {
                      id: "f3-m",
                      type: "text",
                      props: { literal: "NODE: {{machineId}}" },
                      style: { fontSizePx: 9, color: "#4ade80" },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "f3-r2",
                  type: "text",
                  props: { literal: "PG {{pageNumber}}/{{pageCount}}" },
                  style: { fontSizePx: 10, color: "#4ade80" },
                  layout: {
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "complex-enterprise-footer",
    name: "Complex Enterprise Footer",
    description:
      "Multi-line confidentiality warning, legal entity details, registered address.",
    category: "footers",
    tags: ["footer", "enterprise", "complex", "legal"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 160 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Arial, sans-serif" } } },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f4",
            condition: "all",
            heightPx: 120,
            root: {
              id: "f4-r",
              type: "column",
              layout: {
                alignItems: "center",
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#cccccc",
                paddingTop: 15,
                paddingBottom: 15,
                paddingLeft: 40,
                paddingRight: 40,
                rowGap: 6,
              },
              children: [
                {
                  id: "f4-t1",
                  type: "text",
                  props: { literal: "CONFIDENTIAL AND PROPRIETARY" },
                  style: { fontSizePx: 10, fontWeight: "bold", color: "#666" },
                  layout: {},
                },
                {
                  id: "f4-t2",
                  type: "text",
                  props: {
                    literal:
                      "This document contains trade secrets and is the property of Global Enterprise Corp. Any unauthorized reproduction, distribution, or disclosure is strictly prohibited.",
                  },
                  style: { fontSizePx: 8, color: "#999", textAlign: "center" },
                  layout: {},
                },
                {
                  id: "f4-t3",
                  type: "text",
                  props: {
                    literal:
                      "Global Enterprise Corp | 100 Corporate Plaza | New York, NY 10001",
                  },
                  style: { fontSizePx: 8, color: "#666" },
                  layout: {},
                },
                {
                  id: "f4-t4",
                  type: "text",
                  props: { literal: "Page {{pageNumber}} of {{pageCount}}" },
                  style: { fontSizePx: 9, fontWeight: "bold" },
                  layout: { marginTop: 5 },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    id: "retail-receipt-footer",
    name: "Retail Receipt Footer",
    description:
      "Return policy text, store hours, and barcode/QR code placeholder.",
    category: "footers",
    tags: ["footer", "retail", "receipt", "narrow"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 300, heightPx: 220 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: {
        defaults: { base: { fontFamily: "monospace", textAlign: "center" } },
      },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f5",
            condition: "all",
            heightPx: 180,
            root: {
              id: "f5-r",
              type: "column",
              layout: {
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
                rowGap: 8,
              },
              children: [
                {
                  id: "f5-d1",
                  type: "text",
                  props: { literal: "************************" },
                  layout: {},
                },
                {
                  id: "f5-t1",
                  type: "text",
                  props: { literal: "RETURN POLICY:" },
                  style: { fontSizePx: 10, fontWeight: "bold" },
                  layout: {},
                },
                {
                  id: "f5-t2",
                  type: "text",
                  props: {
                    literal:
                      "Returns accepted within 30 days with original receipt.",
                  },
                  style: { fontSizePx: 9 },
                  layout: {},
                },
                {
                  id: "f5-t3",
                  type: "text",
                  props: {
                    literal: "Store Hours: Mon-Sat 9AM-9PM, Sun 10AM-6PM",
                  },
                  style: { fontSizePx: 9 },
                  layout: {},
                },
                {
                  id: "f5-bc",
                  type: "image",
                  props: {
                    srcLiteral: "https://picsum.photos/150/40",
                    fit: "contain",
                  },
                  layout: { width: 150, height: 40, marginTop: 10 },
                },
                {
                  id: "f5-tx",
                  type: "text",
                  props: { literal: "TXN: {{transactionId}}" },
                  style: { fontSizePx: 9 },
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
    id: "healthcare-compliance-footer",
    name: "Healthcare Compliance Footer",
    description:
      "HIPAA compliance warning, electronic signature timestamp, small font.",
    category: "footers",
    tags: ["footer", "healthcare", "medical", "compliance"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 130 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Arial, sans-serif" } } },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f6",
            condition: "all",
            heightPx: 90,
            root: {
              id: "f6-r",
              type: "row",
              layout: {
                justifyContent: "space-between",
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 20,
                paddingRight: 20,
                borderTopWidth: 2,
                borderTopStyle: "solid",
                borderTopColor: "#0284c7",
              },
              children: [
                {
                  id: "f6-c1",
                  type: "column",
                  layout: { width: 400, rowGap: 2 },
                  children: [
                    {
                      id: "f6-hipaa",
                      type: "text",
                      props: { literal: "NOTICE OF PRIVACY PRACTICES (HIPAA)" },
                      style: {
                        fontSizePx: 8,
                        fontWeight: "bold",
                        color: "#555",
                      },
                      layout: {},
                    },
                    {
                      id: "f6-warn",
                      type: "text",
                      props: {
                        literal:
                          "This document contains protected health information (PHI). Unauthorized access or disclosure is a violation of federal law.",
                      },
                      style: { fontSizePx: 7, color: "#777" },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "f6-c2",
                  type: "column",
                  layout: {
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  },
                  children: [
                    {
                      id: "f6-sig",
                      type: "text",
                      props: {
                        literal: "Electronically Signed: {{doctorName}}",
                      },
                      style: { fontSizePx: 9, fontWeight: "bold" },
                      layout: {},
                    },
                    {
                      id: "f6-ts",
                      type: "text",
                      props: { literal: "{{timestamp}}" },
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
    id: "academic-footnote-block",
    name: "Academic Footnote Block",
    description:
      "Top border, small serif text simulating citations or footnotes.",
    category: "footers",
    tags: ["footer", "academic", "footnote", "serif"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 120 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Times New Roman, serif" } } },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f7",
            condition: "all",
            heightPx: 80,
            root: {
              id: "f7-r",
              type: "column",
              layout: {
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#000",
                paddingTop: 10,
                paddingBottom: 20,
                paddingLeft: 40,
                paddingRight: 40,
                rowGap: 4,
              },
              children: [
                {
                  id: "f7-fn1",
                  type: "text",
                  props: {
                    literal:
                      "1. Smith, J. (2025). The Effects of Microgravity on Cellular Structure. Journal of Space Medicine, 12(4), 45-60.",
                  },
                  style: { fontSizePx: 9 },
                  layout: {},
                },
                {
                  id: "f7-fn2",
                  type: "text",
                  props: {
                    literal:
                      "2. See Appendix B for detailed statistical analysis and methodology.",
                  },
                  style: { fontSizePx: 9 },
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
    id: "creative-studio-footer",
    name: "Creative Studio Footer",
    description:
      "Colorful background strip, portfolio links, social media handles.",
    category: "footers",
    tags: ["footer", "creative", "vibrant", "social"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 120 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Helvetica, sans-serif" } } },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f8",
            condition: "all",
            heightPx: 80,
            root: {
              id: "f8-r",
              type: "row",
              layout: {
                backgroundColor: "#e91e63",
                paddingTop: 15,
                paddingBottom: 15,
                paddingLeft: 30,
                paddingRight: 30,
                justifyContent: "space-between",
                alignItems: "center",
              },
              children: [
                {
                  id: "f8-l",
                  type: "text",
                  props: { literal: "studio.design" },
                  style: { fontSizePx: 14, fontWeight: "bold", color: "#fff" },
                  layout: {},
                },
                {
                  id: "f8-c",
                  type: "text",
                  props: { literal: "PORTFOLIO | ABOUT | CONTACT" },
                  style: { fontSizePx: 10, color: "#fff", fontWeight: "bold" },
                  layout: {},
                },
                {
                  id: "f8-r2",
                  type: "row",
                  layout: { columnGap: 8 },
                  children: [
                    {
                      id: "f8-i1",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/16",
                        fit: "contain",
                      },
                      layout: { width: 16, height: 16, borderRadius: 8 },
                    },
                    {
                      id: "f8-i2",
                      type: "image",
                      props: {
                        srcLiteral: "https://picsum.photos/16",
                        fit: "contain",
                      },
                      layout: { width: 16, height: 16, borderRadius: 8 },
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
    id: "marketing-newsletter-footer",
    name: "Marketing Newsletter Footer",
    description:
      "Unsubscribe compliance text, physical mailing address, centered.",
    category: "footers",
    tags: ["footer", "marketing", "newsletter", "compliance"],
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
        footers: {
          default: {
            id: "f9",
            condition: "all",
            heightPx: 110,
            root: {
              id: "f9-r",
              type: "column",
              layout: {
                backgroundColor: "#f3f4f6",
                alignItems: "center",
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 30,
                paddingRight: 30,
                rowGap: 8,
              },
              children: [
                {
                  id: "f9-soc",
                  type: "text",
                  props: { literal: "Follow us @TheWeeklyDigest" },
                  style: {
                    fontSizePx: 12,
                    fontWeight: "bold",
                    color: "#4f46e5",
                  },
                  layout: {},
                },
                {
                  id: "f9-addr",
                  type: "text",
                  props: {
                    literal:
                      "123 Marketing Way, Suite 400, San Francisco, CA 94105",
                  },
                  style: { fontSizePx: 10, color: "#6b7280" },
                  layout: {},
                },
                {
                  id: "f9-uns",
                  type: "text",
                  props: {
                    literal:
                      "Don't want to receive these emails? Unsubscribe here.",
                  },
                  style: { fontSizePx: 9, color: "#9ca3af" },
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
    id: "government-form-footer",
    name: "Government Form Footer",
    description:
      "Form revision date, control number, right-aligned pagination.",
    category: "footers",
    tags: ["footer", "government", "official", "grid"],
    schema: {
      ...baseDocument,
      meta: {
        pageSize: { widthPx: 600, heightPx: 110 },
        orientation: "portrait",
        baseUnit: "px",
        dpi: 96,
      },
      theme: { defaults: { base: { fontFamily: "Times New Roman, serif" } } },
      document: {
        ...baseDocument.document,
        footers: {
          default: {
            id: "f10",
            condition: "all",
            heightPx: 70,
            root: {
              id: "f10-r",
              type: "row",
              layout: {
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopStyle: "solid",
                borderTopColor: "#000",
                paddingTop: 10,
                paddingBottom: 15,
                paddingLeft: 30,
                paddingRight: 30,
              },
              children: [
                {
                  id: "f10-l",
                  type: "column",
                  layout: { rowGap: 2 },
                  children: [
                    {
                      id: "f10-rev",
                      type: "text",
                      props: { literal: "Rev. 10/2026" },
                      style: { fontSizePx: 10, fontWeight: "bold" },
                      layout: {},
                    },
                    {
                      id: "f10-frm",
                      type: "text",
                      props: { literal: "Form 1040-X" },
                      style: { fontSizePx: 9 },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "f10-r2",
                  type: "text",
                  props: { literal: "Page {{pageNumber}} / {{pageCount}}" },
                  style: { fontSizePx: 10, fontWeight: "bold" },
                  layout: {},
                },
              ],
            },
          },
        },
      },
    },
  },
];
