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

## Custom Rows

Advanced usage allows injecting `customRows` (an array of `CustomTableRow` objects) for rendering summary rows (like sub-totals) at specific `index` points.
