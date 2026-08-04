# BoxModel Schema (Layout)

The `layout` object on a `BaseNode` controls flexbox positioning, dimensions, spacing, borders, and pagination hints.

## Dimensions & Spacing

- `width`, `height`, `minHeight`: Accepts `number` (px) or `string` (e.g. "100%").
- `marginTop`, `marginRight`, `marginBottom`, `marginLeft`: `number` (px).
- `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`: `number` (px).

## Background

- `backgroundColor`: `string` (Hex)

## Flex / Flow Controls

FormCast translates layout directions directly into CSS flexbox behaviors.

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
