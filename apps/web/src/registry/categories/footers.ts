import { WidgetRegistryItem, wrapFooter } from "../utils";
import {
  row,
  column,
  text,
  spacer,
  divider,
  paragraph,
} from "@papercast/core/test";

export const footers: WidgetRegistryItem[] = [
  {
    id: "simple-footer",
    categoryId: "footers",
    title: "Simple Page Number Footer",
    description:
      "A very minimal footer showing just the copyright and page number.",
    schema: wrapFooter(
      row(
        [
          text("company.name", { color: "#94a3b8", fontSizePx: 10 }),
          text("Page {{pageNumber}}", { color: "#94a3b8", fontSizePx: 10 }),
        ],
        {
          justifyContent: "space-between",
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          paddingTop: 16,
        }
      ),
      80
    ),
  },
  {
    id: "bank-details-footer",
    categoryId: "footers",
    title: "Bank Details Footer",
    description:
      "Often used on the last page of an invoice to provide payment instructions.",
    schema: wrapFooter(
      {
        ...column(
          [
            text("Payment Details", { fontWeight: "bold", fontSizePx: 12 }),
            spacer(8),
            row([
              column(
                [
                  text("Bank:", { color: "#64748b" }),
                  text("Account:", { color: "#64748b" }),
                  text("Routing:", { color: "#64748b" }),
                ],
                { rowGap: 4, width: 80 }
              ),
              column(
                [text("Chase Bank"), text("000123456789"), text("123456789")],
                { rowGap: 4 }
              ),
            ]),
          ],
          {
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 16,
            paddingRight: 16,
          }
        ),
        layout: { backgroundColor: "#f8fafc" },
      },
      140
    ),
  },
  {
    id: "legal-footer",
    categoryId: "footers",
    title: "Legal Disclaimer Footer",
    description:
      "Small print text commonly found at the bottom of legal agreements.",
    schema: wrapFooter(
      {
        ...column([
          divider(),
          spacer(8),
          paragraph(
            "This document is confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this document in error please notify the system manager. This message contains confidential information and is intended only for the individual named."
          ),
        ]),
        style: { color: "#94a3b8", fontSizePx: 8, lineHeight: 1.2 },
      },
      120
    ),
  },
  {
    id: "signature-footer",
    categoryId: "footers",
    title: "Signature Block Footer",
    description: "Standard dual signature block for agreements and contracts.",
    schema: wrapFooter(
      row(
        [
          column(
            [
              divider(),
              spacer(4),
              text("Authorized Signature", { fontWeight: "bold" }),
              text("Date: _______________", {
                color: "#64748b",
                fontSizePx: 10,
              }),
            ],
            { width: 200 }
          ),
          column(
            [
              divider(),
              spacer(4),
              text("Client Signature", { fontWeight: "bold" }),
              text("Date: _______________", {
                color: "#64748b",
                fontSizePx: 10,
              }),
            ],
            { width: 200 }
          ),
        ],
        { justifyContent: "space-between", paddingTop: 40 }
      ),
      140
    ),
  },
  {
    id: "multi-column-footer",
    categoryId: "footers",
    title: "Corporate 3-Column Footer",
    description:
      "A professional 3-column footer with address, contact info, and website.",
    schema: wrapFooter(
      {
        ...column([
          divider(),
          spacer(12),
          row(
            [
              column(
                [
                  text("Headquarters", {
                    fontWeight: "bold",
                    fontSizePx: 10,
                    color: "#334155",
                  }),
                  spacer(4),
                  text("123 Business Avenue", {
                    fontSizePx: 9,
                    color: "#64748b",
                  }),
                  text("Suite 400", { fontSizePx: 9, color: "#64748b" }),
                  text("New York, NY 10001", {
                    fontSizePx: 9,
                    color: "#64748b",
                  }),
                ],
                { flexGrow: 1 }
              ),
              column(
                [
                  text("Contact Us", {
                    fontWeight: "bold",
                    fontSizePx: 10,
                    color: "#334155",
                  }),
                  spacer(4),
                  text("support@company.com", {
                    fontSizePx: 9,
                    color: "#64748b",
                  }),
                  text("+1 (555) 123-4567", {
                    fontSizePx: 9,
                    color: "#64748b",
                  }),
                  text("+1 (555) 987-6543", {
                    fontSizePx: 9,
                    color: "#64748b",
                  }),
                ],
                { flexGrow: 1 }
              ),
              column(
                [
                  text("Connect", {
                    fontWeight: "bold",
                    fontSizePx: 10,
                    color: "#334155",
                  }),
                  spacer(4),
                  text("www.company.com", { fontSizePx: 9, color: "#64748b" }),
                  text("@company_social", { fontSizePx: 9, color: "#64748b" }),
                  text("LinkedIn: /company", {
                    fontSizePx: 9,
                    color: "#64748b",
                  }),
                ],
                { flexGrow: 1 }
              ),
            ],
            { justifyContent: "space-between" }
          ),
        ]),
        layout: { backgroundColor: "#f8fafc" },
      },
      140
    ),
  },
  {
    id: "letterhead-footer",
    categoryId: "footers",
    title: "Modern Letterhead Footer",
    description: "A stylish centered footer with a colored background block.",
    schema: wrapFooter(
      {
        ...column(
          [
            text("Company Name LLC", {
              fontWeight: "bold",
              color: "#ffffff",
              fontSizePx: 11,
            }),
            spacer(2),
            text("123 Business Road • Suite 100 • Metropolis, NY 10001", {
              color: "#cbd5e1",
              fontSizePx: 9,
            }),
            spacer(2),
            text(
              "Phone: (555) 019-2837 | Email: contact@company.com | Web: www.company.com",
              { color: "#cbd5e1", fontSizePx: 9 }
            ),
          ],
          { alignItems: "center", paddingTop: 16, paddingBottom: 16 }
        ),
        layout: { backgroundColor: "#0f172a" },
      },
      120
    ),
  },
  {
    id: "invoice-totals-footer",
    categoryId: "footers",
    title: "Invoice Totals Footer",
    description:
      "A standard footer for the last page of an invoice showing totals.",
    schema: wrapFooter(
      column([
        row(
          [
            text("Notes", { fontWeight: "bold", fontSizePx: 11 }),
            column(
              [
                row(
                  [
                    text("Subtotal:", { color: "#64748b" }),
                    text("$1,250.00", { fontWeight: "bold" }),
                  ],
                  { justifyContent: "space-between", width: 200 }
                ),
                row(
                  [
                    text("Tax (8%):", { color: "#64748b" }),
                    text("$100.00", { fontWeight: "bold" }),
                  ],
                  { justifyContent: "space-between", width: 200 }
                ),
                divider(),
                row(
                  [
                    text("Total Due:", {
                      color: "#0f172a",
                      fontSizePx: 14,
                      fontWeight: "bold",
                    }),
                    text("$1,350.00", {
                      color: "#0f172a",
                      fontSizePx: 14,
                      fontWeight: "bold",
                    }),
                  ],
                  { justifyContent: "space-between", width: 200 }
                ),
              ],
              { rowGap: 8, alignItems: "flex-end" }
            ),
          ],
          {
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: "#e2e8f0",
          }
        ),
        spacer(16),
        text("Payment is due within 15 days.", {
          color: "#94a3b8",
          fontSizePx: 9,
        }),
      ]),
      180
    ),
  },
  {
    id: "social-links-footer",
    categoryId: "footers",
    title: "Social Links Footer",
    description: "A clean footer with inline social media handles.",
    schema: wrapFooter(
      column(
        [
          divider(),
          spacer(12),
          row(
            [
              text("© 2026 PaperCast Inc.", {
                color: "#94a3b8",
                fontSizePx: 9,
              }),
              row(
                [
                  text("🐦 @papercast", { color: "#64748b", fontSizePx: 9 }),
                  text("📷 @papercast_app", {
                    color: "#64748b",
                    fontSizePx: 9,
                  }),
                  text("💼 /company/papercast", {
                    color: "#64748b",
                    fontSizePx: 9,
                  }),
                ],
                { columnGap: 16 }
              ),
            ],
            { justifyContent: "space-between" }
          ),
        ],
        { paddingBottom: 16 }
      ),
      80
    ),
  },
];
