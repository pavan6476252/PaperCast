# AST Manipulation Rules

When modifying the PaperCast JSON AST, you must follow strict schema guidelines.

## 1. Node Structure

Every node must extend `BaseNode` and have at least:

```json
{
  "id": "unique-id",
  "type": "row|column|text|image|etc",
  "layout": {}
}
```

**CRITICAL:** The `layout` object is strictly required by Ajv, even if it is empty `{}`. Omitting it will crash validation.

## 2. Children

Only layout widgets (`row`, `column`, `root`) accept the `children` array. Content widgets (`text`, `image`) do NOT accept children.

## 3. High-Level Tools vs Manual Insertion

When adding a basic Text or Table, ALWAYS use the provided MCP tools (`add_text_widget`, `add_table_widget`). These tools securely wrap the nodes in the necessary `layout` and prevent validation errors. Only construct raw JSON objects if you are dealing with complex layouts (e.g., nesting rows inside columns).

## 4. Atomic Node Overflow

**CRITICAL RULE:** The PaperCast engine does NOT magically scale down elements to fit onto a single page. If an atomic node (like an `image`, a `spacer`, or a massive block of basic `text`) is taller than the physical `pageHeight`, the Pagination Engine will be forced to push it onto the page without splitting it, causing it to violently overflow and clip at the bottom of the PDF.

- Always apply sensible `height` constraints or `fit: "contain"` to images.
- If you have a massive block of HTML text that must split across pages, you MUST use the `richText` widget instead of standard `text`, and ensure it has `"config": { "autoDeconstruct": true }` set on its node level to allow pagination splitting.

## 5. Strict Type Safety (Zero Tolerance)

**CRITICAL RULE:** When writing TypeScript for AST modifications or writing custom node registries, you must never escape TypeScript type checks by casting to `any` or by casting to a parent type.

- Use TypeScript Module Augmentation for custom widgets (via `CustomNodesRegistry`).
- If you need to access properties conditionally, use properly discriminated unions (e.g., `node.type === "richText"`).
- Avoid `.props` access on `AnyNode` without first checking the `node.type`.
