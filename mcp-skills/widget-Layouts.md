# Layout Widgets

Layout widgets are the backbone of FormCast. They are the **only** widgets (alongside `root` and `orderedList`) that accept a `children` array.

## RowNode

Translates to a `flex-direction: row`.

```json
{
  "id": "row-1",
  "type": "row",
  "layout": { "columnGap": 12 },
  "children": []
}
```

## ColumnNode

Translates to a `flex-direction: column`.

```json
{
  "id": "col-1",
  "type": "column",
  "layout": { "rowGap": 12 },
  "children": []
}
```

## SpacerNode

A utility widget that acts as an empty block of space.

```json
{
  "id": "spacer-1",
  "type": "spacer",
  "layout": {},
  "props": {
    "sizePx": 24
  }
}
```
