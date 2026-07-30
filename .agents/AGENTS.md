<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Active Review Pipelines

Whenever a repository review or component evaluation is requested, always route the analysis through these three specific skill configurations in tandem:

- vercel-react-best-practices (for framework performance and strict React/TS standards)
- web-design-guidelines (for visual, layout, and UX compliance)
- writing-guidelines (for codebase documentation and UI copy standards)

---

# FormCast - Codebase & Architecture Guide

> [!IMPORTANT]
> **CRITICAL RULE**: You are FORBIDDEN from ending a turn or considering a task complete if you have made structural or feature changes without also updating the corresponding documentation in `AGENTS.md` (and any other relevant agent md files). Always review your file changes and update these files before stopping.

## Repository Overview

FormCast is a Schema-First Document Builder and Renderer built with React, Next.js, and Monaco Editor. The user defines the layout using a JSON Schema (DocFrame Schema), and the engine renders it dynamically, pagination-enabled, and ready to print or download as a PDF.

## Core Directories & File Structure

This repository is a Turborepo monorepo structured as follows:

- [apps/web/src/app](apps/web/src/app): Next.js Pages and API routes.
  - [(app)/playground/page.tsx](<apps/web/src/app/(app)/playground/page.tsx>): Main visual editor playground interface, split between the JSON Editor (left) and Document Preview (right).
  - [(marketing)/page.tsx](<apps/web/src/app/(marketing)/page.tsx>): Landing/marketing page.
  - [(marketing)/docs/[slug]/page.tsx](<apps/web/src/app/(marketing)/docs/[slug]/page.tsx>): Documentation pages.
  - [print/page.tsx](apps/web/src/app/print/page.tsx): Dedicated page layout optimized for printing/PDF generation.
  - [api/pdf/route.ts](apps/web/src/app/api/pdf/route.ts): API endpoint for exporting/rendering PDFs using Puppeteer.
- [apps/web/src/components](apps/web/src/components): React components.
  - [editor/JsonEditor.tsx](apps/web/src/components/editor/JsonEditor.tsx): Monaco editor integration configured with JSON Schema autocomplete/validation.
  - [renderer/DocumentPreview.tsx](apps/web/src/components/renderer/DocumentPreview.tsx): Holds controls for printing, zooming, changing page size, toggling the schema editor, and rendering paginated pages.
  - [renderer/NodeRenderer.tsx](apps/web/src/components/renderer/NodeRenderer.tsx): Component mapper that resolves and renders specific elements.
- [apps/web/src/engine](apps/web/src/engine): Core rendering and calculation engines.
  - [PaginationEngine.ts](apps/web/src/engine/PaginationEngine.ts): Logic to split a continuous layout tree into discrete pages based on physical measurements.
  - [OffscreenMeasurer.tsx](apps/web/src/engine/OffscreenMeasurer.tsx): Measures DOM node heights offscreen to feed accurate heights to the pagination engine.
  - [resolver.ts](apps/web/src/engine/resolver.ts): Evaluates templates, logic, variables, and expressions within the JSON schema.
- [apps/web/src/registry](apps/web/src/registry): Node registration.
  - [NodeRegistry.ts](apps/web/src/registry/NodeRegistry.ts): Decoupled component registry mapping node types (e.g. `row`, `column`, `text`, `table`) to their respective rendering React components.
- [apps/web/src/store](apps/web/src/store): Global Zustand store.
  - [documentStore.ts](apps/web/src/store/documentStore.ts): Tracks original JSON string, validated parsed JSON tree, and syntax/schema validation state.

- [packages/core](packages/core): Shared business logic, types, and schema.
  - [src/schema/formcast.schema.json](packages/core/src/schema/formcast.schema.json): Complete JSON schema definition defining nodes, style properties, document meta-information, and pagination controls.
  - [src/schema.ts](packages/core/src/schema.ts): Holds type definitions matching the JSON schema.
  - [src/astManipulators.ts](packages/core/src/astManipulators.ts): Functions to manipulate the AST securely.
  - [src/ws.ts](packages/core/src/ws.ts): Shared WebSocket event types (`WsEventType`) and payload interfaces for end-to-end sync between playground and MCP server.

- [apps/cli](apps/cli): CLI and MCP Server.
  - [src/index.ts](apps/cli/src/index.ts): Model Context Protocol server exposing FormCast actions and resources to LLMs.

## Key Architectures & Flows

1. **State Flow**:
   - The user edits JSON in Monaco Editor (`JsonEditor`).
   - The text is passed to Zustand store (`documentStore`). If it's valid JSON, it gets parsed and set as `parsedDocument`.
   - `DocumentPreview` listens to the parsed schema.
2. **Measurement & Pagination**:
   - `OffscreenMeasurer` renders elements offscreen to measure their heights.
   - `PaginationEngine` uses these measurements to compute which elements fit on page 1, page 2, etc., based on page size and margins.
   - `DocumentPreview` displays pages side-by-side or stacked on the screen.
3. **Next.js & React Conventions (Crucial)**:
   - **Next.js 15/16 Async APIs**: When creating Server Components for dynamic routes (e.g. `[slug]/page.tsx`), you MUST await the `params` prop since it is a Promise in Next 16. For `searchParams` in client components, always wrap `useSearchParams()` in a `<Suspense>` boundary.
   - **React Performance**: Never attach global, passive event listeners (like `mousemove` or `mouseup`) on component mount using generic `useEffect` if they only apply conditionally (like during drag operations). Use localized pointer events or conditionally attach them based on dragging state to avoid unnecessary handler invocations per frame. Keep heavy dependencies like Monaco Editor dynamically imported (`next/dynamic` with `ssr: false`).
4. **Monorepo Workspaces**:
   - `apps/web` consumes `@formcast/core` via standard imports and compiles it using `transpilePackages` in `next.config.ts`.
   - `apps/cli` is bundled with `tsup`, embedding the schemas directly from `@formcast/core` to provide a portable MCP server.

## Build and Tests

- Run `pnpm run dev` to start the development servers for all workspaces via Turborepo.
- Run `pnpm run build` to verify the production builds for the CLI and Next.js applications.

## Pre-Commit Hooks & Validation

To ensure code quality and schema validity:

- A Git pre-commit hook (configured via Husky in [.husky/pre-commit](.husky/pre-commit)) runs:
  1. `pnpm --filter @formcast/core run schema:validate` to regenerate the JSON schema from types (`packages/core/src/schema.ts`) and validate the test document (`packages/core/src/test.data.ts`) using the script `packages/core/scripts/validate-schema.ts`.
  2. `pnpm exec lint-staged` to run ESLint autofixes and Prettier formatting on staged files.
