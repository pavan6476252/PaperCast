# BaseNode Schema

Every single element in the PaperCast AST must satisfy `BaseNodeCommon`.

## Core Required Structure

```json
{
  "id": "unique-id",
  "type": "string",
  "layout": {}
}
```

**CRITICAL:** The `layout` object is strictly required by the `papercast.schema.json` Ajv validation. Omitting it will crash the validation process.

## Optional Core Properties

- `style`: Applies `TypographyAndColor` definitions (fonts, colors, alignment).
- `bind`: Applies `DataBinding` definitions (mapping schema data to the node).
- `children`: An array of `BaseNode[]`. Only structural layout nodes like `row`, `column`, and `root` should have children. Content widgets like `text` or `image` do not accept children.
- `overrides`: `Record<string, Partial<BaseNode>>` - Advanced usage for themes.
