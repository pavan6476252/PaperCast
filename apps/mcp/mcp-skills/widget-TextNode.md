# Text & RichText Widgets

PaperCast provides two distinct nodes for rendering textual content: `text` and `richText`.

## 1. TextNode (`text`)

A `TextNode` displays string data. While it is meant for simple strings, the **Playground Editor** now natively supports inline formatting (bold, italic, colors) for basic `text` nodes via the `InlineRichTextEditor`.

This means `props.literal` can actually contain simple HTML tags (e.g. `<strong>`, `<em>`), which the engine safely parses during rendering.

```json
{
  "id": "text-1",
  "type": "text",
  "layout": {},
  "config": {
    "lockContent": true
  },
  "props": {
    "literal": "Total Amount: <strong>$100.00</strong>",
    "isAnchor": false,
    "hrefLiteral": "https://google.com"
  },
  "bind": {
    "path": "invoice.total"
  }
}
```

### Properties

- **literal**: The raw string (or inline HTML string). This is ignored if `bind.path` is set and resolves to data.
- **isAnchor**: Optional boolean. If true, wraps the text in an `<a>` tag.
- **hrefLiteral**: Optional string. Link destination.
- **hrefBind**: Optional string. JSON path pointing to a dynamic link destination.

### Data Binding vs Literal (`TextPropertyEditor`)

In the PaperCast visual editor, the `TextPropertyEditor` intelligently switches based on bindings:

- If a user sets `bind.path`, the UI removes the ability to type a literal string, because the dynamic data will completely override `props.literal` at runtime.
- A "Reset to Literal" button destroys the `bind` object, allowing the user to type static text again using the `InlineRichTextEditor`.

## 2. RichTextNode (`richText`)

A `RichTextNode` is designed for complex, massive blocks of HTML that might contain structural block tags (like `<p>`, `<h1>`, `<ul>`, `<li>`).

```json
{
  "id": "rich-text-1",
  "type": "richText",
  "layout": {},
  "config": {
    "autoDeconstruct": true,
    "lockContent": false
  },
  "props": {
    "htmlLiteral": "<p>Paragraph 1</p><p>Paragraph 2</p>"
  }
}
```

### Properties

- **htmlLiteral**: The raw HTML string. Ignored if `htmlBind` is active.
- **htmlBind**: Path to dynamic HTML in the schema data.

### Interpolation & Normalization

When constructing documents server-side (before they are loaded into the PaperCast engine), you might inject data directly into a Rich Text string like `"<p>Name: {{ user.name }}</p>"`.
If `autoDeconstruct` is `true` during the **initial document load**, the HTML parser will read this string, split the tags into basic `text` nodes, and preserve the `{{ user.name }}` as literal text (which the engine's `resolver` will then bind to the `user.name` data path at runtime).

_Note_: `autoDeconstruct` runs destructively when the document is first loaded into the store. It does not actively "watch" for new HTML to parse if you dynamically inject HTML _after_ the document has already initialized.

### Pagination Splitting (`autoDeconstruct`)

By default, the Pagination Engine treats `richText` as a solid, atomic block. If the HTML is taller than a page, it will violently overflow the PDF.
To fix this, you must set `"config": { "autoDeconstruct": true }`. This tells the engine to automatically break down block-level tags into splittable AST chunks (`row`, `text`) before pagination occurs.

## 3. Content Locking (`lockContent`)

Both `text` and `richText` support Content Locking.

If you want to allow a user to change the visual styling (font size, color, margins) but completely forbid them from changing the actual text data, set `"config": { "lockContent": true }`.

- The client-side `InlineRichTextEditor` will become read-only to keyboard input.
- The server-side AST guardrail will throw an error if the `literal`, `htmlLiteral`, or `bind.path` is modified.
