import { _TEST_DOCUMENT } from "../test.data";
import { SchemaSnippet } from "./types";

export const invoiceSnippets: SchemaSnippet[] = [
  {
    id: "standard-invoice",
    name: "Standard Invoice",
    description:
      "A complete multi-page tax invoice template with headers, footers, and a data table.",
    category: "invoices",
    tags: ["invoice", "tax", "billing", "table", "multi-page"],
    schema: _TEST_DOCUMENT,
  },
];
