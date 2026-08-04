import { WidgetRegistryItem, wrapHeader } from "../utils";
import {
  row,
  column,
  text,
  image,
  spacer,
  divider,
} from "@papercast/core/test";

export const headers: WidgetRegistryItem[] = [
  {
    id: "modern-header",
    categoryId: "headers",
    title: "Modern Minimal Headers",
    description: "A collection of clean, modern headers.",
    schema: wrapHeader(
      column([
        text("Variant 1: Logo Left", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        row(
          [
            image("company.logo", 120, 40),
            column(
              [
                text("company.name", {
                  fontWeight: "bold",
                  fontSizePx: 18,
                  textAlign: "right",
                }),
                text("company.website", { color: "#666", textAlign: "right" }),
              ],
              { alignItems: "flex-end", flexGrow: 1 }
            ),
          ],
          {
            justifyContent: "space-between",
            borderBottomWidth: 2,
            borderBottomColor: "#3b82f6",
            paddingBottom: 16,
          }
        ),

        spacer(40),

        text("Variant 2: Logo Right", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        row(
          [
            column(
              [
                text("company.name", { fontWeight: "bold", fontSizePx: 18 }),
                text("company.website", { color: "#666" }),
              ],
              { flexGrow: 1 }
            ),
            image("company.logo", 120, 40),
          ],
          {
            justifyContent: "space-between",
            borderBottomWidth: 2,
            borderBottomColor: "#10b981",
            paddingBottom: 16,
          }
        ),

        spacer(40),

        text("Variant 3: Subdued", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        row(
          [
            image("company.logo", 100, 33),
            column(
              [
                text("company.name", {
                  fontWeight: "bold",
                  fontSizePx: 16,
                  color: "#4b5563",
                  textAlign: "right",
                }),
                text("company.email", {
                  color: "#9ca3af",
                  textAlign: "right",
                  fontSizePx: 10,
                }),
              ],
              { alignItems: "flex-end", flexGrow: 1 }
            ),
          ],
          {
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
            paddingBottom: 16,
          }
        ),
      ]),
      450
    ),
  },
  {
    id: "centered-header",
    categoryId: "headers",
    title: "Centered Corporate Headers",
    description: "Traditional centered headers, perfect for formal letters.",
    schema: wrapHeader(
      column([
        text("Variant 1: Standard", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        column(
          [
            image("company.logo", 140, 50),
            spacer(12),
            text("company.name", {
              fontWeight: "bold",
              fontSizePx: 20,
              textAlign: "center",
            }),
            text("company.address1", { textAlign: "center", color: "#555" }),
            text("company.email", { textAlign: "center", color: "#555" }),
          ],
          {
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
            paddingBottom: 16,
          }
        ),

        spacer(40),

        text("Variant 2: Boxed Name", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        column(
          [
            image("company.logo", 100, 35),
            spacer(16),
            {
              ...row(
                [
                  text("company.name", {
                    fontWeight: "bold",
                    fontSizePx: 16,
                    color: "#fff",
                    textAlign: "center",
                  }),
                ],
                {
                  justifyContent: "center",
                  paddingTop: 8,
                  paddingBottom: 8,
                  width: 300,
                }
              ),
              layout: { backgroundColor: "#1f2937" },
            },
            spacer(12),
            text("company.address1", {
              textAlign: "center",
              color: "#555",
              fontSizePx: 10,
            }),
            text("company.email", {
              textAlign: "center",
              color: "#555",
              fontSizePx: 10,
            }),
          ],
          { alignItems: "center", justifyContent: "center" }
        ),

        spacer(40),

        text("Variant 3: Text Only", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        column(
          [
            text("company.name", {
              fontWeight: "bold",
              fontSizePx: 24,
              textAlign: "center",
              color: "#111827",
            }),
            spacer(4),
            text("company.address1 | company.address2", {
              textAlign: "center",
              color: "#4b5563",
              fontSizePx: 10,
            }),
            text("company.phone | company.email", {
              textAlign: "center",
              color: "#4b5563",
              fontSizePx: 10,
            }),
          ],
          {
            alignItems: "center",
            justifyContent: "center",
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderTopColor: "#111827",
            borderBottomColor: "#111827",
            paddingTop: 16,
            paddingBottom: 16,
          }
        ),
      ]),
      600
    ),
  },
  {
    id: "bold-accent-header",
    categoryId: "headers",
    title: "Bold Accent Headers",
    description: "Headers with strong background colors or thick borders.",
    schema: wrapHeader(
      column([
        text("Variant 1: Solid Dark Background", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        {
          ...row(
            [
              column(
                [
                  text("INVOICE", {
                    fontWeight: "bold",
                    fontSizePx: 28,
                    color: "#ffffff",
                  }),
                  text("invoice.number", { color: "#e2e8f0", fontSizePx: 12 }),
                ],
                { rowGap: 4 }
              ),
              image("company.logo", 100, 40),
            ],
            {
              justifyContent: "space-between",
              paddingTop: 32,
              paddingBottom: 32,
              paddingLeft: 40,
              paddingRight: 40,
              marginLeft: -40,
              marginRight: -40,
              marginTop: -20,
            }
          ),
          layout: { backgroundColor: "#0f172a" },
        },

        spacer(60),

        text("Variant 2: Thick Bottom Border", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        column(
          [
            row(
              [
                column(
                  [
                    text("INVOICE", {
                      fontWeight: "bold",
                      fontSizePx: 32,
                      color: "#1d4ed8",
                    }),
                    text("invoice.number", {
                      color: "#64748b",
                      fontSizePx: 14,
                    }),
                  ],
                  { rowGap: 4 }
                ),
                image("company.logo", 110, 45),
              ],
              { justifyContent: "space-between", paddingBottom: 24 }
            ),
          ],
          { borderBottomWidth: 8, borderBottomColor: "#1d4ed8" }
        ),
      ]),
      450
    ),
  },
  {
    id: "minimalist-two-column",
    categoryId: "headers",
    title: "Minimalist Two-Column Headers",
    description:
      "Extremely clean headers emphasizing typography without logos.",
    schema: wrapHeader(
      column([
        text("Variant 1: Standard Split", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        row(
          [
            column(
              [
                text("company.name", { fontWeight: "bold", fontSizePx: 24 }),
                text("company.address1", { color: "#888", fontSizePx: 10 }),
                text("company.email", { color: "#888", fontSizePx: 10 }),
              ],
              { rowGap: 2 }
            ),
            column(
              [
                text("INVOICE", {
                  fontWeight: "bold",
                  fontSizePx: 14,
                  textAlign: "right",
                  color: "#333",
                }),
                text("invoice.number", {
                  color: "#666",
                  textAlign: "right",
                  fontSizePx: 11,
                }),
                text("invoice.date", {
                  color: "#666",
                  textAlign: "right",
                  fontSizePx: 11,
                }),
              ],
              { alignItems: "flex-end", rowGap: 2 }
            ),
          ],
          { justifyContent: "space-between", paddingBottom: 24 }
        ),

        spacer(40),

        text("Variant 2: Flipped Split", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        row(
          [
            column(
              [
                text("INVOICE", {
                  fontWeight: "bold",
                  fontSizePx: 18,
                  color: "#111827",
                }),
                text("invoice.number", { color: "#4b5563", fontSizePx: 11 }),
                text("invoice.date", { color: "#4b5563", fontSizePx: 11 }),
              ],
              { rowGap: 2 }
            ),
            column(
              [
                text("company.name", {
                  fontWeight: "bold",
                  fontSizePx: 16,
                  textAlign: "right",
                }),
                text("company.address1", {
                  color: "#888",
                  fontSizePx: 10,
                  textAlign: "right",
                }),
                text("company.email", {
                  color: "#888",
                  fontSizePx: 10,
                  textAlign: "right",
                }),
              ],
              { alignItems: "flex-end", rowGap: 2 }
            ),
          ],
          {
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
            paddingBottom: 24,
          }
        ),
      ]),
      350
    ),
  },
  {
    id: "brand-accent-left",
    categoryId: "headers",
    title: "Brand Accent Left Headers",
    description:
      "Features a strong vertical brand color accent on the left side.",
    schema: wrapHeader(
      column([
        text("Variant 1: With Logo", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        row(
          [
            spacer(8),
            column(
              [
                text("company.name", { fontWeight: "bold", fontSizePx: 22 }),
                text("company.website", { color: "#6366f1" }),
              ],
              { flexGrow: 1, paddingLeft: 16 }
            ),
            image("company.logo", 100, 40),
          ],
          {
            justifyContent: "space-between",
            borderLeftWidth: 6,
            borderLeftColor: "#6366f1",
            paddingBottom: 16,
            paddingTop: 4,
          }
        ),

        spacer(40),

        text("Variant 2: Typography Focused", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        row(
          [
            spacer(8),
            column(
              [
                text("company.name", {
                  fontWeight: "bold",
                  fontSizePx: 28,
                  color: "#111827",
                }),
                text("company.address1", { color: "#4b5563", fontSizePx: 11 }),
                text("company.email", { color: "#4b5563", fontSizePx: 11 }),
              ],
              { flexGrow: 1, paddingLeft: 24 }
            ),
          ],
          {
            borderLeftWidth: 8,
            borderLeftColor: "#10b981",
            paddingBottom: 8,
            paddingTop: 8,
          }
        ),
      ]),
      350
    ),
  },
  {
    id: "detailed-invoice-header",
    categoryId: "headers",
    title: "Detailed Invoice Headers",
    description:
      "Compact headers packed with company, customer, and invoice meta-data.",
    schema: wrapHeader(
      column([
        text("Variant 1: 3-Column Meta Data", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        column(
          [
            row(
              [
                image("company.logo", 120, 40),
                column(
                  [
                    text("TAX INVOICE", {
                      fontWeight: "bold",
                      fontSizePx: 24,
                      textAlign: "right",
                    }),
                    text("invoice.number", {
                      textAlign: "right",
                      color: "#555",
                    }),
                  ],
                  { alignItems: "flex-end" }
                ),
              ],
              { justifyContent: "space-between" }
            ),
            spacer(24),
            row(
              [
                column(
                  [
                    text("FROM", {
                      fontSizePx: 10,
                      color: "#888",
                      fontWeight: "bold",
                    }),
                    text("company.name", { fontWeight: "bold" }),
                    text("company.address1"),
                    text("company.email"),
                  ],
                  { flexGrow: 1 }
                ),
                column(
                  [
                    text("BILL TO", {
                      fontSizePx: 10,
                      color: "#888",
                      fontWeight: "bold",
                    }),
                    text("customer.name", { fontWeight: "bold" }),
                    text("customer.address"),
                    text("customer.email"),
                  ],
                  { flexGrow: 1 }
                ),
                column(
                  [
                    text("DETAILS", {
                      fontSizePx: 10,
                      color: "#888",
                      fontWeight: "bold",
                      textAlign: "right",
                    }),
                    text("Date: {{invoice.date}}", { textAlign: "right" }),
                    text("Due: {{invoice.dueDate}}", { textAlign: "right" }),
                    text("Total: {{invoice.total}}", {
                      textAlign: "right",
                      fontWeight: "bold",
                    }),
                  ],
                  { flexGrow: 1, alignItems: "flex-end" }
                ),
              ],
              { justifyContent: "space-between" }
            ),
          ],
          { borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 24 }
        ),

        spacer(40),

        text("Variant 2: Side-by-Side Split", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        column(
          [
            row(
              [
                column(
                  [
                    image("company.logo", 100, 33),
                    spacer(16),
                    text("FROM", {
                      fontSizePx: 10,
                      color: "#888",
                      fontWeight: "bold",
                    }),
                    text("company.name", { fontWeight: "bold" }),
                    text("company.address1"),
                  ],
                  { flexGrow: 1 }
                ),
                column(
                  [
                    text("INVOICE", {
                      fontWeight: "bold",
                      fontSizePx: 28,
                      textAlign: "right",
                      color: "#0f172a",
                    }),
                    text("invoice.number", {
                      textAlign: "right",
                      color: "#64748b",
                    }),
                    spacer(16),
                    text("BILL TO", {
                      fontSizePx: 10,
                      color: "#888",
                      fontWeight: "bold",
                      textAlign: "right",
                    }),
                    text("customer.name", {
                      fontWeight: "bold",
                      textAlign: "right",
                    }),
                    text("customer.address", { textAlign: "right" }),
                  ],
                  { flexGrow: 1, alignItems: "flex-end" }
                ),
              ],
              { justifyContent: "space-between" }
            ),
          ],
          {
            borderBottomWidth: 2,
            borderBottomColor: "#cbd5e1",
            paddingBottom: 24,
          }
        ),
      ]),
      550
    ),
  },
  {
    id: "elegant-serif-header",
    categoryId: "headers",
    title: "Elegant Serif Headers",
    description: "Luxurious and spacious headers using serif fonts.",
    schema: wrapHeader(
      column([
        text("Variant 1: Centered", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        column(
          [
            text("company.name", {
              fontFamily: "Georgia, serif",
              fontSizePx: 32,
              textAlign: "center",
              color: "#111",
            }),
            spacer(8),
            row(
              [
                text("company.address1", {
                  fontFamily: "Georgia, serif",
                  fontSizePx: 11,
                  color: "#444",
                }),
                text("  •  ", { color: "#ccc" }),
                text("company.phone", {
                  fontFamily: "Georgia, serif",
                  fontSizePx: 11,
                  color: "#444",
                }),
                text("  •  ", { color: "#ccc" }),
                text("company.website", {
                  fontFamily: "Georgia, serif",
                  fontSizePx: 11,
                  color: "#444",
                }),
              ],
              { justifyContent: "center" }
            ),
            spacer(24),
            divider(),
          ],
          { alignItems: "center" }
        ),

        spacer(40),

        text("Variant 2: Left Aligned with Divider", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        column([
          text("company.name", {
            fontFamily: "Georgia, serif",
            fontSizePx: 28,
            color: "#000",
          }),
          spacer(8),
          divider(),
          spacer(8),
          row([
            text("company.address1", {
              fontFamily: "Georgia, serif",
              fontSizePx: 11,
              color: "#666",
            }),
            text(" | ", { color: "#ccc" }),
            text("company.email", {
              fontFamily: "Georgia, serif",
              fontSizePx: 11,
              color: "#666",
            }),
          ]),
        ]),
      ]),
      350
    ),
  },
  {
    id: "dark-mode-header",
    categoryId: "headers",
    title: "Dark Mode Tech Headers",
    description: "Dark theme headers suitable for tech companies.",
    schema: wrapHeader(
      column([
        text("Variant 1: Slate Blue", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        {
          ...row(
            [
              column([
                text("company.name", {
                  fontWeight: "bold",
                  fontSizePx: 20,
                  color: "#f8fafc",
                }),
                text("company.email", { color: "#94a3b8", fontSizePx: 11 }),
              ]),
              column(
                [
                  text("STATEMENT", {
                    fontWeight: "bold",
                    fontSizePx: 14,
                    color: "#38bdf8",
                    textAlign: "right",
                  }),
                  text("invoice.date", {
                    color: "#94a3b8",
                    fontSizePx: 11,
                    textAlign: "right",
                  }),
                ],
                { alignItems: "flex-end" }
              ),
            ],
            {
              justifyContent: "space-between",
              paddingTop: 32,
              paddingBottom: 32,
              paddingLeft: 32,
              paddingRight: 32,
              borderBottomWidth: 4,
              borderBottomColor: "#38bdf8",
            }
          ),
          layout: { backgroundColor: "#1e293b" },
        },

        spacer(40),

        text("Variant 2: Deep Onyx", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        {
          ...column(
            [
              row(
                [
                  image("company.logo", 100, 33),
                  text("INVOICE", {
                    fontWeight: "bold",
                    fontSizePx: 16,
                    color: "#10b981",
                    textAlign: "right",
                  }),
                ],
                { justifyContent: "space-between", alignItems: "center" }
              ),
              spacer(16),
              row(
                [
                  text("company.name", { color: "#d1d5db", fontSizePx: 12 }),
                  text("invoice.number", {
                    color: "#9ca3af",
                    fontSizePx: 12,
                    textAlign: "right",
                  }),
                ],
                { justifyContent: "space-between" }
              ),
            ],
            {
              paddingTop: 24,
              paddingBottom: 24,
              paddingLeft: 32,
              paddingRight: 32,
              borderTopWidth: 2,
              borderTopColor: "#10b981",
            }
          ),
          layout: { backgroundColor: "#111827" },
        },
      ]),
      400
    ),
  },
  {
    id: "clinical-header",
    categoryId: "headers",
    title: "Clinical / Medical Headers",
    description: "Strict and structured headers used in medical records.",
    schema: wrapHeader(
      column([
        text("Variant 1: Standard Summary", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        column([
          row(
            [
              image("company.logo", 80, 40),
              column(
                [
                  text("company.name", { fontWeight: "bold", fontSizePx: 18 }),
                  text("Clinical Summary Report", {
                    color: "#666",
                    fontSizePx: 12,
                  }),
                ],
                { paddingLeft: 16 }
              ),
            ],
            { alignItems: "center" }
          ),
          spacer(16),
          row(
            [
              text("Patient Name: John Doe", {
                fontSizePx: 11,
                fontWeight: "bold",
              }),
              text("DOB: 1980-01-01", { fontSizePx: 11 }),
              text("MRN: 987654321", { fontSizePx: 11 }),
              text("Date: 2026-07-28", { fontSizePx: 11 }),
            ],
            {
              justifyContent: "space-between",
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderTopColor: "#000",
              borderBottomColor: "#000",
              paddingTop: 8,
              paddingBottom: 8,
            }
          ),
        ]),

        spacer(40),

        text("Variant 2: Red Alert Box", { color: "#9ca3af", fontSizePx: 10 }),
        spacer(8),
        column([
          row(
            [
              image("company.logo", 80, 40),
              column(
                [
                  text("company.name", { fontWeight: "bold", fontSizePx: 16 }),
                  text("Urgent Care Center", { color: "#666", fontSizePx: 11 }),
                ],
                { paddingLeft: 12, flexGrow: 1 }
              ),
              {
                ...column(
                  [
                    text("ALLERGIES: PENICILLIN", {
                      color: "#dc2626",
                      fontWeight: "bold",
                      fontSizePx: 11,
                    }),
                    text("BLOOD TYPE: O-", {
                      color: "#dc2626",
                      fontWeight: "bold",
                      fontSizePx: 11,
                    }),
                  ],
                  {
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 12,
                    paddingRight: 12,
                    borderTopWidth: 2,
                    borderBottomWidth: 2,
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderTopColor: "#dc2626",
                    borderBottomColor: "#dc2626",
                    borderLeftColor: "#dc2626",
                    borderRightColor: "#dc2626",
                  }
                ),
                layout: { backgroundColor: "#fef2f2" },
              },
            ],
            { alignItems: "center", justifyContent: "space-between" }
          ),
          spacer(16),
          row(
            [
              text("Patient Name: John Doe", {
                fontSizePx: 11,
                fontWeight: "bold",
              }),
              text("DOB: 1980-01-01", { fontSizePx: 11 }),
              text("MRN: 987654321", { fontSizePx: 11 }),
            ],
            {
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderTopColor: "#ccc",
              borderBottomColor: "#ccc",
              paddingTop: 8,
              paddingBottom: 8,
            }
          ),
        ]),
      ]),
      450
    ),
  },
  {
    id: "creative-agency-header",
    categoryId: "headers",
    title: "Creative Agency Headers",
    description:
      "Playful layouts with large fonts and overlapping visual elements.",
    schema: wrapHeader(
      column([
        text("Variant 1: Neon Pink on White", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        row(
          [
            column(
              [
                text("HELLO.", {
                  fontWeight: "bold",
                  fontSizePx: 48,
                  color: "#ec4899",
                  lineHeight: 1,
                }),
                text("WE ARE {{company.name}}", {
                  fontWeight: "bold",
                  fontSizePx: 14,
                  color: "#1f2937",
                }),
              ],
              { flexGrow: 1 }
            ),
            column(
              [
                text("INVOICE", {
                  fontWeight: "bold",
                  fontSizePx: 16,
                  textAlign: "right",
                }),
                text("#{{invoice.number}}", {
                  color: "#6b7280",
                  textAlign: "right",
                }),
              ],
              { alignItems: "flex-end", justifyContent: "flex-end" }
            ),
          ],
          {
            justifyContent: "space-between",
            paddingBottom: 32,
            borderBottomWidth: 4,
            borderBottomColor: "#f3f4f6",
          }
        ),

        spacer(40),

        text("Variant 2: Neon Pink on Dark", {
          color: "#9ca3af",
          fontSizePx: 10,
        }),
        spacer(8),
        {
          ...row(
            [
              column(
                [
                  text("INVOICE", {
                    fontWeight: "bold",
                    fontSizePx: 42,
                    color: "#f472b6",
                    lineHeight: 1,
                  }),
                  text("creative works by {{company.name}}", {
                    color: "#9ca3af",
                    fontSizePx: 12,
                  }),
                ],
                { flexGrow: 1 }
              ),
              column(
                [
                  text("DATE", {
                    fontWeight: "bold",
                    fontSizePx: 10,
                    color: "#f472b6",
                    textAlign: "right",
                  }),
                  text("{{invoice.date}}", {
                    color: "#f9fafb",
                    textAlign: "right",
                  }),
                  spacer(8),
                  text("DUE", {
                    fontWeight: "bold",
                    fontSizePx: 10,
                    color: "#f472b6",
                    textAlign: "right",
                  }),
                  text("{{invoice.dueDate}}", {
                    color: "#f9fafb",
                    textAlign: "right",
                  }),
                ],
                { alignItems: "flex-end" }
              ),
            ],
            {
              justifyContent: "space-between",
              paddingTop: 32,
              paddingBottom: 32,
              paddingLeft: 40,
              paddingRight: 40,
            }
          ),
          layout: { backgroundColor: "#111827" },
        },
      ]),
      400
    ),
  },
];
