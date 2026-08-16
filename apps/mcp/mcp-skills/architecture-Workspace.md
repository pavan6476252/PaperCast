---
description: Read this to understand how to interact with the PaperCast workspace (saving, loading, and creating local IndexedDB schemas) via the MCP Server.
---

# PaperCast Architecture: Workspace Management

PaperCast supports persisting user schemas across sessions using the browser's IndexedDB. The MCP server can interact with this storage engine, allowing you to manage multiple schemas seamlessly.

## Workspace Core Tools

When remote-controlling the website, you can use the following tools to manage the user's workspace:

1. **`workspace_list_schemas`**: Lists all locally saved schemas. Use this when the user asks you to "find my saved schemas" or "open the invoice template". The tool returns an array of metadata, including the schema `id` and `name`.
2. **`workspace_load_schema`**: Command the browser to load a specific schema by `id` into the active editor session.
3. **`workspace_save_schema`**: Tell the browser to save the current playground state. If the user is working on an unnamed schema, it will create one named "Saved Schema". If they are working on an active schema, it overwrites the existing entry.
4. **`workspace_create_schema`**: Create a brand new schema in the user's browser and immediately switch to it.
   - **Duplicating**: If you provide a `name` without providing a `schema` payload, it will duplicate the current editor contents into the new schema.
   - **Fresh Start**: If you provide both `name` and a `schema` payload, it will initialize the new schema with your data.
   > 🚨 **CRITICAL**: The `schema` parameter MUST be a valid JSON **Object**, NOT a stringified JSON string! If you pass a stringified JSON payload (e.g. `"{\"version\":1}"`), it will be double-stringified during synchronization, severely corrupting the editor state. Always construct and pass an unescaped object.
5. **`workspace_delete_schema`**: Delete a schema from the user's workspace by `id`.

## Usage Workflow

If a user asks you to:

- **"Save my work"**: Just call `workspace_save_schema`.
- **"Create a new document for a receipt"**: Call `workspace_create_schema` with `name="Receipt"`. You do not need to wipe the current document first. The browser will automatically switch their active tab to the new Receipt schema.
- **"Load the 'Weekly Report' schema"**: Call `workspace_list_schemas`, find the ID for 'Weekly Report', and call `workspace_load_schema(id)`.
