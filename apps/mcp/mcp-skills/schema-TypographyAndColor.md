# TypographyAndColor Schema (Style)

The `style` object on a `BaseNode` strictly dictates fonts, text alignment, and colors. This does NOT handle positioning or layout.

## Properties

- `fontFamily`: `string` (e.g., "Inter, sans-serif")
- `fontSizePx`: `number`
- `fontWeight`: `"normal" | "bold" | number` (e.g., 400, 700)
- `fontStyle`: `"normal" | "italic"`
- `textDecoration`: `"none" | "underline"`
- `textAlign`: `"left" | "center" | "right" | "justify"`
- `color`: `string` (Hex code e.g., "#000000")
- `lineHeight`: `number` (e.g., 1.5)
