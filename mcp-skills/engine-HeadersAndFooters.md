# Headers and Footers

The FormCast engine automatically injects Headers and Footers during the Pagination phase.

## Declaration

Headers and footers are declared in dictionaries outside the main body.

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

You must explicitly assign a header to the document.

- `document.headerDefaultId`: Sets the default header for every page (e.g., `"main-header"`).
- `document.pageOverrides`: `Record<string, { headerId?: string, footerId?: string }>` (e.g. override page "1" to have no header).
