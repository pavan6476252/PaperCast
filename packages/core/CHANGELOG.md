# @papercast/core

## 0.3.0

### Minor Changes

- [#48](https://github.com/pavan6476252/PaperCast/pull/48) [`a31309e`](https://github.com/pavan6476252/PaperCast/commit/a31309e76365175de684ff9366655cf7056c9b83) Thanks [@pavan6476252](https://github.com/pavan6476252)! - Feature: Third-party playground embedding via postMessage API

  - Adds third-party embedding support via `postMessage` API
  - Updates the core logic to support & check the capabilities of the playground
  - Updates engineering blogs to use scalable mermaid SVG banners

## 0.2.0

### Minor Changes

- [#34](https://github.com/pavan6476252/PaperCast/pull/34) [`c1eae9f`](https://github.com/pavan6476252/PaperCast/commit/c1eae9f42c83f29ba91966efbf117c28eec820d6) Thanks [@pavan6476252](https://github.com/pavan6476252)! - - @papercast/core: Added optional `title` property to DocumentSchema meta configuration for custom PDF naming.
  - @papercast/react: Removed hardcoded `minHeight` from row and column layout nodes and implemented dynamic `empty-widget` visual indicators for better print rendering, while ensuring the "Empty" text is hidden and sizes are preserved during PDF export.

- [#38](https://github.com/pavan6476252/PaperCast/pull/38) [`501be8c`](https://github.com/pavan6476252/PaperCast/commit/501be8c31bd63230aeda10d032b50bbc9fe44c79) Thanks [@pavan6476252](https://github.com/pavan6476252)! - - Added `lockContent` to node-level configuration (`NodeConfig`) to prevent textual modifications on specific nodes.
  - Migrated `RichTextPreferences` (`autoDeconstruct` and `tagStyles`) from a global configuration in `meta` directly to node-level `config`.
  - Enforced strict type discrimination across AST manipulation functions, eliminating `any` types and `TS2339` errors for missing properties.
  - Fixed `SetContentOptions` signature mismatch in InlineRichTextEditor for TipTap v2 compatibility.
