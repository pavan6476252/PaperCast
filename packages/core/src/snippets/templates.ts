import { DocumentSchema } from "../schema";
import { SchemaSnippet } from "./types";

const modernTechInvoice: DocumentSchema = {
  version: 1,
  meta: { pageSize: "A4", orientation: "portrait", baseUnit: "px", dpi: 96 },
  theme: {
    defaults: { base: { fontFamily: "Inter, sans-serif", color: "#333333" } },
  },
  data: {
    invoiceNumber: "INV-2023-001",
    date: "2023-10-25",
    dueDate: "2023-11-25",
    company: {
      name: "Acme Tech Inc.",
      address: "123 Innovation Drive, Silicon Valley, CA 94025",
    },
    client: {
      name: "Global Corp",
      address: "456 Enterprise Way, New York, NY 10001",
    },
    items: [
      {
        description: "Web Application Development",
        quantity: 1,
        price: 5000,
        total: 5000,
      },
      {
        description: "Cloud Infrastructure Setup",
        quantity: 1,
        price: 2000,
        total: 2000,
      },
      {
        description: "Monthly Retainer (October)",
        quantity: 1,
        price: 1500,
        total: 1500,
      },
    ],
    subtotal: 8500,
    tax: 850,
    total: 9350,
  },
  definitions: { widgets: {} },
  document: {
    headers: {
      default: {
        heightPx: 120,
        root: {
          id: "header",
          type: "row",
          layout: {
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
          },
          style: { backgroundColor: "#121212" },
          children: [
            {
              id: "logo",
              type: "text",
              layout: {},
              style: { color: "#ffffff", fontSizePx: 24, fontWeight: "bold" },
              props: { literal: "AcmeTech" },
            },
            {
              id: "invoice-title",
              type: "text",
              layout: {},
              style: { color: "#888888", fontSizePx: 18 },
              props: { literal: "INVOICE" },
            },
          ],
        },
      },
    },
    footers: {
      default: {
        heightPx: 60,
        root: {
          id: "footer",
          type: "row",
          layout: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
            borderTopWidth: 1,
            borderTopColor: "#eeeeee",
            borderTopStyle: "solid",
          },
          children: [
            {
              id: "footer-text",
              type: "text",
              layout: {},
              style: { color: "#888888", fontSizePx: 12 },
              props: {
                literal: "Thank you for your business. | Acme Tech Inc.",
              },
            },
          ],
        },
      },
    },
    pageOverrides: {},
    body: {
      id: "body-root",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 40,
        paddingBottom: 40,
        rowGap: 40,
      },
      children: [
        {
          id: "info-row",
          type: "row",
          layout: { justifyContent: "space-between" },
          children: [
            {
              id: "bill-to",
              type: "column",
              layout: { rowGap: 4 },
              children: [
                {
                  id: "bill-to-label",
                  type: "text",
                  layout: {},
                  style: { color: "#888888", fontSizePx: 12 },
                  props: { literal: "BILL TO" },
                },
                {
                  id: "client-name",
                  type: "text",
                  layout: {},
                  style: { fontWeight: "bold" },
                  props: { literal: "{{client.name}}" },
                },
                {
                  id: "client-address",
                  type: "text",
                  layout: {},
                  style: { color: "#555555" },
                  props: { literal: "{{client.address}}" },
                },
              ],
            },
            {
              id: "invoice-details",
              type: "column",
              layout: { rowGap: 4, alignItems: "flex-end" },
              children: [
                {
                  id: "inv-no-row",
                  type: "row",
                  layout: { columnGap: 8 },
                  children: [
                    {
                      id: "l1",
                      type: "text",
                      layout: {},
                      style: { color: "#888888" },
                      props: { literal: "Invoice No:" },
                    },
                    {
                      id: "v1",
                      type: "text",
                      layout: {},
                      style: { fontWeight: "bold" },
                      props: { literal: "{{invoiceNumber}}" },
                    },
                  ],
                },
                {
                  id: "date-row",
                  type: "row",
                  layout: { columnGap: 8 },
                  children: [
                    {
                      id: "l2",
                      type: "text",
                      layout: {},
                      style: { color: "#888888" },
                      props: { literal: "Date:" },
                    },
                    {
                      id: "v2",
                      type: "text",
                      layout: {},
                      style: { fontWeight: "bold" },
                      props: { literal: "{{date}}" },
                    },
                  ],
                },
                {
                  id: "due-row",
                  type: "row",
                  layout: { columnGap: 8 },
                  children: [
                    {
                      id: "l3",
                      type: "text",
                      layout: {},
                      style: { color: "#888888" },
                      props: { literal: "Due Date:" },
                    },
                    {
                      id: "v3",
                      type: "text",
                      layout: {},
                      style: { fontWeight: "bold" },
                      props: { literal: "{{dueDate}}" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "items-table",
          type: "table",
          layout: { width: "100%" },
          bind: { path: "items" },
          props: {
            columns: [
              { headerText: "Description", bindPath: "description", flex: 2 },
              { headerText: "Qty", bindPath: "quantity", flex: 1 },
              { headerText: "Price", bindPath: "price", flex: 1 },
              { headerText: "Total", bindPath: "total", flex: 1 },
            ],
            styleConfig: {
              headerBackgroundColor: "#f9fafb",
              headerFontWeight: "bold",
              borderWidthPx: 0,
              cellPaddingPx: 12,
            },
          },
        },
        {
          id: "totals-row",
          type: "row",
          layout: { justifyContent: "flex-end", paddingTop: 20 },
          children: [
            {
              id: "totals-col",
              type: "column",
              layout: { rowGap: 8, width: 200 },
              children: [
                {
                  id: "subtotal-row",
                  type: "row",
                  layout: { justifyContent: "space-between" },
                  children: [
                    {
                      id: "sub-l",
                      type: "text",
                      layout: {},
                      props: { literal: "Subtotal" },
                    },
                    {
                      id: "sub-v",
                      type: "text",
                      layout: {},
                      props: { literal: "${{subtotal}}" },
                    },
                  ],
                },
                {
                  id: "tax-row",
                  type: "row",
                  layout: { justifyContent: "space-between" },
                  children: [
                    {
                      id: "tax-l",
                      type: "text",
                      layout: {},
                      props: { literal: "Tax (10%)" },
                    },
                    {
                      id: "tax-v",
                      type: "text",
                      layout: {},
                      props: { literal: "${{tax}}" },
                    },
                  ],
                },
                {
                  id: "total-row",
                  type: "row",
                  layout: {
                    justifyContent: "space-between",
                    paddingTop: 8,
                    borderTopWidth: 2,
                    borderTopColor: "#121212",
                    borderTopStyle: "solid",
                  },
                  children: [
                    {
                      id: "tot-l",
                      type: "text",
                      layout: {},
                      style: { fontWeight: "bold", fontSizePx: 16 },
                      props: { literal: "Total" },
                    },
                    {
                      id: "tot-v",
                      type: "text",
                      layout: {},
                      style: { fontWeight: "bold", fontSizePx: 16 },
                      props: { literal: "${{total}}" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const employeeOfferLetter: DocumentSchema = {
  version: 1,
  meta: {
    pageSize: "Letter",
    orientation: "portrait",
    baseUnit: "px",
    dpi: 96,
  },
  theme: {
    defaults: {
      base: {
        fontFamily: "Times New Roman, serif",
        fontSizePx: 14,
        color: "#000000",
      },
    },
  },
  data: {
    companyName: "Initech Corp",
    date: "August 3, 2026",
    candidate: { name: "Jane Doe", address: "789 Main St, Anytown, AT 12345" },
    role: {
      title: "Senior Software Engineer",
      department: "Engineering",
      manager: "Bill Lumbergh",
      salary: "$140,000",
      startDate: "September 1, 2026",
    },
  },
  definitions: { widgets: {} },
  document: {
    headers: {
      default: {
        heightPx: 100,
        root: {
          id: "header",
          type: "column",
          layout: {
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          },
          children: [
            {
              id: "logo",
              type: "text",
              layout: {},
              style: { fontSizePx: 24, fontWeight: "bold" },
              props: { literal: "INITECH" },
            },
          ],
        },
      },
    },
    footers: {},
    pageOverrides: {},
    body: {
      id: "body",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 60,
        paddingRight: 60,
        paddingTop: 40,
        paddingBottom: 40,
        rowGap: 20,
      },
      children: [
        {
          id: "date-and-address",
          type: "column",
          layout: { rowGap: 10 },
          children: [
            {
              id: "date",
              type: "text",
              layout: {},
              props: { literal: "{{date}}" },
            },
            {
              id: "spacer1",
              type: "spacer",
              layout: {},
              props: { sizePx: 20 },
            },
            {
              id: "cand-name",
              type: "text",
              layout: {},
              props: { literal: "{{candidate.name}}" },
            },
            {
              id: "cand-address",
              type: "text",
              layout: {},
              props: { literal: "{{candidate.address}}" },
            },
          ],
        },
        {
          id: "salutation",
          type: "text",
          layout: {},
          props: { literal: "Dear {{candidate.name}}," },
        },
        {
          id: "letter-body",
          type: "richText",
          layout: {},
          props: {
            htmlLiteral:
              "We are thrilled to offer you the position of <strong>{{role.title}}</strong> at <strong>{{companyName}}</strong>. In this role, you will be part of the {{role.department}} department, reporting directly to {{role.manager}}.<br/><br/>Your starting salary will be <strong>{{role.salary}}</strong> per year, paid on a semi-monthly basis. You will also be eligible for our comprehensive benefits package, including health insurance, 401(k) matching, and paid time off, starting on your first day of employment.<br/><br/>Your expected start date is <strong>{{role.startDate}}</strong>. Please review the enclosed employee handbook and non-disclosure agreement.<br/><br/>We are excited to have you join the team and look forward to your contributions.",
          },
        },
        {
          id: "closing",
          type: "text",
          layout: {},
          props: { literal: "Sincerely," },
        },
        {
          id: "sender",
          type: "text",
          layout: { marginTop: 40 },
          props: { literal: "Human Resources\n{{companyName}}" },
        },
        {
          id: "signature-block",
          type: "row",
          layout: {
            marginTop: 60,
            justifyContent: "space-between",
            width: "100%",
          },
          children: [
            {
              id: "cand-sig",
              type: "column",
              layout: {
                borderTopWidth: 1,
                borderTopStyle: "solid",
                width: 200,
                paddingTop: 10,
              },
              children: [
                {
                  id: "sig-label",
                  type: "text",
                  layout: {},
                  props: { literal: "Candidate Signature" },
                },
              ],
            },
            {
              id: "date-sig",
              type: "column",
              layout: {
                borderTopWidth: 1,
                borderTopStyle: "solid",
                width: 200,
                paddingTop: 10,
              },
              children: [
                {
                  id: "date-label",
                  type: "text",
                  layout: {},
                  props: { literal: "Date" },
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const medicalLabReport: DocumentSchema = {
  version: 1,
  meta: { pageSize: "A4", orientation: "portrait", baseUnit: "px", dpi: 96 },
  theme: {
    defaults: { base: { fontFamily: "Arial, sans-serif", fontSizePx: 11 } },
  },
  data: {
    clinic: "Central City Hospital",
    patient: {
      name: "John Smith",
      dob: "1980-05-15",
      gender: "Male",
      id: "PID-98765",
    },
    report: {
      date: "2023-11-02",
      doctor: "Dr. Alice Vance",
      sampleId: "SMP-123",
    },
    results: [
      {
        test: "Hemoglobin",
        result: "14.5",
        range: "13.8 - 17.2",
        unit: "g/dL",
        flag: "",
      },
      {
        test: "White Blood Cells",
        result: "11.2",
        range: "4.5 - 11.0",
        unit: "10^9/L",
        flag: "High",
      },
      {
        test: "Platelets",
        result: "250",
        range: "150 - 400",
        unit: "10^9/L",
        flag: "",
      },
      {
        test: "Glucose (Fasting)",
        result: "95",
        range: "70 - 100",
        unit: "mg/dL",
        flag: "",
      },
    ],
  },
  definitions: { widgets: {} },
  document: {
    headers: {
      default: {
        heightPx: 100,
        root: {
          id: "header",
          type: "row",
          layout: {
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
            borderBottomWidth: 2,
            borderBottomColor: "#005f9e",
            borderBottomStyle: "solid",
          },
          children: [
            {
              id: "h-title",
              type: "text",
              layout: {},
              style: { fontSizePx: 18, fontWeight: "bold", color: "#005f9e" },
              props: { literal: "LABORATORY REPORT" },
            },
            {
              id: "h-clinic",
              type: "text",
              layout: {},
              style: { fontWeight: "bold" },
              props: { literal: "{{clinic}}" },
            },
          ],
        },
      },
    },
    footers: {
      default: {
        heightPx: 60,
        root: {
          id: "footer",
          type: "column",
          layout: {
            justifyContent: "center",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopStyle: "solid",
          },
          children: [
            {
              id: "f-text",
              type: "text",
              layout: {},
              style: { fontSizePx: 9, color: "#666666" },
              props: { literal: "This is an electronically generated report." },
            },
          ],
        },
      },
    },
    pageOverrides: {},
    body: {
      id: "body",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        rowGap: 20,
      },
      children: [
        {
          id: "patient-info",
          type: "row",
          layout: {
            justifyContent: "space-between",
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 15,
            paddingRight: 15,
          },
          style: { backgroundColor: "#f0f8ff" },
          children: [
            {
              id: "pi-left",
              type: "column",
              layout: { rowGap: 5 },
              children: [
                {
                  id: "pi-name",
                  type: "text",
                  layout: {},
                  props: { literal: "Patient Name: {{patient.name}}" },
                },
                {
                  id: "pi-dob",
                  type: "text",
                  layout: {},
                  props: {
                    literal: "DOB: {{patient.dob}} ({{patient.gender}})",
                  },
                },
              ],
            },
            {
              id: "pi-right",
              type: "column",
              layout: { rowGap: 5 },
              children: [
                {
                  id: "pi-id",
                  type: "text",
                  layout: {},
                  props: { literal: "Patient ID: {{patient.id}}" },
                },
                {
                  id: "pi-date",
                  type: "text",
                  layout: {},
                  props: { literal: "Report Date: {{report.date}}" },
                },
              ],
            },
          ],
        },
        {
          id: "results-table",
          type: "table",
          layout: {},
          bind: { path: "results" },
          props: {
            columns: [
              { headerText: "Test Name", bindPath: "test", widthPx: 200 },
              { headerText: "Result", bindPath: "result", widthPx: 100 },
              { headerText: "Unit", bindPath: "unit", widthPx: 100 },
              {
                headerText: "Reference Range",
                bindPath: "range",
                widthPx: 150,
              },
              { headerText: "Flag", bindPath: "flag", widthPx: 80 },
            ],
            styleConfig: {
              headerBackgroundColor: "#e2e8f0",
              headerFontWeight: "bold",
              cellPaddingPx: 8,
              borderWidthPx: 1,
              borderColor: "#cbd5e1",
            },
          },
        },
        {
          id: "sig-block",
          type: "column",
          layout: { alignItems: "flex-end", marginTop: 40 },
          children: [
            {
              id: "sig-line",
              type: "text",
              layout: {},
              props: { literal: "___________________________" },
            },
            {
              id: "doc-name",
              type: "text",
              layout: { marginTop: 5 },
              props: { literal: "{{report.doctor}}" },
            },
            {
              id: "doc-title",
              type: "text",
              layout: {},
              style: { color: "#666666" },
              props: { literal: "Chief Pathologist" },
            },
          ],
        },
      ],
    },
  },
};

const ecommerceReceipt: DocumentSchema = {
  version: 1,
  meta: {
    pageSize: { widthPx: 300, heightPx: 600 },
    orientation: "portrait",
    baseUnit: "px",
    dpi: 96,
  },
  theme: {
    defaults: {
      base: { fontFamily: "monospace", fontSizePx: 12, color: "#000000" },
    },
  },
  data: {
    storeName: "FRESH MART",
    address: "123 Market St, City",
    date: "2023-10-25 14:32:00",
    receiptNo: "TXN-998877",
    items: [
      { name: "Milk 1L", qty: 2, price: "2.50", total: "5.00" },
      { name: "Bread", qty: 1, price: "3.00", total: "3.00" },
      { name: "Apples (kg)", qty: 1.5, price: "4.00", total: "6.00" },
    ],
    subtotal: "14.00",
    tax: "1.40",
    total: "15.40",
  },
  definitions: { widgets: {} },
  document: {
    headers: {},
    footers: {},
    pageOverrides: {},
    body: {
      id: "body",
      type: "root",
      layout: {
        direction: "column",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        rowGap: 10,
        alignItems: "center",
      },
      children: [
        {
          id: "r-store",
          type: "text",
          layout: {},
          style: { fontSizePx: 16, fontWeight: "bold" },
          props: { literal: "{{storeName}}" },
        },
        {
          id: "r-addr",
          type: "text",
          layout: {},
          props: { literal: "{{address}}" },
        },
        {
          id: "r-sep1",
          type: "text",
          layout: {},
          props: { literal: "--------------------------------" },
        },
        {
          id: "r-date",
          type: "text",
          layout: {},
          props: { literal: "Date: {{date}}" },
        },
        {
          id: "r-no",
          type: "text",
          layout: {},
          props: { literal: "Receipt: {{receiptNo}}" },
        },
        {
          id: "r-sep2",
          type: "text",
          layout: {},
          props: { literal: "--------------------------------" },
        },
        {
          id: "r-items",
          type: "table",
          layout: {},
          bind: { path: "items" },
          props: {
            columns: [
              { headerText: "Item", bindPath: "name", flex: 2 },
              { headerText: "Qty", bindPath: "qty", flex: 1 },
              { headerText: "Total", bindPath: "total", flex: 1 },
            ],
            styleConfig: { cellPaddingPx: 2, borderWidthPx: 0 },
          },
        },
        {
          id: "r-sep3",
          type: "text",
          layout: {},
          props: { literal: "--------------------------------" },
        },
        {
          id: "r-totals",
          type: "column",
          layout: { width: "100%", rowGap: 4 },
          children: [
            {
              id: "rt-sub",
              type: "row",
              layout: { justifyContent: "space-between" },
              children: [
                {
                  id: "l1",
                  type: "text",
                  layout: {},
                  props: { literal: "Subtotal" },
                },
                {
                  id: "v1",
                  type: "text",
                  layout: {},
                  props: { literal: "${{subtotal}}" },
                },
              ],
            },
            {
              id: "rt-tax",
              type: "row",
              layout: { justifyContent: "space-between" },
              children: [
                {
                  id: "l2",
                  type: "text",
                  layout: {},
                  props: { literal: "Tax" },
                },
                {
                  id: "v2",
                  type: "text",
                  layout: {},
                  props: { literal: "${{tax}}" },
                },
              ],
            },
            {
              id: "rt-tot",
              type: "row",
              layout: { justifyContent: "space-between" },
              children: [
                {
                  id: "l3",
                  type: "text",
                  layout: {},
                  style: { fontWeight: "bold" },
                  props: { literal: "TOTAL" },
                },
                {
                  id: "v3",
                  type: "text",
                  layout: {},
                  style: { fontWeight: "bold" },
                  props: { literal: "${{total}}" },
                },
              ],
            },
          ],
        },
        {
          id: "r-sep4",
          type: "text",
          layout: {},
          props: { literal: "--------------------------------" },
        },
        {
          id: "r-thanks",
          type: "text",
          layout: {},
          props: { literal: "Thank you for shopping with us!" },
        },
      ],
    },
  },
};

const businessProposal: DocumentSchema = {
  version: 1,
  meta: { pageSize: "A4", orientation: "portrait", baseUnit: "px", dpi: 96 },
  theme: {
    defaults: {
      base: { fontFamily: "Georgia, serif", color: "#333333", fontSizePx: 12 },
    },
  },
  data: {
    title: "Project Alpha Proposal",
    client: "Global Enterprises",
    author: "Consulting Group Inc.",
    date: "October 25, 2023",
  },
  definitions: { widgets: {} },
  document: {
    headers: {
      default: {
        heightPx: 60,
        root: {
          id: "header",
          type: "row",
          layout: {
            justifyContent: "flex-end",
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
          },
          children: [
            {
              id: "h-title",
              type: "text",
              layout: {},
              style: { color: "#999999", fontSizePx: 10 },
              props: { literal: "{{title}}" },
            },
          ],
        },
      },
    },
    footers: {
      default: {
        heightPx: 50,
        root: {
          id: "footer",
          type: "row",
          layout: { justifyContent: "center" },
          children: [
            {
              id: "page-num",
              type: "text",
              layout: {},
              style: { fontSizePx: 10 },
              props: { literal: "Page {{pageNumber}} of {{pageCount}}" },
            },
          ],
        },
      },
    },
    pageOverrides: {},
    body: {
      id: "body",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 60,
        paddingRight: 60,
        paddingTop: 40,
        rowGap: 20,
      },
      children: [
        {
          id: "cover-page",
          type: "column",
          layout: {
            height: 800,
            justifyContent: "center",
            alignItems: "center",
            rowGap: 20,
          },
          children: [
            {
              id: "cp-title",
              type: "text",
              layout: {},
              style: {
                fontSizePx: 36,
                fontWeight: "bold",
                textAlign: "center",
              },
              props: { literal: "{{title}}" },
            },
            {
              id: "cp-prep",
              type: "text",
              layout: {},
              style: { fontSizePx: 18 },
              props: { literal: "Prepared for: {{client}}" },
            },
            {
              id: "cp-auth",
              type: "text",
              layout: {},
              style: { fontSizePx: 14, color: "#666666" },
              props: { literal: "By: {{author}}" },
            },
            {
              id: "cp-date",
              type: "text",
              layout: { marginTop: 40 },
              props: { literal: "{{date}}" },
            },
          ],
        },
        {
          id: "exec-summary-title",
          type: "text",
          layout: {
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          },
          style: { fontSizePx: 24, fontWeight: "bold" },
          props: { literal: "Executive Summary" },
        },
        {
          id: "exec-summary-body",
          type: "richText",
          layout: {},
          props: {
            htmlLiteral:
              "This proposal outlines our approach to delivering <strong>Project Alpha</strong>. We understand that {{client}} requires a scalable, robust solution to address current market challenges. Our team at {{author}} has extensive experience in similar deployments, ensuring a smooth transition and maximized ROI.<br/><br/><h3>Objectives</h3><ul><li>Reduce operational costs by 20%.</li><li>Improve system uptime to 99.99%.</li><li>Modernize the technology stack.</li></ul>We propose a phased rollout over 6 months, beginning with a comprehensive audit.",
          },
        },
      ],
    },
  },
};

const simpleQuestionnaire: DocumentSchema = {
  version: 1,
  meta: { pageSize: "A4", orientation: "portrait", baseUnit: "px", dpi: 96 },
  theme: {
    defaults: {
      base: {
        fontFamily: "Arial, sans-serif",
        fontSizePx: 12,
        color: "#333333",
      },
    },
  },
  data: {
    title: "Customer Satisfaction Survey",
  },
  definitions: { widgets: {} },
  document: {
    headers: {},
    footers: {},
    pageOverrides: {},
    body: {
      id: "body",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 40,
        rowGap: 20,
      },
      children: [
        {
          id: "title",
          type: "text",
          layout: {},
          style: { fontSizePx: 24, fontWeight: "bold" },
          props: { literal: "{{title}}" },
        },
        {
          id: "desc",
          type: "text",
          layout: {},
          props: {
            literal: "Please take a moment to answer the following questions.",
          },
        },
        {
          id: "q1-group",
          type: "radioGroup",
          layout: { direction: "column", rowGap: 8 },
          props: { name: "q1" },
          children: [
            {
              id: "q1-text",
              type: "text",
              layout: {},
              style: { fontWeight: "bold" },
              props: { literal: "1. How satisfied are you with our service?" },
            },
            {
              id: "q1-r1",
              type: "radio",
              layout: {},
              props: {
                labelLiteral: "Very Satisfied",
                value: "very_satisfied",
                name: "q1",
              },
            },
            {
              id: "q1-r2",
              type: "radio",
              layout: {},
              props: {
                labelLiteral: "Satisfied",
                value: "satisfied",
                name: "q1",
              },
            },
            {
              id: "q1-r3",
              type: "radio",
              layout: {},
              props: { labelLiteral: "Neutral", value: "neutral", name: "q1" },
            },
            {
              id: "q1-r4",
              type: "radio",
              layout: {},
              props: {
                labelLiteral: "Dissatisfied",
                value: "dissatisfied",
                name: "q1",
              },
            },
          ],
        },
        {
          id: "q2-group",
          type: "radioGroup",
          layout: { direction: "column", rowGap: 8, marginTop: 10 },
          props: { name: "q2" },
          children: [
            {
              id: "q2-text",
              type: "text",
              layout: {},
              style: { fontWeight: "bold" },
              props: { literal: "2. Would you recommend us to a friend?" },
            },
            {
              id: "q2-r1",
              type: "radio",
              layout: {},
              props: { labelLiteral: "Yes", value: "yes", name: "q2" },
            },
            {
              id: "q2-r2",
              type: "radio",
              layout: {},
              props: { labelLiteral: "No", value: "no", name: "q2" },
            },
          ],
        },
      ],
    },
  },
};

const medicalIntakeForm: DocumentSchema = {
  version: 1,
  meta: { pageSize: "A4", orientation: "portrait", baseUnit: "px", dpi: 96 },
  theme: {
    defaults: {
      base: {
        fontFamily: "Arial, sans-serif",
        fontSizePx: 12,
        color: "#333333",
      },
    },
  },
  data: {
    patientName: "John Doe",
  },
  definitions: { widgets: {} },
  document: {
    headers: {
      default: {
        heightPx: 80,
        root: {
          id: "h",
          type: "column",
          layout: {
            paddingLeft: 40,
            paddingTop: 20,
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          },
          children: [
            {
              id: "h-title",
              type: "text",
              layout: {},
              style: { fontSizePx: 18, fontWeight: "bold" },
              props: { literal: "Medical Intake Form" },
            },
            {
              id: "h-pat",
              type: "text",
              layout: { marginTop: 10 },
              props: { literal: "Patient: {{patientName}}" },
            },
          ],
        },
      },
    },
    footers: {},
    pageOverrides: {},
    body: {
      id: "body",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        rowGap: 20,
      },
      children: [
        {
          id: "inst",
          type: "text",
          layout: {},
          props: {
            literal:
              "Please check all conditions that apply to your medical history:",
          },
        },
        {
          id: "grid",
          type: "row",
          layout: { flexWrap: "wrap", rowGap: 10, columnGap: 20 },
          children: [
            {
              id: "c1",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "High Blood Pressure" },
            },
            {
              id: "c2",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Diabetes" },
            },
            {
              id: "c3",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Heart Disease" },
            },
            {
              id: "c4",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Asthma" },
            },
            {
              id: "c5",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Cancer" },
            },
            {
              id: "c6",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Stroke" },
            },
            {
              id: "c7",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Arthritis" },
            },
            {
              id: "c8",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Epilepsy / Seizures" },
            },
            {
              id: "c9",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Kidney Disease" },
            },
            {
              id: "c10",
              type: "checkbox",
              layout: { width: 200 },
              props: { labelLiteral: "Thyroid Problems" },
            },
          ],
        },
      ],
    },
  },
};

const evaluationRubric: DocumentSchema = {
  version: 1,
  meta: { pageSize: "A4", orientation: "portrait", baseUnit: "px", dpi: 96 },
  theme: {
    defaults: {
      base: {
        fontFamily: "Arial, sans-serif",
        fontSizePx: 12,
        color: "#333333",
      },
    },
  },
  data: {
    studentName: "Alice Smith",
    project: "Final Term Paper",
  },
  definitions: { widgets: {} },
  document: {
    headers: {
      default: {
        heightPx: 60,
        root: {
          id: "hdr",
          type: "row",
          layout: {
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 2,
            borderBottomStyle: "solid",
            paddingBottom: 10,
            paddingTop: 20,
            paddingLeft: 40,
            paddingRight: 40,
          },
          children: [
            {
              id: "h-title",
              type: "text",
              layout: {},
              style: { fontSizePx: 16, fontWeight: "bold" },
              props: { literal: "Evaluation Rubric" },
            },
            {
              id: "h-stu",
              type: "text",
              layout: {},
              props: { literal: "{{studentName}} - {{project}}" },
            },
          ],
        },
      },
    },
    footers: {},
    pageOverrides: {},
    body: {
      id: "body",
      type: "root",
      layout: {
        direction: "column",
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 20,
        rowGap: 20,
      },
      children: [
        {
          id: "table-header",
          type: "row",
          layout: {
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            paddingBottom: 5,
          },
          style: { fontWeight: "bold" },
          children: [
            {
              id: "th-crit",
              type: "text",
              layout: { width: 250 },
              props: { literal: "Criteria" },
            },
            {
              id: "th-poor",
              type: "text",
              layout: { width: 80, textAlign: "center" },
              props: { literal: "Poor (1)" },
            },
            {
              id: "th-fair",
              type: "text",
              layout: { width: 80, textAlign: "center" },
              props: { literal: "Fair (2)" },
            },
            {
              id: "th-good",
              type: "text",
              layout: { width: 80, textAlign: "center" },
              props: { literal: "Good (3)" },
            },
            {
              id: "th-exc",
              type: "text",
              layout: { width: 80, textAlign: "center" },
              props: { literal: "Excellent (4)" },
            },
          ],
        },
        {
          id: "r1-grp",
          type: "radioGroup",
          layout: {
            direction: "row",
            paddingBottom: 10,
            paddingTop: 10,
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: "#eeeeee",
          },
          props: { name: "content" },
          children: [
            {
              id: "r1-crit",
              type: "text",
              layout: { width: 250 },
              props: { literal: "Content & Accuracy" },
            },
            {
              id: "r1-1",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "1", name: "content" },
            },
            {
              id: "r1-2",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "2", name: "content" },
            },
            {
              id: "r1-3",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "3", name: "content" },
            },
            {
              id: "r1-4",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "4", name: "content" },
            },
          ],
        },
        {
          id: "r2-grp",
          type: "radioGroup",
          layout: {
            direction: "row",
            paddingBottom: 10,
            paddingTop: 10,
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: "#eeeeee",
          },
          props: { name: "org" },
          children: [
            {
              id: "r2-crit",
              type: "text",
              layout: { width: 250 },
              props: { literal: "Organization & Structure" },
            },
            {
              id: "r2-1",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "1", name: "org" },
            },
            {
              id: "r2-2",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "2", name: "org" },
            },
            {
              id: "r2-3",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "3", name: "org" },
            },
            {
              id: "r2-4",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "4", name: "org" },
            },
          ],
        },
        {
          id: "r3-grp",
          type: "radioGroup",
          layout: {
            direction: "row",
            paddingBottom: 10,
            paddingTop: 10,
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            borderBottomColor: "#eeeeee",
          },
          props: { name: "style" },
          children: [
            {
              id: "r3-crit",
              type: "text",
              layout: { width: 250 },
              props: { literal: "Style & Grammar" },
            },
            {
              id: "r3-1",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "1", name: "style" },
            },
            {
              id: "r3-2",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "2", name: "style" },
            },
            {
              id: "r3-3",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "3", name: "style" },
            },
            {
              id: "r3-4",
              type: "radio",
              layout: { width: 80, justifyContent: "center" },
              props: { value: "4", name: "style" },
            },
          ],
        },
      ],
    },
  },
};

export const templateSnippets: SchemaSnippet[] = [
  {
    id: "modern-tech-invoice",
    name: "Modern Tech Invoice",
    description:
      "A sleek, minimalist invoice utilizing a dark mode header and sans-serif typography.",
    category: "templates",
    tags: ["invoice", "tech", "modern", "table"],
    schema: modernTechInvoice,
  },
  {
    id: "employee-offer-letter",
    name: "Employee Offer Letter",
    description:
      "A text-heavy document showcasing RichTextNode and data binding for a formal offer.",
    category: "templates",
    tags: ["letter", "hr", "offer", "richtext"],
    schema: employeeOfferLetter,
  },
  {
    id: "medical-lab-report",
    name: "Medical / Lab Report",
    description:
      "A clinical report with patient details and a tabular test results section.",
    category: "templates",
    tags: ["medical", "report", "table", "healthcare"],
    schema: medicalLabReport,
  },
  {
    id: "ecommerce-receipt",
    name: "E-commerce Receipt",
    description: "A narrow-format template optimized for receipt printers.",
    category: "templates",
    tags: ["receipt", "pos", "retail", "narrow"],
    schema: ecommerceReceipt,
  },
  {
    id: "business-proposal",
    name: "Business Proposal",
    description:
      "A multi-page document with a cover page and heavy typography styling.",
    category: "templates",
    tags: ["proposal", "business", "cover-page"],
    schema: businessProposal,
  },
  {
    id: "simple-questionnaire",
    name: "Simple Questionnaire",
    description:
      "A short survey using radio buttons for multiple-choice questions.",
    category: "templates",
    tags: ["form", "survey", "radio"],
    schema: simpleQuestionnaire,
  },
  {
    id: "medical-intake-form",
    name: "Medical Intake Form",
    description: "A dense grid of checkboxes for medical history questions.",
    category: "templates",
    tags: ["form", "medical", "checkbox", "grid"],
    schema: medicalIntakeForm,
  },
  {
    id: "evaluation-rubric",
    name: "Evaluation Rubric",
    description:
      "A matrix utilizing rows and radio groups for scoring criteria.",
    category: "templates",
    tags: ["form", "education", "matrix", "radio"],
    schema: evaluationRubric,
  },
];
