# Text & RichText Widgets

## TextNode

A basic `TextNode` displays raw strings. It will render completely blank if you do not provide `props.literal` or a valid `bind.path`.

```json
{
  "id": "text-1",
  "type": "text",
  "layout": {},
  "props": {
    "literal": "Static String Display",
    "isAnchor": false,
    "hrefLiteral": "https://google.com"
  }
}
```

- **literal**: Optional if `bind.path` is set. The raw string.
- **isAnchor**: Optional boolean. If true, wraps the text in an `<a>` tag.
- **hrefLiteral**: Optional string. Link destination.
- **hrefBind**: Optional string. JSON path pointing to a link destination.

## RichTextNode

A `RichTextNode` parses HTML tags (like `<b>`, `<i>`, `<p>`).

```json
{
  "id": "rich-text-1",
  "type": "richText",
  "layout": {},
  "props": {
    "htmlLiteral": "<p>This is <b>bold</b> text!</p>"
  }
}
```

- **htmlLiteral**: Optional if `htmlBind` is set. The raw HTML string.
- **htmlBind**: Optional string. Path to dynamic HTML in the schema data.
