# @papercast/mcp

## 0.2.0

### Minor Changes

- [#48](https://github.com/pavan6476252/PaperCast/pull/48) [`a31309e`](https://github.com/pavan6476252/PaperCast/commit/a31309e76365175de684ff9366655cf7056c9b83) Thanks [@pavan6476252](https://github.com/pavan6476252)! - Feature: Third-party playground embedding via postMessage API

  - Adds third-party embedding support via `postMessage` API
  - Updates the core logic to support & check the capabilities of the playground
  - Updates engineering blogs to use scalable mermaid SVG banners

### Patch Changes

- Updated dependencies [[`a31309e`](https://github.com/pavan6476252/PaperCast/commit/a31309e76365175de684ff9366655cf7056c9b83)]:
  - @papercast/core@0.3.0

## 0.1.3

### Patch Changes

- [#38](https://github.com/pavan6476252/PaperCast/pull/38) [`501be8c`](https://github.com/pavan6476252/PaperCast/commit/501be8c31bd63230aeda10d032b50bbc9fe44c79) Thanks [@pavan6476252](https://github.com/pavan6476252)! - - Added `lockContent` to node-level configuration (`NodeConfig`) to prevent textual modifications on specific nodes.
  - Migrated `RichTextPreferences` (`autoDeconstruct` and `tagStyles`) from a global configuration in `meta` directly to node-level `config`.
  - Enforced strict type discrimination across AST manipulation functions, eliminating `any` types and `TS2339` errors for missing properties.
  - Fixed `SetContentOptions` signature mismatch in InlineRichTextEditor for TipTap v2 compatibility.
- Updated dependencies [[`c1eae9f`](https://github.com/pavan6476252/PaperCast/commit/c1eae9f42c83f29ba91966efbf117c28eec820d6), [`501be8c`](https://github.com/pavan6476252/PaperCast/commit/501be8c31bd63230aeda10d032b50bbc9fe44c79)]:
  - @papercast/core@0.2.0

## 0.1.2

### Patch Changes

- [#19](https://github.com/pavan6476252/PaperCast/pull/19) [`16328ef`](https://github.com/pavan6476252/PaperCast/commit/16328efc61de1d6dba2df3f90aeaec21c015f7c2) Thanks [@pavan6476252](https://github.com/pavan6476252)! - Fix memory exhaustion during schema validation and add MCP server crash reporting and tool error boundaries.

## 0.1.1

### Patch Changes

- [#16](https://github.com/pavan6476252/PaperCast/pull/16) [`871534e`](https://github.com/pavan6476252/PaperCast/commit/871534eae98b17806290cd6e6d9383b40aedfd77) Thanks [@pavan6476252](https://github.com/pavan6476252)! - Fix missing Node shebang in the MCP CLI binary preventing execution.
