# PaperCast CLI & MCP Server Guide

## Workspace Overview

This workspace (`apps/cli`) contains the PaperCast command-line interface and Model Context Protocol (MCP) Server. It exposes the capabilities of the PaperCast core engine to Large Language Models (LLMs) running locally or remotely.

## Key Responsibilities

1. **MCP Tool Exposition**: Maps AST manipulators (from `@papercast/core`) to standard MCP tools (e.g., `insert_layout_element`, `patch_element_properties`).
2. **Resource Exposition**: Exposes the `papercast.schema.json` and bundled template schemas to LLMs as standard MCP resources, allowing them to understand the rules of the layout engine.
3. **Session State Management**: Maintains active WebSocket connections and parses JSON AST changes incrementally.
4. **Self-Contained Bundle**: Uses `tsup` to bundle the server, schemas, and templates into a single `dist/index.js` file for maximum portability.

## Architectural Boundaries

- **No Direct Schema Reads**: Do not use `fs.readFileSync(process.cwd() + ...)` to load schemas. Always import schemas as JSON modules from `@papercast/core` so `tsup` can statically bundle them.
- **Protocol Strictness**: Ensure all tools strictly adhere to the `@modelcontextprotocol/sdk` validation rules and schemas.

## Building and Running

- Run `pnpm run build` to bundle the CLI via `tsup`.
- Run `pnpm run dev` to start a watch mode during development.
