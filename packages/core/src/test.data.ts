import {
  AnyNode,
  BoxModel,
  ColumnNode,
  DocumentSchema,
  ImageNode,
  RowNode,
  SpacerNode,
  TableColumnConfig,
  TableNode,
  TextNode,
  TypographyAndColor,
} from "./schema";

export const _TEST_DOCUMENT: DocumentSchema = {
  version: 1,
  meta: {
    pageSize: "A4",
    orientation: "portrait",
    baseUnit: "px",
    dpi: 96,
  },
  theme: {
    defaults: {
      base: {
        fontFamily: "Inter",
        fontSizePx: 12,
        lineHeight: 1.4,
        color: "#222222",
      },
      text: {
        marginBottom: 2,
      },
      row: {
        direction: "row",
        alignItems: "center",
      },
      column: {
        direction: "column",
      },
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
  },
  data: {
    company: {
      name: "FormCast Technologies Pvt. Ltd.",
      logo: "https://picsum.photos/130/60",
      address1: "18 Technology Park",
      address2: "Hyderabad",
      state: "Telangana",
      postalCode: "500081",
      country: "India",
      phone: "+91 9876543210",
      email: "accounts@formcast.dev",
      website: "https://formcast.dev",
      gst: "36ABCDE1234F1Z5",
      bank: {
        accountName: "FormCast Technologies Pvt Ltd",
        accountNumber: "XXXXXXXX1234",
        ifsc: "HDFC0001234",
        bankName: "HDFC Bank",
      },
    },
    invoice: {
      number: "INV-2026-000421",
      date: "2026-07-27",
      dueDate: "2026-08-10",
      purchaseOrder: "PO-29422",
      currency: "USD",
      salesPerson: "Michael Scott",
      paymentTerms: "Net 15",
      pageNumber: 1,
      pageCount: 18,
    },
    customer: {
      company: "Wayne Enterprises",
      contact: "Bruce Wayne",
      email: "finance@wayne.com",
      phone: "+1 555 123456",
      billingAddress: {
        line1: "1007 Mountain Drive",
        city: "Gotham",
        state: "New Jersey",
        postalCode: "07097",
        country: "USA",
      },
      shippingAddress: {
        line1: "1007 Mountain Drive",
        city: "Gotham",
        state: "New Jersey",
        postalCode: "07097",
        country: "USA",
      },
    },
    title: "Tax Invoice",
  },
  definitions: {
    widgets: {},
  },
  document: {
    headers: {
      first: {
        id: "header-first",
        condition: "first",
        root: {
          id: "hf-root",
          type: "root",
          layout: {
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 24,
            paddingBottom: 18,
            direction: "column",
            borderBottomWidth: 1,
            borderBottomColor: "#d8d8d8",
            rowGap: 12,
          },
          children: [
            {
              id: "top-row",
              type: "row",
              layout: {
                justifyContent: "space-between",
                alignItems: "center",
              },
              children: [
                {
                  id: "logo",
                  type: "image",
                  props: {
                    srcBind: "company.logo",
                    fit: "contain",
                  },
                  layout: {
                    width: 130,
                    height: 60,
                  },
                },
                {
                  id: "company",
                  type: "column",
                  layout: {
                    alignItems: "flex-end",
                    rowGap: 2,
                  },
                  children: [
                    {
                      id: "company-name",
                      type: "text",
                      bind: {
                        path: "company.name",
                      },
                      style: {
                        fontSizePx: 22,
                        fontWeight: "bold",
                        textAlign: "right",
                      },
                      layout: {},
                    },
                    {
                      id: "address1",
                      type: "text",
                      bind: {
                        path: "company.address1",
                      },
                      layout: {},
                    },
                    {
                      id: "address2",
                      type: "text",
                      bind: {
                        path: "company.address2",
                      },
                      layout: {},
                    },
                    {
                      id: "gst",
                      type: "text",
                      bind: {
                        path: "company.gst",
                      },
                      style: {
                        fontWeight: "bold",
                      },
                      layout: {},
                    },
                  ],
                },
              ],
            },
            {
              id: "divider",
              type: "spacer",
              props: {
                sizePx: 8,
              },
              layout: {
                borderBottomWidth: 2,
                borderBottomColor: "#333333",
              },
            },
            {
              id: "invoice-title",
              type: "row",
              layout: {
                justifyContent: "space-between",
              },
              children: [
                {
                  id: "title",
                  type: "text",
                  bind: {
                    path: "title",
                  },
                  style: {
                    fontSizePx: 28,
                    fontWeight: "bold",
                  },
                  layout: {},
                },
                {
                  id: "invoice-meta",
                  type: "column",
                  layout: {
                    alignItems: "flex-end",
                    rowGap: 4,
                  },
                  children: [
                    {
                      id: "invoice-number",
                      type: "text",
                      bind: {
                        path: "invoice.number",
                      },
                      style: {
                        fontWeight: "bold",
                      },
                      layout: {},
                    },
                    {
                      id: "invoice-date",
                      type: "text",
                      bind: {
                        path: "invoice.date",
                      },
                      layout: {},
                    },
                    {
                      id: "due-date",
                      type: "text",
                      bind: {
                        path: "invoice.dueDate",
                      },
                      layout: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      common: {
        id: "header-common",
        condition: "all",
        root: {
          id: "hc-root",
          type: "root",
          layout: {
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
            rowGap: 8,
            direction: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#d8d8d8",
            justifyContent: "space-between",
            alignItems: "center",
          },
          children: [
            {
              id: "company-small",
              type: "text",
              bind: {
                path: "company.name",
              },
              style: {
                fontWeight: "bold",
                fontSizePx: 13,
              },
              layout: {},
            },
            {
              id: "invoice-small",
              type: "text",
              bind: {
                path: "invoice.number",
              },
              layout: {},
            },
          ],
        },
      },
      odd: {
        id: "header-odd",
        condition: "odd",
        root: {
          id: "odd-root",
          type: "root",
          layout: {
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
            rowGap: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#d8d8d8",
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
          children: [
            {
              id: "odd-company",
              type: "text",
              bind: {
                path: "company.name",
              },
              style: {
                fontWeight: "bold",
              },
              layout: {},
            },
            {
              id: "odd-page",
              type: "text",
              props: {
                literal: "Page {{pageNumber}} / {{pageCount}}",
              },
              layout: {},
            },
          ],
        },
      },
      even: {
        id: "header-even",
        condition: "even",
        root: {
          id: "even-root",
          type: "root",
          layout: {
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
            rowGap: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#d8d8d8",
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
          children: [
            {
              id: "page-even",
              type: "text",
              props: {
                literal: "Page {{pageNumber}} / {{pageCount}}",
              },
              layout: {},
            },
            {
              id: "invoice-even",
              type: "text",
              bind: {
                path: "invoice.number",
              },
              style: {
                fontWeight: "bold",
              },
              layout: {},
            },
          ],
        },
      },
    },
    footers: {
      first: {
        id: "footer-first",
        condition: "first",
        root: {
          id: "ff-root",
          type: "root",
          layout: {
            direction: "column",
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
            rowGap: 8,
            borderTopWidth: 1,
            borderTopColor: "#CCCCCC",
          },
          children: [
            {
              id: "payment-row",
              type: "row",
              layout: {
                justifyContent: "space-between",
                alignItems: "flex-start",
              },
              children: [
                {
                  id: "bank-column",
                  type: "column",
                  layout: {
                    rowGap: 2,
                  },
                  children: [
                    {
                      id: "bank-title",
                      type: "text",
                      props: {
                        literal: "Bank Details",
                      },
                      style: {
                        fontWeight: "bold",
                      },
                      layout: {},
                    },
                    {
                      id: "bank-name",
                      type: "text",
                      bind: {
                        path: "company.bank.bankName",
                      },
                      layout: {},
                    },
                    {
                      id: "bank-account",
                      type: "text",
                      bind: {
                        path: "company.bank.accountNumber",
                      },
                      layout: {},
                    },
                    {
                      id: "bank-ifsc",
                      type: "text",
                      bind: {
                        path: "company.bank.ifsc",
                      },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "payment-qr",
                  type: "image",
                  props: {
                    srcLiteral: "https://picsum.photos/72/72",
                    fit: "contain",
                  },
                  layout: {
                    width: 72,
                    height: 72,
                  },
                },
              ],
            },
            {
              id: "footer-note",
              type: "text",
              props: {
                literal:
                  "Thank you for your business. Please include the invoice number when making payment.",
              },
              style: {
                textAlign: "center",
                fontSizePx: 10,
                color: "#666666",
              },
              layout: {},
            },
          ],
        },
      },
      last: {
        id: "footer-last",
        condition: "last",
        root: {
          id: "fl-root",
          type: "root",
          layout: {
            direction: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
          },
          style: {
            backgroundColor: "teal",
          },
          children: [
            {
              id: "fl-text",
              type: "text",
              props: {
                literal: "This is the last page footer",
              },
              style: {
                color: "white",
                fontWeight: "bold",
              },
              layout: {},
            },
          ],
        },
      },
      common: {
        id: "footer-common",
        condition: "all",
        root: {
          id: "fc-root",
          type: "root",
          layout: {
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
            rowGap: 8,
            borderTopWidth: 1,
            borderTopColor: "#DDDDDD",
          },
          children: [
            {
              id: "website",
              type: "text",
              bind: {
                path: "company.website",
              },
              style: {
                fontSizePx: 10,
                color: "#666666",
              },
              layout: {},
            },
            {
              id: "common-page",
              type: "text",
              props: {
                literal: "Page {{pageNumber}} of {{pageCount}}",
              },
              style: {
                fontSizePx: 10,
              },
              layout: {},
            },
          ],
        },
      },
      odd: {
        id: "footer-odd",
        condition: "odd",
        root: {
          id: "fo-root",
          type: "root",
          layout: {
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
            rowGap: 8,
            borderTopWidth: 1,
            borderTopColor: "#DDDDDD",
          },
          children: [
            {
              id: "copyright",
              type: "text",
              props: {
                literal: "© 2026 FormCast Technologies Pvt. Ltd.",
              },
              style: {
                fontSizePx: 9,
                color: "#888888",
              },
              layout: {},
            },
            {
              id: "odd-footer-page",
              type: "text",
              props: {
                literal: "{{pageNumber}}",
              },
              style: {
                fontSizePx: 9,
                fontWeight: "bold",
              },
              layout: {},
            },
          ],
        },
      },
      even: {
        id: "footer-even",
        condition: "even",
        root: {
          id: "fe-root",
          type: "root",
          layout: {
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 12,
            paddingBottom: 12,
            rowGap: 8,
            borderTopWidth: 1,
            borderTopColor: "#DDDDDD",
          },
          children: [
            {
              id: "even-page",
              type: "text",
              props: {
                literal: "{{pageNumber}}",
              },
              style: {
                fontWeight: "bold",
              },
              layout: {},
            },
            {
              id: "support",
              type: "text",
              bind: {
                path: "company.email",
              },
              style: {
                fontSizePx: 9,
                color: "#888888",
              },
              layout: {},
            },
          ],
        },
      },
    },
    pageOverrides: {
      "1": {
        headerId: "first",
        footerId: "first",
      },
    },
    body: {
      id: "body-root",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        paddingBottom: 20,
        rowGap: 18,
      },
      children: [
        {
          id: "customer-section",
          type: "row",
          layout: {
            justifyContent: "space-between",
            alignItems: "flex-start",
            columnGap: 32,
            keepWithNext: true,
          },
          children: [
            {
              id: "billing-column",
              type: "column",
              layout: {
                flexGrow: 1,
                rowGap: 4,
              },
              children: [
                {
                  id: "bill-title",
                  type: "text",
                  props: {
                    literal: "BILL TO",
                  },
                  style: {
                    fontWeight: "bold",
                    fontSizePx: 15,
                    color: "#444",
                  },
                  layout: {},
                },
                {
                  id: "customer-company",
                  type: "text",
                  bind: {
                    path: "customer.company",
                  },
                  style: {
                    fontWeight: "bold",
                    fontSizePx: 16,
                  },
                  layout: {},
                },
                {
                  id: "customer-contact",
                  type: "text",
                  bind: {
                    path: "customer.contact",
                  },
                  layout: {},
                },
                {
                  id: "billing-line1",
                  type: "text",
                  bind: {
                    path: "customer.billingAddress.line1",
                  },
                  layout: {},
                },
                {
                  id: "billing-city",
                  type: "text",
                  props: {
                    literal:
                      "{{customer.billingAddress.city}}, {{customer.billingAddress.state}}",
                  },
                  layout: {},
                },
                {
                  id: "billing-postal",
                  type: "text",
                  props: {
                    literal: "{{customer.billingAddress.postalCode}}",
                  },
                  layout: {},
                },
                {
                  id: "billing-country",
                  type: "text",
                  bind: {
                    path: "customer.billingAddress.country",
                  },
                  layout: {},
                },
              ],
            },
            {
              id: "shipping-column",
              type: "column",
              layout: {
                flexGrow: 1,
                rowGap: 4,
              },
              children: [
                {
                  id: "ship-title",
                  type: "text",
                  props: {
                    literal: "SHIP TO",
                  },
                  style: {
                    fontWeight: "bold",
                    fontSizePx: 15,
                    color: "#444",
                  },
                  layout: {},
                },
                {
                  id: "ship-company",
                  type: "text",
                  bind: {
                    path: "customer.company",
                  },
                  style: {
                    fontWeight: "bold",
                    fontSizePx: 16,
                  },
                  layout: {},
                },
                {
                  id: "shipping-line1",
                  type: "text",
                  bind: {
                    path: "customer.shippingAddress.line1",
                  },
                  layout: {},
                },
                {
                  id: "shipping-city",
                  type: "text",
                  props: {
                    literal:
                      "{{customer.shippingAddress.city}}, {{customer.shippingAddress.state}}",
                  },
                  layout: {},
                },
                {
                  id: "shipping-postal",
                  type: "text",
                  props: {
                    literal: "{{customer.shippingAddress.postalCode}}",
                  },
                  layout: {},
                },
                {
                  id: "shipping-country",
                  type: "text",
                  bind: {
                    path: "customer.shippingAddress.country",
                  },
                  layout: {},
                },
              ],
            },
          ],
        },
        {
          id: "invoice-summary",
          type: "row",
          layout: {
            justifyContent: "space-between",
            alignItems: "stretch",
            columnGap: 40,
            keepWithNext: true,
          },
          children: [
            {
              id: "left-meta",
              type: "column",
              layout: {
                flexGrow: 1,
                rowGap: 8,
              },
              children: [
                {
                  id: "po",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      id: "po-label",
                      type: "text",
                      props: {
                        literal: "Purchase Order",
                      },
                      style: {
                        fontWeight: "bold",
                      },
                      layout: {},
                    },
                    {
                      id: "po-value",
                      type: "text",
                      bind: {
                        path: "invoice.purchaseOrder",
                      },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "salesperson",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      id: "sales-label",
                      type: "text",
                      props: {
                        literal: "Sales Person",
                      },
                      style: {
                        fontWeight: "bold",
                      },
                      layout: {},
                    },
                    {
                      id: "sales-value",
                      type: "text",
                      bind: {
                        path: "invoice.salesPerson",
                      },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "payment-terms",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      id: "terms-label",
                      type: "text",
                      props: {
                        literal: "Payment Terms",
                      },
                      style: {
                        fontWeight: "bold",
                      },
                      layout: {},
                    },
                    {
                      id: "terms-value",
                      type: "text",
                      bind: {
                        path: "invoice.paymentTerms",
                      },
                      layout: {},
                    },
                  ],
                },
              ],
            },
            {
              id: "currency-box",
              type: "column",
              layout: {
                width: 180,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 12,
                paddingRight: 12,
                rowGap: 6,
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderTopColor: "#DDD",
                borderRightColor: "#DDD",
                borderBottomColor: "#DDD",
                borderLeftColor: "#DDD",
              },
              children: [
                {
                  id: "currency-title",
                  type: "text",
                  props: {
                    literal: "Currency",
                  },
                  style: {
                    fontWeight: "bold",
                  },
                  layout: {},
                },
                {
                  id: "currency",
                  type: "text",
                  bind: {
                    path: "invoice.currency",
                  },
                  style: {
                    fontSizePx: 18,
                    fontWeight: "bold",
                  },
                  layout: {},
                },
              ],
            },
          ],
        },
        {
          id: "invoice-table",
          type: "table",
          bind: {
            path: "items",
            mode: "repeat",
            itemAlias: "item",
          },
          layout: {
            marginTop: 12,
            breakInside: "auto",
          },
          props: {
            columns: [
              {
                headerText: "#",
                bindPath: "index",
                widthPx: 40,
                align: "center",
              },
              {
                headerText: "SKU",
                bindPath: "sku",
                widthPx: 80,
                align: "left",
              },
              {
                headerText: "Description",
                bindPath: "description",
                widthPx: 270,
                align: "left",
              },
              {
                headerText: "Qty",
                bindPath: "quantity",
                widthPx: 60,
                align: "right",
              },
              {
                headerText: "Unit",
                bindPath: "unit",
                widthPx: 60,
                align: "center",
              },
              {
                headerText: "Unit Price",
                bindPath: "unitPrice",
                widthPx: 90,
                align: "right",
              },
              {
                headerText: "Tax %",
                bindPath: "taxRate",
                widthPx: 60,
                align: "right",
              },
              {
                headerText: "Discount",
                bindPath: "discount",
                widthPx: 80,
                align: "right",
              },
              {
                headerText: "Amount",
                bindPath: "total",
                widthPx: 100,
                align: "right",
              },
            ],
          },
        },
        {
          id: "notes-section",
          type: "column",
          layout: {
            marginTop: 24,
            rowGap: 6,
            keepWithNext: true,
            breakInside: "avoid",
          },
          children: [
            {
              id: "notes-title",
              type: "text",
              props: {
                literal: "Notes",
              },
              style: {
                fontWeight: "bold",
                fontSizePx: 14,
              },
              layout: {},
            },
            {
              id: "notes",
              type: "text",
              bind: {
                path: "invoice.notes",
              },
              style: {
                lineHeight: 1.6,
              },
              layout: {},
            },
          ],
        },
        {
          id: "totals-row",
          type: "row",
          layout: {
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: 32,
            keepWithNext: true,
          },
          children: [
            {
              id: "tax-summary",
              type: "table",
              layout: {
                width: 420,
                breakInside: "avoid",
              },
              bind: {
                path: "taxSummary",
                mode: "repeat",
                itemAlias: "tax",
              },
              props: {
                columns: [
                  {
                    headerText: "Tax",
                    bindPath: "name",
                    widthPx: 180,
                  },
                  {
                    headerText: "Rate",
                    bindPath: "rate",
                    widthPx: 80,
                    align: "right",
                  },
                  {
                    headerText: "Taxable",
                    bindPath: "taxable",
                    widthPx: 80,
                    align: "right",
                  },
                  {
                    headerText: "Amount",
                    bindPath: "amount",
                    widthPx: 80,
                    align: "right",
                  },
                ],
              },
            },
            {
              id: "invoice-totals",
              type: "column",
              layout: {
                width: 260,
                rowGap: 8,
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopColor: "#CCCCCC",
                borderBottomColor: "#CCCCCC",
                borderLeftColor: "#CCCCCC",
                borderRightColor: "#CCCCCC",
              },
              children: [
                {
                  id: "subtotal",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      id: "subtotal-label",
                      type: "text",
                      props: {
                        literal: "Subtotal",
                      },
                      style: {
                        fontWeight: "bold",
                      },
                      layout: {},
                    },
                    {
                      id: "subtotal-value",
                      type: "text",
                      bind: {
                        path: "totals.subtotal",
                      },
                      style: {
                        textAlign: "right",
                      },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "discount",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      id: "discount-label",
                      type: "text",
                      props: {
                        literal: "Discount",
                      },
                      layout: {},
                    },
                    {
                      id: "discount-value",
                      type: "text",
                      bind: {
                        path: "totals.discount",
                      },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "shipping",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      id: "shipping-label",
                      type: "text",
                      props: {
                        literal: "Shipping",
                      },
                      layout: {},
                    },
                    {
                      id: "shipping-value",
                      type: "text",
                      bind: {
                        path: "totals.shipping",
                      },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "tax",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      id: "tax-label",
                      type: "text",
                      props: {
                        literal: "Tax",
                      },
                      layout: {},
                    },
                    {
                      id: "tax-value",
                      type: "text",
                      bind: {
                        path: "totals.tax",
                      },
                      layout: {},
                    },
                  ],
                },
                {
                  id: "separator",
                  type: "spacer",
                  props: {
                    sizePx: 8,
                  },
                  layout: {
                    borderTopWidth: 1,
                    borderTopColor: "#BBBBBB",
                  },
                },
                {
                  id: "grand-total",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      id: "grand-label",
                      type: "text",
                      props: {
                        literal: "TOTAL",
                      },
                      style: {
                        fontWeight: "bold",
                        fontSizePx: 18,
                      },
                      layout: {},
                    },
                    {
                      id: "grand-value",
                      type: "text",
                      bind: {
                        path: "totals.grandTotal",
                      },
                      style: {
                        fontWeight: "bold",
                        fontSizePx: 20,
                        color: "#0055AA",
                      },
                      layout: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "payment-section",
          type: "column",
          layout: {
            marginTop: 30,
            rowGap: 6,
            breakInside: "avoid",
            keepWithNext: true,
          },
          children: [
            {
              id: "payment-title",
              type: "text",
              props: {
                literal: "Payment Instructions",
              },
              style: {
                fontWeight: "bold",
                fontSizePx: 15,
              },
              layout: {},
            },
            {
              id: "payment-text",
              type: "text",
              bind: {
                path: "invoice.paymentInstructions",
              },
              style: {
                lineHeight: 1.6,
              },
              layout: {},
            },
          ],
        },
        {
          id: "terms",
          type: "column",
          layout: {
            marginTop: 30,
            rowGap: 8,
            breakInside: "auto",
          },
          children: [
            {
              id: "terms-title",
              type: "text",
              props: {
                literal: "Terms & Conditions",
              },
              style: {
                fontWeight: "bold",
                fontSizePx: 15,
              },
              layout: {},
            },
            {
              id: "terms-body",
              type: "text",
              bind: {
                path: "invoice.terms",
              },
              style: {
                lineHeight: 1.8,
                textAlign: "justify",
              },
              layout: {},
            },
          ],
        },
        {
          id: "signature",
          type: "row",
          layout: {
            marginTop: 60,
            justifyContent: "flex-end",
            breakInside: "avoid",
          },
          children: [
            {
              id: "signature-box",
              type: "column",
              layout: {
                width: 220,
                alignItems: "center",
                rowGap: 10,
              },
              children: [
                {
                  id: "signature-image",
                  type: "image",
                  props: {
                    srcLiteral: "https://picsum.photos/140/60",
                    fit: "contain",
                  },
                  layout: {
                    width: 140,
                    height: 60,
                  },
                },
                {
                  id: "signature-line",
                  type: "spacer",
                  props: {
                    sizePx: 2,
                  },
                  layout: {
                    width: 180,
                    borderTopWidth: 1,
                    borderTopColor: "#000",
                  },
                },
                {
                  id: "signature-label",
                  type: "text",
                  props: {
                    literal: "Authorized Signatory",
                  },
                  style: {
                    fontWeight: "bold",
                  },
                  layout: {},
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const scenarios = [
  {
    title: "Simple Invoice",
    rows: 10,
    cols: 4,
  },
  {
    title: "Wide Table",
    rows: 15,
    cols: 12,
  },
  {
    title: "Very Long Rows",
    rows: 60,
    cols: 6,
  },
  {
    title: "Long Description",
    rows: 40,
    cols: 5,
  },
  {
    title: "Large Numbers",
    rows: 80,
    cols: 8,
  },
  {
    title: "Random Heights",
    rows: 120,
    cols: 7,
  },
];

let nodeCounter = 0;

export function nextId(prefix = "node"): string {
  nodeCounter++;
  return `${prefix}-${nodeCounter}`;
}

_TEST_DOCUMENT.document.body.children = [
  sectionTitle("Customer"),
  row([
    addressBlock("Bill To", [
      "John Doe",
      "123 Billing St",
      "New York",
      "NY",
      "10001",
      "USA",
    ]),
    addressBlock("Ship To", [
      "John Doe",
      "456 Shipping Ave",
      "Los Angeles",
      "CA",
      "90001",
      "USA",
    ]),
  ]),
  divider(),
];

// Ensure default "items" data exists for the invoice table
_TEST_DOCUMENT.data.items = [
  {
    index: 1,
    description: "Web Development Services",
    quantity: 80,
    price: "$150",
    amount: "$12,000",
  },
  {
    index: 2,
    description: "Server Hosting Setup",
    quantity: 1,
    price: "$250",
    amount: "$250",
  },
  {
    index: 3,
    description: "Monthly Support Retainer",
    quantity: 1,
    price: "$2,160",
    amount: "$2,160",
  },
];

if (!_TEST_DOCUMENT.data.stress) {
  _TEST_DOCUMENT.data.stress = {};
}

if (_TEST_DOCUMENT.document.body.children) {
  for (const scenario of scenarios) {
    _TEST_DOCUMENT.document.body.children.push(sectionTitle(scenario.title));
    _TEST_DOCUMENT.document.body.children.push(loremParagraph(3));

    if (scenario.title === "Simple Invoice") {
      _TEST_DOCUMENT.document.body.children.push(createInvoiceTable());
    } else {
      _TEST_DOCUMENT.document.body.children.push(
        createStressTable(scenario.rows, scenario.cols)
      );

      // Generate mock data for the stress table
      const rowsData = [];
      for (let r = 0; r < scenario.rows; r++) {
        const rowObj: any = { index: r + 1 };
        for (let c = 0; c < scenario.cols; c++) {
          rowObj[`c${c}`] = `R${r + 1} C${c + 1}`;
        }
        rowsData.push(rowObj);
      }
      _TEST_DOCUMENT.data.stress[`rows${scenario.rows}`] = rowsData;
    }

    _TEST_DOCUMENT.document.body.children.push(divider());
  }

  _TEST_DOCUMENT.document.body.children.push(
    sectionTitle("Totals"),
    summaryCard([
      { label: "Subtotal", value: "$12,000" },
      { label: "Tax", value: "$2,160" },
      { label: "Shipping", value: "$250" },
      { label: "Grand Total", value: "$14,410" },
    ]),
    divider(),
    sectionTitle("Terms & Conditions", true),
    loremParagraph(8)
  );
}

export function text(
  literal: string,
  style: TypographyAndColor = {},
  layout: BoxModel = {}
): TextNode {
  return {
    id: nextId("text"),
    type: "text",
    props: {
      literal,
    },
    style,
    layout,
  };
}

export function bindText(
  path: string,
  style: TypographyAndColor = {},
  layout: BoxModel = {}
): TextNode {
  return {
    id: nextId("text"),
    type: "text",
    bind: {
      path,
    },
    style,
    layout,
  };
}

export function image(src: string, width: number, height: number): ImageNode {
  return {
    id: nextId("img"),

    type: "image",

    props: {
      srcLiteral: src,

      fit: "contain",
    },

    layout: {
      width,

      height,
    },
  };
}

export function spacer(size = 4): SpacerNode {
  return {
    id: nextId("spacer"),

    type: "spacer",

    props: {
      sizePx: size,
    },

    layout: {},
  };
}

export function row(children: AnyNode[], layout: BoxModel = {}): RowNode {
  return {
    id: nextId("row"),

    type: "row",

    layout: {
      direction: "row",

      ...layout,
    },

    children,
  };
}

export function column(children: AnyNode[], layout: BoxModel = {}): ColumnNode {
  return {
    id: nextId("column"),

    type: "column",

    layout: {
      direction: "column",

      ...layout,
    },

    children,
  };
}

export function sectionTitle(
  title: string,
  pageBreakBefore?: boolean
): TextNode {
  return text(
    title,

    {
      fontSizePx: 20,

      fontWeight: "bold",

      color: "#1f2937",
    },

    {
      marginTop: 4,
      pageBreakBefore: pageBreakBefore,
      marginBottom: 2,
    }
  );
}

export function divider(): SpacerNode {
  return {
    id: nextId("divider"),

    type: "spacer",

    props: {
      sizePx: 1,
    },

    layout: {
      borderTopWidth: 1,

      borderTopColor: "#dddddd",

      marginTop: 2,

      marginBottom: 2,
    },
  };
}

export function paragraph(textValue: string): TextNode {
  return text(
    textValue,

    {
      lineHeight: 1.7,

      textAlign: "justify",
    }
  );
}

export function addressBlock(title: string, address: string[]): ColumnNode {
  return column(
    [
      text(title, {
        fontWeight: "bold",

        fontSizePx: 15,
      }),

      ...address.map((x) => text(x)),
    ],

    {
      rowGap: 3,

      flexGrow: 1,
    }
  );
}

export function summaryRow(label: string, value: string): RowNode {
  return row(
    [
      text(label, {
        fontWeight: "bold",
      }),

      text(value, {
        textAlign: "right",
      }),
    ],
    {
      justifyContent: "space-between",
      alignItems: "center",
    }
  );
}

export function summaryCard(
  rows: Array<{
    label: string;
    value: string;
  }>
): ColumnNode {
  return column(
    rows.map((r) => summaryRow(r.label, r.value)),
    {
      width: 240,
      rowGap: 8,

      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 12,
      paddingRight: 12,

      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,

      borderTopColor: "#DDD",
      borderRightColor: "#DDD",
      borderBottomColor: "#DDD",
      borderLeftColor: "#DDD",
    }
  );
}

export function table(
  columns: TableColumnConfig[],
  bindPath: string
): TableNode {
  return {
    id: nextId("table"),

    type: "table",

    bind: {
      path: bindPath,

      mode: "repeat",

      itemAlias: "row",
    },

    props: {
      columns,
    },

    layout: {},
  };
}

export function createInvoiceTable(): TableNode {
  const invoiceTable = table(
    [
      {
        headerText: "#",
        bindPath: "index",
        widthPx: 40,
      },
      {
        headerText: "Description",
        bindPath: "description",
        widthPx: 300,
      },
      {
        headerText: "Qty",
        bindPath: "quantity",
        widthPx: 70,
        align: "right",
      },
      {
        headerText: "Price",
        bindPath: "price",
        widthPx: 100,
        align: "right",
      },
      {
        headerText: "Amount",
        bindPath: "amount",
        widthPx: 120,
        align: "right",
      },
    ],
    "items"
  );

  invoiceTable.props = {
    ...invoiceTable.props,
    footerRows: [
      {
        id: "summary-row-1",
        cells: [
          {
            colSpan: 3,
            rowSpan: 2,
            borderRight: true,
            content: [
              {
                id: "notes-text",
                type: "text",
                props: { literal: "Notes: All amounts are in USD." },
                style: { fontSizePx: 10, color: "#666" },
                layout: { paddingTop: 4, paddingBottom: 4, paddingLeft: 8 },
              },
            ],
          },
          {
            colSpan: 1,
            rowSpan: 1,
            content: [
              {
                id: "subtotal-label",
                type: "text",
                props: { literal: "Subtotal" },
                style: { fontWeight: "bold", textAlign: "right" },
                layout: { paddingTop: 4, paddingBottom: 4, paddingRight: 8 },
              },
            ],
          },
          {
            colSpan: 1,
            rowSpan: 1,
            content: [
              {
                id: "subtotal-val",
                type: "text",
                props: { literal: "$1,200.00" },
                style: { textAlign: "right" },
                layout: { paddingTop: 4, paddingBottom: 4, paddingRight: 8 },
              },
            ],
          },
        ],
      },
      {
        id: "summary-row-2",
        cells: [
          {
            colSpan: 1,
            rowSpan: 1,
            content: [
              {
                id: "total-label",
                type: "text",
                props: { literal: "Total" },
                style: { fontWeight: "bold", textAlign: "right" },
                layout: { paddingTop: 4, paddingBottom: 4, paddingRight: 8 },
              },
            ],
          },
          {
            colSpan: 1,
            rowSpan: 1,
            content: [
              {
                id: "total-val",
                type: "text",
                props: { literal: "$1,200.00" },
                style: { fontWeight: "bold", textAlign: "right" },
                layout: { paddingTop: 4, paddingBottom: 4, paddingRight: 8 },
              },
            ],
          },
        ],
      },
    ],
    styleConfig: {
      gridLines: "horizontal",
      borderColor: "#e5e7eb",
      borderWidthPx: 1,
      cellPaddingPx: 12,
      headerBackgroundColor: "#f9fafb",
      headerTextColor: "#374151",
      headerFontSizePx: 12,
      headerFontWeight: "bold",
      rowBackgroundColor: "#ffffff",
      alternateRowBackgroundColor: "#f9fafb",
      rowTextColor: "#111827",
      rowFontSizePx: 11,
      footerBackgroundColor: "#f3f4f6",
      footerTextColor: "#111827",
      footerFontSizePx: 12,
      footerFontWeight: "normal",
    },
  };

  return invoiceTable;
}

export function loremParagraph(sentences = 5): TextNode {
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";

  return paragraph(Array(sentences).fill(lorem).join(""));
}

export function createStressTable(rows: number, columns: number): TableNode {
  const cols: TableColumnConfig[] = [];

  for (let i = 0; i < columns; i++) {
    cols.push({
      headerText: `Col ${i + 1}`,

      bindPath: `c${i}`,

      widthPx: 90,
    });
  }

  return table(
    cols,

    `stress.rows${rows}`
  );
}

export function injectTestRichText(doc: DocumentSchema): DocumentSchema {
  const newDoc = structuredClone(doc);

  // Add RichTextPreferences to meta
  newDoc.meta.richTextPreferences = {
    autoDeconstruct: true,
    tagStyles: {
      h1: { style: { color: "#1e3a8a", fontSizePx: 26 } },
      h2: {
        style: { color: "#1e40af", fontSizePx: 20 },
        layout: { marginTop: 16 },
      },
      code: { style: { backgroundColor: "#fee2e2", color: "#991b1b" } },
      blockquote: {
        style: { backgroundColor: "#f3f4f6", fontStyle: "italic" },
        layout: {
          borderLeftWidth: 4,
          borderLeftColor: "#3b82f6",
          paddingLeft: 12,
        },
      },
      ul: { layout: { paddingLeft: 24, marginBottom: 16 } },
      li: { style: { color: "#374151" } },
    },
  };

  // Inject the provided RichText widget
  const richTextNode: any = {
    id: "node-1785258000135",
    type: "richText",
    layout: { marginBottom: 32 },
    props: {
      htmlLiteral:
        '<article class="content-wrapper">\n  <h1>Mastering Modern Web Architecture</h1>\n  <p class="intro-text">\n    Building fast, scalable web applications requires a deep understanding of frontend optimization, state management, and semantic markup structures. \n  </p>\n\n  <hr />\n\n  <h2>Key Development Pillars</h2>\n  <p>\n    When engineering enterprise-grade user interfaces, teams must balance performance with maintainability. Focus heavily on these three core segments:\n  </p>\n\n  <ul>\n    <li><strong>Component Isolation:</strong> Write modular CSS and scoped logic to prevent global style pollution.</li>\n    <li><strong>State Hydration:</strong> Optimize server-side rendering boundaries to lower Time to Interactive (TTI).</li>\n    <li><strong>Accessibility (a11y):</strong> Utilize ARIA attributes and native interactive elements cleanly.</li>\n  </ul>\n\n  <blockquote>\n    "Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make things worse: complexity sells better."\n    <cite>— Edsger W. Dijkstra</cite>\n  </blockquote>\n\n  <h2>Performance Metrics Comparison</h2>\n  <p>\n    The table below outlines the core web vitals that engineering teams track to evaluate application responsiveness and visual stability.\n  </p>\n\n  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">\n    <thead>\n      <tr style="background-color: #f2f2f2; text-align: left;">\n        <th>Metric Name</th>\n        <th>Acronym</th>\n        <th>Target Score</th>\n        <th>Impact Level</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td>Largest Contentful Paint</td>\n        <td><code>LCP</code></td>\n        <td>&lt; 2.5 seconds</td>\n        <td>High</td>\n      </tr>\n      <tr>\n        <td>Interaction to Next Paint</td>\n        <td><code>INP</code></td>\n        <td>&lt; 200 milliseconds</td>\n        <td>Critical</td>\n      </tr>\n      <tr>\n        <td>Cumulative Layout Shift</td>\n        <td><code>CLS</code></td>\n        <td>&lt; 0.1</td>\n        <td>Medium</td>\n      </tr>\n    </tbody>\n  </table>\n\n  <h2>Next Steps for Implementation</h2>\n  <p>\n    Review your application bundle sizes using a visualizer tool. Next, remove unused dependencies. Finally, test your interface under simulated mobile throttling networks.\n  </p>\n  \n  <p>\n    For more details, consult the internal architecture documentation or reach out via the engineering Slack channel.\n  </p>\n</article>\n',
    },
  };
  newDoc.document.body.children = newDoc.document.body.children || [];
  newDoc.document.body.children.unshift(richTextNode);

  return newDoc;
}

export const TEST_DOCUMENT = injectTestRichText(_TEST_DOCUMENT);
