# DataBinding Schema

The `bind` object on a `BaseNode` is used to dynamically map properties from `schema.data` directly into the widget.

## Properties

- `path`: `string` (e.g., "customer.name" or "invoice.items"). This is the JSON path targeting the data.
- `mode`: `"single" | "repeat"`
  - Use `"single"` (default) for pulling a single value like a string into a Text widget.
  - Use `"repeat"` for iterating over an array. Used heavily on Table rows and List widgets.
- `itemAlias`: `string` (Optional variable name for the iterated item).
- `layoutMode`: `"stack" | "grid"` (Optional, defines how repeated items are laid out).
- `columns`: `number` (Optional, used if `layoutMode` is `"grid"`).

## Scope and Item Alias Lookup

When a parent node uses `mode: "repeat"`, it iterates over the array specified in `path`.
The engine creates a **local data scope** for each child rendered inside that iteration.

- If `itemAlias` is provided (e.g., `itemAlias: "item"`), the children DO NOT need to prefix their bindings with `item.`.
- The engine's logic checks the local scope first. If a child defines `bindPath: "sku"` or `"path": "sku"`, it will directly extract `sku` from the current iterated object.
- If the property is not found in the local iterated object, it falls back to checking the global `document.data`.

### Example: Table Repeat Bind

```json
{
  "type": "table",
  "bind": {
    "path": "items",
    "mode": "repeat",
    "itemAlias": "item"
  },
  "props": {
    "columns": [
      {
        "headerText": "SKU",
        "bindPath": "sku" // Notice we use "sku", not "item.sku"
      },
      {
        "headerText": "Description",
        "bindPath": "description"
      }
    ]
  }
}
```

## Example: Simple Text Bind

```json
{
  "type": "text",
  "layout": {},
  "bind": { "path": "customer.address" }
}
```

## Managing Document Data via MCP

The JSON payload that drives all `bind` variables is stored at the top level in `document.data`.
You can update the actual runtime payload using the `update_document_data` MCP tool:

- Pass a `data` object containing the properties you want to update (e.g. `{ customer: { name: "New Name" } }`).
- The MCP server will automatically deeply merge your passed data payload into the existing `document.data` object, preventing accidental data loss of arrays or unrelated keys.
