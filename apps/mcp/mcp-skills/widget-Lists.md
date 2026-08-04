---
description: Documentation for UnorderedListNode (ul) and OrderedListNode (ol) for rendering standard lists and bullets.
---

# List Widgets (`ul` and `ol`)

FormCast supports standard HTML-like lists using `ul` (Unordered List) and `ol` (Ordered List) widgets.

Like `row` and `column`, these widgets act as layout containers and accept a `children` array. You can place any widget inside a list, but it is typically used with `text` or `listTile` nodes.

## Unordered List (`ul`)

Renders its children with standard bullet points.

```json
{
  "id": "ul-1",
  "type": "ul",
  "layout": {},
  "children": [
    {
      "id": "text-1",
      "type": "text",
      "layout": {},
      "props": { "literal": "First bullet point" }
    }
  ]
}
```

## Ordered List (`ol`)

Renders its children with numbered points.

```json
{
  "id": "ol-1",
  "type": "ol",
  "layout": {},
  "children": [
    {
      "id": "text-2",
      "type": "text",
      "layout": {},
      "props": { "literal": "First numbered point" }
    }
  ]
}
```

## Data Binding Lists

To dynamically generate list items from an array in `schema.data`, use the `bind` property on the list container and set `mode: "repeat"`. The list will clone its `children` template for each item in the data array.
