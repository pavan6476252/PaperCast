---
description: Read this to understand how the MCP server interacts with the PaperCast website via WebSockets as a remote control.
---

# PaperCast Architecture: Remote Control

If a user tells you to "connect to the website", "look at the playground", or "build an invoice on the site", you need to understand the architecture of this environment.

## The WebSocket Connection

You (the AI Agent) do **not** need a traditional web browser, `curl`, or scraper tools to interact with the website.
The PaperCast MCP Server runs locally and acts as a **WebSocket Hub**. When the user opens the PaperCast playground in their browser, the website automatically dials into this MCP server.

This means you act as a **Remote Control** for the website!

## The Workflow

1. **Discover**: Call `get_active_sessions` to see if the user has the playground open.
2. **Connect**: If there are multiple sessions, use `select_active_session` to target one. If there is only one, it is usually selected by default.
3. **Read**: Use `get_document_state` to pull the live JSON AST directly from the user's browser.
4. **Mutate**: Use tools like `update_document_data`, `set_document_section`, or `add_text_widget`. When you call these tools, the MCP server fires a WebSocket event to the user's browser, which immediately updates the UI!

## Visual Output

Because you are remote-controlling the website, the user can instantly see the visual output of your changes in their browser. You do not need to generate HTML, screenshots, or PDFs to show them the result (unless explicitly asked to use the `generate_pdf` tool). Just modify the schema, and the user's browser will render it.

## Workspace Management

The PaperCast MCP server also allows you to save, load, and duplicate the user's work directly in their browser using IndexedDB. See `architecture-Workspace.md` for full instructions on using the `workspace_*` tools.
