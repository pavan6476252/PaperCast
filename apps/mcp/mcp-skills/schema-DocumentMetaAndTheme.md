# Document Meta and Theme Schema

The FormCast engine allows controlling global page settings via `document.meta` and global styling defaults via `document.theme`.

## Document Meta

`document.meta` controls the physical canvas size, print DPI, and base units.

- `pageSize`: `"A4" | "A3" | "Letter" | { widthPx: number; heightPx: number }`
- `orientation`: `"portrait" | "landscape"`
- `baseUnit`: `"px"`
- `dpi`: `number` (typically 96)
- `richTextPreferences`: Defines default typography and box models for specific HTML tags when rendering rich text widgets.
  - **CRITICAL PAGINATION RULE**: By default, `richText` nodes are treated as atomic blocks and will NOT split across pages. If you have a massive block of HTML that must span multiple pages, you **MUST** set `richTextPreferences: { autoDeconstruct: true }`. This signals the engine to break the HTML down into splittable text chunks during pagination.

### Managing via MCP

You can natively merge updates into `document.meta` using the `update_document_meta` MCP tool.

- Pass a `patch` object (e.g., `{ pageSize: "Letter", orientation: "landscape" }`) and it will be deeply merged into the meta object.

## Document Theme

`document.theme` defines the global design system tokens (colors, typography).

- `defaults`: Can hold global typography settings that apply to all text widgets in the document if they don't explicitly override it.

### Managing via MCP

You can natively merge updates into `document.theme.defaults` using the `update_document_theme` MCP tool.

- Pass a `patch` object (e.g., `{ color: "#1e293b", fontSizePx: 14 }`) and it will be deeply merged into the theme defaults.
