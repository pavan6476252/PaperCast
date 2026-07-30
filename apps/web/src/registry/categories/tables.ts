import { table } from "@formcast/core";
import { WidgetRegistryItem, wrap } from "../utils";

export const tables: WidgetRegistryItem[] = [
  {
    id: "modern-table",
    categoryId: "tables",
    title: "Modern Line Items Table",
    description: "A clean table for invoice line items.",
    schema: wrap(
      table(
        [
          { headerText: "Description", bindPath: "items.desc", flex: 3 },
          {
            headerText: "Qty",
            bindPath: "items.qty",
            flex: 1,
            align: "center",
          },
          {
            headerText: "Rate",
            bindPath: "items.rate",
            flex: 1,
            align: "right",
          },
          {
            headerText: "Amount",
            bindPath: "items.total",
            flex: 1,
            align: "right",
          },
        ],
        "items"
      ),
      250
    ),
  },
  {
    id: "compact-table",
    categoryId: "tables",
    title: "Compact Data Table",
    description: "A dense data table used for displaying many records.",
    schema: wrap(
      table(
        [
          { headerText: "Item No.", bindPath: "items.qty", flex: 1 },
          { headerText: "Service Name", bindPath: "items.desc", flex: 4 },
          {
            headerText: "Unit Price",
            bindPath: "items.rate",
            flex: 1,
            align: "right",
          },
        ],
        "items"
      ),
      200
    ),
  },
];
