import { WidgetRegistryItem, wrap } from "../utils";
import {
  row,
  column,
  text,
  spacer,
  divider,
  addressBlock,
  summaryCard,
} from "@formcast/core";

export const layouts: WidgetRegistryItem[] = [
  {
    id: "two-col-address",
    categoryId: "layout",
    title: "Two Column Address Block",
    description: "Side-by-side Bill To and Ship To addresses.",
    schema: wrap(
      row(
        [
          addressBlock("BILL TO", [
            "customer.name",
            "customer.address",
            "customer.email",
          ]),
          addressBlock("SHIP TO", [
            "customer.name",
            "customer.address",
            "customer.email",
          ]),
        ],
        { justifyContent: "space-between", columnGap: 40 }
      ),
      160
    ),
  },
  {
    id: "summary-card",
    categoryId: "layout",
    title: "Financial Summary Card",
    description: "A bordered card highlighting the total amount due.",
    schema: wrap(
      summaryCard([
        { label: "Subtotal", value: "$4,500.00" },
        { label: "Tax (10%)", value: "$450.00" },
        { label: "Total Due", value: "$4,950.00" },
      ]),
      200
    ),
  },
  {
    id: "signature-block",
    categoryId: "layout",
    title: "Signature Block",
    description: "Space for authorized signatures.",
    schema: wrap(
      row(
        [
          column(
            [
              spacer(40),
              divider(),
              spacer(8),
              text("Authorized Signature", { fontWeight: "bold" }),
              spacer(4),
              text("Date: ______________", { color: "#666" }),
            ],
            { width: 250 }
          ),
          column(
            [
              spacer(40),
              divider(),
              spacer(8),
              text("Customer Signature", { fontWeight: "bold" }),
              spacer(4),
              text("Date: ______________", { color: "#666" }),
            ],
            { width: 250 }
          ),
        ],
        { justifyContent: "space-between" }
      ),
      150
    ),
  },
];
