# Troubleshooting & Error Handling

## 1. "Invalid string length" / Ajv Crash

If you see an error like `Schema validation failed`, this means your payload failed the Ajv schema. FormCast uses strict `anyOf` validation for `BaseNode`.

- **Cause 1:** Missing `layout: {}`. Every node MUST have a layout object.
- **Cause 2:** Providing `children` to a node that doesn't support it (e.g. `text`).
- **Cause 3:** Using wrong properties (e.g. using `content` instead of `literal` for `TextNode`).

## 2. Empty Widgets on Canvas

If a widget renders as completely blank on the frontend canvas:

- You likely forgot the `literal` or `bind.path` property.
- A `text` widget will immediately short-circuit to `isEmpty = true` if `!props.literal` and `!bind.path`. Do not try to invent properties like `contentLiteral` or `htmlLiteral` for a basic text node.

## 3. Empty Tables

If a table renders empty rows:

- Ensure `bind.path` points to a valid array in the document `data`.
- Ensure `bind.mode` is set to `"repeat"`.
- Ensure each column object has a valid `bindPath` that corresponds to the keys inside the repeated array objects.
