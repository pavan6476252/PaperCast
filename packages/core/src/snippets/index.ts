export * from "./types";
import { headerSnippets } from "./headers";
import { footerSnippets } from "./footers";
import { layoutSnippets } from "./layouts";
import { invoiceSnippets } from "./invoices";
import { tableSnippets } from "./tables";
import { templateSnippets } from "./templates";

export const SNIPPETS = [
  ...headerSnippets,
  ...footerSnippets,
  ...layoutSnippets,
  ...invoiceSnippets,
  ...tableSnippets,
  ...templateSnippets,
];
