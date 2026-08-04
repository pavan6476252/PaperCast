import { WidgetRegistryItem, wrap } from "../utils";
import { row, column, text, spacer, image, table } from "@papercast/core/test";

export const advanced: WidgetRegistryItem[] = [
  {
    id: "watermark-letterhead",
    categoryId: "advanced",
    title: "Watermark Letterhead",
    description: "Simulates a large watermark logo next to the content.",
    schema: wrap(
      row(
        [
          column(
            [
              text("company.name", { fontWeight: "bold", fontSizePx: 24 }),
              text("Official Corporate Communication", { color: "#666" }),
            ],
            { flexGrow: 1 }
          ),
          image("company.logo", 200, 100),
        ],
        { justifyContent: "space-between", alignItems: "center" }
      ),
      200
    ),
  },
  {
    id: "dashboard-split",
    categoryId: "advanced",
    title: "Dashboard Split View",
    description:
      "A split row containing both tabular data and a summary text column.",
    schema: wrap(
      row(
        [
          table(
            [
              { headerText: "Item", bindPath: "items.desc", flex: 2 },
              {
                headerText: "Cost",
                bindPath: "items.total",
                flex: 1,
                align: "right",
              },
            ],
            "items"
          ),
          spacer(24),
          {
            ...column(
              [
                text("Summary", { fontWeight: "bold", fontSizePx: 16 }),
                spacer(12),
                text(
                  "This month's expenses have increased by 15% due to additional server hosting and consulting fees.",
                  { lineHeight: 1.5, color: "#444" }
                ),
              ],
              {
                width: 250,
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 16,
                paddingBottom: 16,
              }
            ),
            layout: { backgroundColor: "#f8fafc" },
          },
        ],
        { alignItems: "flex-start" }
      ),
      250
    ),
  },
];
