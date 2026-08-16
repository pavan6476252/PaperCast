# Troubleshooting & Error Handling

## 1. "Invalid string length" / Ajv Crash

If you see an error like `Schema validation failed`, this means your payload failed the Ajv schema. PaperCast uses strict `anyOf` validation for `BaseNode`.

- **Cause 1:** Missing `layout: {}`. Every node MUST have a layout object.
- **Cause 2:** Providing `children` to a node that doesn't support it (e.g. `text`).
- **Cause 3:** Using wrong properties (e.g. using `content` instead of `literal` for `TextNode`).
- **Cause 4:** Stashing layout properties inside the `style` object. Margins, paddings, width, and height MUST reside in `layout`, while typography and colors belong in `style`.
- **Cause 5:** Using hallucinated properties like `widthPercent`. Always use valid BoxModel properties like `width: "100%"`.

> **Note**: If you load or create a new schema via the MCP Server and the Playground silently falls back to the default `p1` schema (or the node disappears), your payload was rejected. Review the JSON structure rigorously against these rules.

## 2. Empty Widgets on Canvas

If a widget renders as completely blank on the frontend canvas:

- You likely forgot the `literal` or `bind.path` property.
- A `text` widget will immediately short-circuit to `isEmpty = true` if `!props.literal` and `!bind.path`. Do not try to invent properties like `contentLiteral` or `htmlLiteral` for a basic text node.

## 3. Empty Tables

If a table renders empty rows:

- Ensure `bind.path` points to a valid array in the document `data`.
- Ensure `bind.mode` is set to `"repeat"`.
- Ensure each column object has a valid `bindPath` that corresponds to the keys inside the repeated array objects.
