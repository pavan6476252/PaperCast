# BoxModel Schema (Layout)

The `layout` object on a `BaseNode` controls flexbox positioning, dimensions, spacing, borders, and pagination hints.

## Dimensions & Spacing

- `width`, `height`, `minHeight`: Accepts `number` (px) or `string` (e.g. "100%").
- `marginTop`, `marginRight`, `marginBottom`, `marginLeft`: `number` (px).
- `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`: `number` (px).

## Background

- `backgroundColor`: `string` (Hex)

## Flex / Flow Controls

PaperCast translates layout directions directly into CSS flexbox behaviors.

- `direction`: `"row"` | `"column"`
- `wrap`: `boolean` (Legacy)
- `flexWrap`: `"nowrap" | "wrap" | "wrap-reverse"`
- `justifyContent`: `"flex-start" | "center" | "flex-end" | "space-between" | "space-around"`
- `alignItems`: `"flex-start" | "center" | "flex-end" | "stretch"`
- `rowGap`, `columnGap`: `number` (px)
- `flexGrow`, `flexShrink`: `number`
- `flexBasis`, `flex`: `number` or `string`

## Borders

- `borderTopWidth`, `borderRightWidth`, `borderBottomWidth`, `borderLeftWidth`: `number`
- `borderTopStyle`, `borderRightStyle`, `borderBottomStyle`, `borderLeftStyle`: `"solid" | "dashed" | "none"`
- `borderTopColor`, `borderRightColor`, `borderBottomColor`, `borderLeftColor`: `string` (Hex)
- `borderRadius`, `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomRightRadius`, `borderBottomLeftRadius`: `number`

## Pagination Hints

- `breakInside`: `"auto" | "avoid"`
- `keepWithNext`: `boolean`
- `pageBreakBefore`: `boolean`

> [!NOTE]
> The `PaginationEngine` actively evaluates `pageBreakBefore` during pagination. If a block has `"pageBreakBefore": true`, the engine will seamlessly finalize the current page and forcefully place the block at the top of a new page.

## 🚨 Strict Schema Guardrails

PaperCast rigorously enforces the schema structure. If a layout block violates these rules, the backend engine or visual editor will instantly reject the payload or silently strip the invalid configuration.

1. **No Hallucinated Properties**: Do **NOT** use non-existent properties (e.g., `widthPercent: 100`). Instead, use the officially supported properties (e.g., `width: "100%"`).
2. **Separation of Concerns (Layout vs Style)**: All Box Model dimensions, spacing (margins and padding), and flexbox behaviors MUST reside strictly inside the `layout: {}` object. Do **NOT** mistakenly place layout properties (like `marginTop` or `paddingLeft`) inside the `style: {}` object, as they will be rejected by the type validator.
