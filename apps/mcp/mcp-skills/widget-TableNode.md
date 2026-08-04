---
description: Documentation for TableNode, including columns, styling, and table footer rows.
---

# Table Widget

The `TableNode` is one of the most complex layout widgets. It is designed to iterate over an array in `schema.data` and automatically render headers and flex-based rows.

## Table Structure

Tables do **NOT** accept `children`. Instead, you define `TableColumnConfig` within `props.columns`, and you MUST provide a `bind` configuration pointing to an array.

## Core Properties

```json
{
  "id": "table-1",
  "type": "table",
  "layout": {},
  "bind": { "path": "invoice.items", "mode": "repeat" },
  "props": {
    "columns": [
      {
        "headerText": "Item Description",
        "bindPath": "description",
        "flex": 2,
        "align": "left"
      },
      {
        "headerText": "Total",
        "bindPath": "total",
        "widthPx": 100,
        "align": "right"
      }
    ],
    "hideHeaderOnSplit": false,
    "tableSplitBehaviour": "withHeader"
  }
}
```

## TableColumnConfig Reference

- `bindPath`: `string` (The key _inside_ the array object to read).
- `headerText`: `string` (The static title for the top of the column).
- `widthPx`: `number` (Fixed width override).
- `flex`: `number` (Flexbox expansion ratio).
- `align`: `"left" | "center" | "right"`.
- `hidden`: `boolean`.

## Table Footer Rows

Advanced usage allows injecting custom rows (like sub-totals or signatures) at the bottom of the table using `props.footerRows`.

Because table footer cells are nested inside `props` and are **not** standard standalone AST nodes with an `id`, you **cannot** use `insert_layout_element` to insert widgets into them.

Instead, you MUST use the specialized table tools:

1. **`set_table_footer_rows`**: Use this tool to define the grid structure of the footer (row spans, col spans) before inserting content.
2. **`add_node_to_table_footer_cell`**: Use this tool to instantiate and push a widget into a specific `(rowIndex, cellIndex)`.

### Example Footer Row Payload

When calling `set_table_footer_rows`, you provide an array of `TableFooterRow` objects.
**CRITICAL RULE (Row Span Pagination Lock):** The engine tracks `activeRowSpans` and will _never_ split a table across pages in the middle of a merged row. If you create a massive merged footer cell (e.g. `rowSpan: 10`) that exceeds the physical page height, the table will overflow and clip at the bottom of the PDF. Keep footer rows reasonably sized.

```json
[
  {
    "id": "footer-row-1",
    "cells": [
      { "colSpan": 2, "content": [] },
      { "colSpan": 1, "content": [] }
    ]
  }
]
```
