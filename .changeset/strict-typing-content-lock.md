---
"@papercast/core": minor
"@papercast/react": patch
"@papercast/mcp": patch
---

- Added `lockContent` to node-level configuration (`NodeConfig`) to prevent textual modifications on specific nodes.
- Migrated `RichTextPreferences` (`autoDeconstruct` and `tagStyles`) from a global configuration in `meta` directly to node-level `config`.
- Enforced strict type discrimination across AST manipulation functions, eliminating `any` types and `TS2339` errors for missing properties.
- Fixed `SetContentOptions` signature mismatch in InlineRichTextEditor for TipTap v2 compatibility.
