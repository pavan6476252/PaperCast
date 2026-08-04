---
description: Documentation for properly defining repeating page Headers and Footers outside the main body using set_document_section and overrides.
---

# Headers and Footers

The FormCast engine automatically injects Headers and Footers during the Pagination phase.

## Declaration

Headers and footers are declared in dictionaries outside the main body.
**IMPORTANT**: They are stored as strictly typed dictionaries under `document.headers` and `document.footers`. Do NOT use arrays or hallucinated keys like `pageHeader` or `pageFooter`.

```json
{
  "document": {
    "headers": {
      "main-header": {
        "condition": "all",
        "root": {
          "id": "header-root",
          "type": "row",
          "layout": { "paddingBottom": 20 },
          "children": []
        }
      }
    },
    "footers": {}
  }
}
```

- `condition`: `"all" | "first" | "last" | "even" | "odd" | "other"`

## Condition Uniqueness Rule

**CRITICAL PITFALL**: The built-in condition types (`all`, `first`, `last`, `even`, `odd`) MUST BE UNIQUE across all headers (and similarly unique across all footers).

- You **cannot** have two headers with `condition: "all"`. If you create a new header with `condition: "all"` without deleting or modifying the existing one, the engine will detect a conflict and fail to render them.
- **Before creating** a new header or footer via `set_document_section`, you MUST check if a section with the same condition already exists.
- If it exists, you must either:
  1. OVERWRITE the existing section by using its exact key (e.g. if `"main-header"` has `"all"`, just update `"main-header"`).
  2. DELETE the existing section first (using `delete_document_section`) before creating a new section with a different key.

## Custom Condition Block

**CRITICAL RULE**: Do **NOT** use custom condition expressions (e.g., `{ "type": "custom", "expression": "..." }`) for headers or footers. The FormCast engine explicitly blocks custom expressions (`console.warn("Custom RegionConditions are not yet implemented")`) for security reasons. They will always evaluate to `false` and your header/footer will never render.

## Resolving Priority

The Pagination Engine evaluates headers/footers in this strict order:

1. **`pageOverrides`**: ALWAYS evaluated first. If `pageOverrides["1"].headerId` is set to `"first"`, it will look for the `"first"` header. This is where `"other"` condition headers are usually mapped. **CRITICAL PITFALL**: If `pageOverrides` points to a header/footer key that has been deleted, the engine will NOT fall back; it will simply render blank space. You must use `set_page_override` to clear or remap overrides if you delete the target section.
2. `first` (if page 1) or `last` (if last page)
3. `even` (if page % 2 === 0) or `odd`
4. `all` (fallback)

## Managing via MCP

You can natively manage these sections using the following MCP tools:

- `set_document_section`: Upserts a complete section dictionary (like `"main-header"`) into the document.
- `delete_document_section`: Deletes a section definition completely. **CRITICAL:** If you want a fallback condition (like `"all"`) to render, you MUST delete higher-priority sections (like `"odd"` or `"even"`) using this tool!
- `set_page_override`: Allows setting a specific `headerId` or `footerId` for an absolute page number (or pass `null` to explicitly hide them on that page).

## Assignment

You do not need to assign a "default ID" explicitly. The engine automatically resolves headers and footers based on their `condition`.

- **Default Header**: If you want a header to appear on all pages by default, create a section with `condition: "all"`. The engine will naturally fall back to it.
- **Page Overrides**: If you want to override a specific absolute page (like page 1), use `set_page_override` to map that page number to a specific header key, or pass `null` to explicitly hide it.
  - _Example_: `document.pageOverrides = { "1": { headerId: null, footerId: "first-page-footer" } }`
