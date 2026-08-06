---
name: mcp-server-best-practices
description: "Guidelines and rules for developing scalable, robust Model Context Protocol (MCP) servers with modular structure and decoupled logic."
---

# MCP Server Development Best Practices

When writing code for Model Context Protocol (MCP) servers, ensure the following best practices are applied to maintain a robust, decoupled, and scalable architecture.

## 1. Modular Architecture & Bounded Contexts

Avoid creating monolithic server files. The `index.ts` (or equivalent entry point) should only handle:

- MCP Server transport initialization (e.g., Stdio or HTTP)
- Registration of Tools and Resources
- Loading of domain handlers

**Do not** include business logic (e.g., WebSocket management, complex data processing, state mutations) in the entry point. Delegate this logic to specialized modules like `services/`, `tools/`, and `resources/`.

## 2. Stateless & Idempotent Tool Design

Whenever possible, design your tools to be stateless and idempotent.

- Do not assume the order in which tools will be called.
- Do not rely on ephemeral state within the server unless absolutely necessary (e.g., proxying to a WebSocket).
- In tools that update state, ensure that repeated calls with the same parameters do not corrupt the data.

## 3. Prompt & Context Engineering

The primary way LLMs interact with an MCP server is by reading the descriptions of its tools and resources.

- **Naming:** Use clear, action-oriented names (e.g., `get_active_sessions`, `insert_layout_element`).
- **Descriptions:** Provide highly detailed, explicit instructions in the tool's `description` field. These descriptions act as structural prompts guiding the LLM on _when_ and _how_ to use the tool. Include hints on expected inputs, constraints, and side effects.
- **Granular Context:** Do not expose massive "god objects" if the LLM only needs a subset. Create specific resources or tools that return scoped data fragments to save token limits and prevent "context rot."

## 4. Input Validation (JSON Schema)

Always use strict JSON Schema for tool inputs.

- Validate all incoming parameters from the `CallToolRequestSchema`.
- Use enums where parameter values are restricted (e.g., `enum: ["row", "column", "text"]`) to prevent the LLM from hallucinating invalid parameters.

## 5. Directory Structure Guidelines

When scaffolding or restructuring an MCP Server, use this general directory structure:

- `src/index.ts` - Entry point and transport.
- `src/constants.ts` - Shared constants and enums.
- `src/services/` - Business logic decoupled from MCP.
- `src/resources/` - MCP resource registrations and handlers.
- `src/tools/` - MCP tool registrations and their domain-specific logic.

## 6. Testing & Maintainability

Ensure your service logic can be unit-tested without requiring the MCP `Server` instance to be mocked heavily. The MCP handlers should just be thin wrappers around the service functions.

## 7. Complex Schema Features in Tools (PaperCast specifics)

When creating or updating tools that interact with the PaperCast JSON schema (e.g., `update_element_properties` or `insert_layout_element`):

- Explicitly document complex AST patterns in the tool's `description`.
- **Tables**: Ensure the LLM understands the difference between bound arrays (`bindPath`) and static regions (`headerRows`, `bodyRows`, `footerRows`). Mention that dynamic row spanning should be achieved using `mergeBy: string[]` in the `TableColumnConfig`, and _not_ by manually injecting `rowSpan` properties on bound cells.
- **Lists**: Clarify the usage of `UnorderedList` vs `OrderedList` and how children (like `Text` nodes) are automatically wrapped in list item tags during render.
