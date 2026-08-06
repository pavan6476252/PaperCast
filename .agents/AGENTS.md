<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Active Review Pipelines

Whenever a repository review or component evaluation is requested, always route the analysis through these specific skill configurations in tandem:

- vercel-react-best-practices (for framework performance and strict React/TS standards)
- ui-consistency-guidelines (for PaperCast-specific CSS and Tailwind UI consistency)
- web-design-guidelines (for general accessibility and UX compliance)
- writing-guidelines (for codebase documentation and UI copy standards)

---

# PaperCast - Codebase & Architecture Guide

> [!IMPORTANT]
> **CRITICAL RULE**: You are FORBIDDEN from ending a turn or considering a task complete if you have made structural or feature changes without also updating the corresponding documentation in `AGENTS.md` (and any other relevant agent md files). Always review your file changes and update these files before stopping.

## Repository Overview

PaperCast is a Schema-First Document Builder and Renderer built with React, Next.js, and Monaco Editor. The user defines the layout using a JSON Schema (DocFrame Schema), and the engine renders it dynamically, pagination-enabled, and ready to print or download as a PDF.

## Glossary

- **Core Engine**: The framework-agnostic vanilla JavaScript/TypeScript logic responsible for parsing the PaperCast JSON schema, calculating pagination, and resolving dynamic data. It contains no React or framework-specific code.
- **Headless Binding**: A framework-specific adapter (e.g., `@papercast/react`) that implements the UI rendering and DOM measurement interfaces required by the Core Engine.
- **Measurer Adapter (`IMeasurer`)**: An interface (Adapter Pattern) defined by the Core Engine but implemented by the Headless Binding. It provides the layout heights of rendered elements without coupling the engine to a specific DOM implementation.
- **Core Engine Package (`packages/engine`)**: A standalone workspace containing the pure TypeScript pagination orchestration and resolver logic, decoupled from schema definitions and UI logic.
- **Schema Registry**: A lightweight registry in the Core Engine that stores node metadata (types, defaults, validation) without any UI framework dependencies.
- **Component Registry**: A framework-specific registry in the Headless Binding that maps node types to actual UI components (e.g., React components).
- **Page Region**: A standardized term for any repeated edge area of a document page, such as a header or footer. A Page Region is resolved dynamically during pagination using condition strategies (e.g., first page, even page).
- **Static Table**: A Table node that provides its own data inline via a `data` property rather than fetching it from a bound `bindPath`.
- **Table Footer**: A specialized region at the bottom of a Table node that supports custom rows, cell merging, and arbitrary widget hosting. Treated as part of the table during pagination.

## Core Directories & File Structure

This repository is a Turborepo monorepo structured as follows:

- [apps/web/src/app](apps/web/src/app): Next.js Pages and API routes.
  - [(app)/playground/page.tsx](<apps/web/src/app/(app)/playground/page.tsx>): Main visual editor playground interface, split between the JSON Editor (left) and Document Preview (right).
  - [(marketing)/page.tsx](<apps/web/src/app/(marketing)/page.tsx>): Landing/marketing page.
  - [(marketing)/docs/[slug]/page.tsx](<apps/web/src/app/(marketing)/docs/[slug]/page.tsx>): Documentation pages.
  - [print/page.tsx](apps/web/src/app/print/page.tsx): Dedicated page layout optimized for printing/PDF generation.
  - [api/pdf/route.ts](apps/web/src/app/api/pdf/route.ts): API endpoint for exporting/rendering PDFs using Puppeteer.
  - [api/docs/[slug]/route.ts](apps/web/src/app/api/docs/[slug]/route.ts): API endpoint serving raw `.md` documentation files for LLMs.
  - [llms.txt/route.ts](apps/web/src/app/llms.txt/route.ts): API endpoint serving LLM-friendly documentation mapping.
  - [llm.txt/route.ts](apps/web/src/app/llm.txt/route.ts): Alias endpoint re-exporting the llms.txt handler to support singular requests.
  - [llms-full.txt/route.ts](apps/web/src/app/llms-full.txt/route.ts): API endpoint serving all documentation concatenated for AI agents.
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
  - [src/schema/papercast.schema.json](packages/core/src/schema/papercast.schema.json): Complete JSON schema definition defining nodes, style properties, document meta-information, and pagination controls.
  - [src/schema.ts](packages/core/src/schema.ts): Holds type definitions matching the JSON schema.
  - [src/astManipulators.ts](packages/core/src/astManipulators.ts): Functions to manipulate the AST securely.
  - [src/ws.ts](packages/core/src/ws.ts): Shared WebSocket event types (`WsEventType`) and payload interfaces for end-to-end sync between playground and MCP server.

- [apps/mcp](apps/mcp): CLI and MCP Server.
  - [src/index.ts](apps/mcp/src/index.ts): Model Context Protocol server exposing PaperCast actions and resources to LLMs.

## Key Architectures & Flows

1. **State Flow**:
   - The user edits JSON in Monaco Editor (`JsonEditor`).
   - The text is passed to Zustand store (`documentStore`). If it's valid JSON, it gets parsed and set as `parsedDocument`.
   - `DocumentPreview` listens to the parsed schema.
2. **Measurement & Pagination**:
   - `OffscreenMeasurer` renders elements offscreen to measure their heights.
   - `PaginationEngine` uses these measurements to compute which elements fit on page 1, page 2, etc., based on page size and margins.
   - `DocumentPreview` displays pages side-by-side or stacked on the screen.
3. **Persistence & History**:
   - **Local Storage (IndexedDB)**: User schemas and templates are saved locally in the browser using IndexedDB via `workspaceStore` (backed by `idb-keyval`). This supports creating, duplicating, and switching between multiple schemas.
   - **Auto-Save Mechanism**: The workspace supports an opt-in auto-save feature (`isWorkspaceAutoSave`), which relies on a debounced listener (e.g., in `WorkspaceSidebar.tsx`) to avoid UI blocking and IndexedDB thrashing while typing in the JSON editor.
   - **Undo/Redo**: Document history tracking is handled by `zundo` integrating seamlessly with the Zustand `documentStore`. The Monaco Editor maintains its own undo stack natively, but UI-driven visual edits programmatically push undo stops into Monaco (`editor.pushUndoStop`) to ensure both stacks stay perfectly synced.
4. **UI & Bundle Optimization**:
   - **Lazy Loading**: Heavy UI components that are not visible on initial load (like the `WorkspaceSidebar` and `TemplateGalleryDialog`) MUST be dynamically imported (`next/dynamic` with `ssr: false`) to avoid polluting the initial JavaScript bundle with massive default schema templates or explorer logic.
   - **Unified Actions**: Avoid scattered, redundant action buttons. Related actions (e.g., Save Schema, Save As, Export PDF, Print) should be grouped logically (e.g., Split-Button or Dropdown) to save toolbar space and prevent user confusion.
5. **Next.js & React Conventions (Crucial)**:
   - **Next.js 15/16 Async APIs**: When creating Server Components for dynamic routes (e.g. `[slug]/page.tsx`), you MUST await the `params` prop since it is a Promise in Next 16. For `searchParams` in client components, always wrap `useSearchParams()` in a `<Suspense>` boundary.
   - **React Performance**: Never attach global, passive event listeners (like `mousemove` or `mouseup`) on component mount using generic `useEffect` if they only apply conditionally (like during drag operations). Use localized pointer events or conditionally attach them based on dragging state to avoid unnecessary handler invocations per frame. Keep heavy dependencies like Monaco Editor dynamically imported (`next/dynamic` with `ssr: false`).
6. **Monorepo Workspaces**:
   - `apps/web` consumes `@papercast/core` via standard imports and compiles it using `transpilePackages` in `next.config.ts`.
   - `apps/mcp` is bundled with `tsup`, embedding the schemas directly from `@papercast/core` to provide a portable MCP server.

## Build and Tests

- Run `pnpm run dev` to start the development servers for all workspaces via Turborepo.
- Run `pnpm run build` to verify the production builds for the CLI and Next.js applications.

## Pre-Commit Hooks & Validation

To ensure code quality and schema validity:

- A Git pre-commit hook (configured via Husky in [.husky/pre-commit](.husky/pre-commit)) runs:
  1. `pnpm run test` to execute all unit and integration tests across the monorepo packages.
  2. `pnpm --filter @papercast/core run schema:validate` to regenerate the JSON schema from types (`packages/core/src/schema.ts`) and validate the test document (`packages/core/src/test.data.ts`) using the script `packages/core/scripts/validate-schema.ts`.
  3. `pnpm exec lint-staged` to run ESLint autofixes and Prettier formatting on staged files.

## Strict Typing & Code Quality Rules

> [!CAUTION]
> **No `any` Types**: The use of `any` is strictly prohibited. Everything must be strictly and explicitly typed to prevent runtime errors and ensure developer confidence.

- **Headless Architecture & Separation of Concerns**: Maintain a clear boundary between:
  1. **Headless Logic**: Core business logic and engines (e.g., parsing, pagination, state management) must remain completely framework-agnostic.
  2. **Framework-Specific Implementations**: React/Next.js layers should merely consume the headless logic without embedding business rules.
  3. **Final Usage**: The playground and end-user interfaces should compose these cleanly separated layers.

- **Custom Widget Typing (Module Augmentation)**: If `apps/web` introduces custom widgets that the MCP server must support, DO NOT import types from `apps/web` or `@papercast/react` into `apps/mcp`. Doing so violates the headless separation of concerns. Instead, use TypeScript Module Augmentation to extend the `CustomNodesRegistry` interface exported by `@papercast/core`. This ensures both the Web app and the MCP server inherit strict typing without circular dependencies.

- **Future-Proofing**: Code must be highly understandable and extendable. Any new architectural additions must be designed such that they don't block future extensibility (e.g., adding a new document Node type must not require changes to the core engine).

## Subsystems & Architectural Rules

### 1. AST Manipulation & Immutability Rules

- **Rule**: All modifications to the document schema (AST) must be performed using the pure functions found in `packages/core/src/astManipulators.ts` (e.g., `insertNodeIntoAst`, `replaceNodeInAst`, `deleteNodeFromAst`, `moveNodeInAst`).
- **Rule**: These functions must always return a deep clone (via `structuredClone`) of the document to ensure Zustand reactivity triggers properly. Direct mutation of the AST is strictly forbidden.

### 2. Node Behaviors & Pagination Engine

- **Pagination Process**: The `PaginationEngine.ts` processes a linear array of blocks (children of the body). It calculates if a block fits into the `availableHeight` of the current page. If it doesn't, it queries the node's `split` function (e.g., `ContainerBehavior.split`) to divide the block.
- **Container Behavior**: Containers like `row` and `column` recursively sum their children's heights during the `measure` phase. During the `split` phase, they attempt to fit as many children as possible on the current page, slicing the `children` array to pass the remainder to the next page. A `richText` node must first be converted into a container of widgets to be splittable.
- **Dynamic Table Row Spanning (Value Grouping)**: We strictly use a `mergeBy: string[]` property on `TableColumnConfig` instead of simple booleans to control cell merging dynamically. This enables hierarchical grouping (e.g., `["category", "item"]`). The headless pagination engine evaluates these paths natively during the `split` phase using `resolvePath()`, ensuring page breaks never sever a dynamically generated `rowSpan` block without complicating the core AST with specific `<Group>` nodes.

### 3. Editor & Context Workflows (State Sync)

- **Sync Architecture**: The Monaco `JsonEditor.tsx` acts as the definitive source of truth for the raw text schema. When a user makes changes in the visual UI (`PropertyPanel.tsx`), the React layer dispatches updates via Zustand (`useDocumentStore`). Zustand then re-serializes the JSON and pushes it back into the Monaco editor via `editor.executeEdits` to preserve the user's native undo history.
- **AST Node Matching**: Visual property panels heavily rely on recursive AST searches (e.g., `findNodeGlobal` in `astManipulators.ts`) to match a user's `selectedNodeId` string to the active node properties for editing.

### 4. MCP Server Error Handling & Validation

- **Crash Reporting**: Unhandled exceptions and MCP protocol errors in the CLI are caught by a global error handler (`crash.ts`), which writes a JSON crash dump to the OS temp directory and outputs an LLM-friendly prompt to `stderr` to aid in debugging.
- **Validation**: Schema validation via `Ajv` uses `allErrors: false` to prevent memory exhaustion (OOM) when parsing large, malformed payloads from the visual editor (e.g. missing `layout` objects).
- **Error Boundaries**: All MCP tool handlers must be wrapped in `withErrorBoundary` to ensure that local errors return a graceful `isError: true` payload to the LLM rather than crashing the MCP server process.

## Release & CI/CD Workflow

- **Trunk-Based Development**: This repository follows a strict Trunk-Based approach. You must NEVER push code directly to the `main` branch or create a `dev` branch. All work happens in feature branches that are merged into `main` via Pull Requests.
- **Changesets**: The repository uses [Changesets](https://github.com/changesets/changesets) for package versioning. When you make a code change that impacts published packages (like `@papercast/core`), you must run `pnpm changeset` and commit the generated `.changeset` markdown file as part of your Pull Request.
- **Automated Publishing**: Do NOT attempt to run `pnpm publish` manually or write scripts for publishing. Once a PR is merged, the automated `.github/workflows/release.yml` will create a "Version Packages" PR, which publishes to NPM automatically when merged.
