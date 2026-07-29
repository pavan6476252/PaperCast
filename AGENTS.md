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
> **After every critical feature implementation or structural change (mentioned in agent md files), make sure to update respective agent files content.**

## Repository Overview

FormCast is a Schema-First Document Builder and Renderer built with React, Next.js, and Monaco Editor. The user defines the layout using a JSON Schema (DocFrame Schema), and the engine renders it dynamically, pagination-enabled, and ready to print or download as a PDF.

## Core Directories & File Structure

- [src/app](file:///Users/pavankumar/Documents/formcast/src/app): Next.js Pages and API routes.
  - [(app)/playground/page.tsx](<file:///Users/pavankumar/Documents/formcast/src/app/(app)/playground/page.tsx>): Main visual editor playground interface, split between the JSON Editor (left) and Document Preview (right).
  - [(marketing)/page.tsx](<file:///Users/pavankumar/Documents/formcast/src/app/(marketing)/page.tsx>): Landing/marketing page.
  - [(marketing)/docs/[slug]/page.tsx](<file:///Users/pavankumar/Documents/formcast/src/app/(marketing)/docs/[slug]/page.tsx>): Documentation pages.
  - [print/page.tsx](file:///Users/pavankumar/Documents/formcast/src/app/print/page.tsx): Dedicated page layout optimized for printing/PDF generation.
  - [api/pdf/route.ts](file:///Users/pavankumar/Documents/formcast/src/app/api/pdf/route.ts): API endpoint for exporting/rendering PDFs using Puppeteer.
- [src/components](file:///Users/pavankumar/Documents/formcast/src/components): React components.
  - [editor/JsonEditor.tsx](file:///Users/pavankumar/Documents/formcast/src/components/editor/JsonEditor.tsx): Monaco editor integration configured with JSON Schema autocomplete/validation.
  - [renderer/DocumentPreview.tsx](file:///Users/pavankumar/Documents/formcast/src/components/renderer/DocumentPreview.tsx): Holds controls for printing, zooming, changing page size, toggling the schema editor, and rendering paginated pages.
  - [renderer/NodeRenderer.tsx](file:///Users/pavankumar/Documents/formcast/src/components/renderer/NodeRenderer.tsx): Component mapper that resolves and renders specific elements.
- [src/engine](file:///Users/pavankumar/Documents/formcast/src/engine): Core rendering and calculation engines.
  - [PaginationEngine.ts](file:///Users/pavankumar/Documents/formcast/src/engine/PaginationEngine.ts): Logic to split a continuous layout tree into discrete pages based on physical measurements.
  - [OffscreenMeasurer.tsx](file:///Users/pavankumar/Documents/formcast/src/engine/OffscreenMeasurer.tsx): Measures DOM node heights offscreen to feed accurate heights to the pagination engine.
  - [resolver.ts](file:///Users/pavankumar/Documents/formcast/src/engine/resolver.ts): Evaluates templates, logic, variables, and expressions within the JSON schema.
- [src/registry](file:///Users/pavankumar/Documents/formcast/src/registry): Node registration.
  - [NodeRegistry.ts](file:///Users/pavankumar/Documents/formcast/src/registry/NodeRegistry.ts): Decoupled component registry mapping node types (e.g. `row`, `column`, `text`, `table`) to their respective rendering React components.
- [src/store](file:///Users/pavankumar/Documents/formcast/src/store): Global Zustand store.
  - [documentStore.ts](file:///Users/pavankumar/Documents/formcast/src/store/documentStore.ts): Tracks original JSON string, validated parsed JSON tree, and syntax/schema validation state.
- [src/schema](file:///Users/pavankumar/Documents/formcast/src/schema): JSON Schemas.
  - [docframe.schema.json](file:///Users/pavankumar/Documents/formcast/src/schema/docframe.schema.json): Complete JSON schema definition defining nodes, style properties, document meta-information, and pagination controls.
- [src/types](file:///Users/pavankumar/Documents/formcast/src/types): TypeScript interfaces.
  - [schema.ts](file:///Users/pavankumar/Documents/formcast/src/types/schema.ts): Holds type definitions matching the JSON schema.

## Key Architectures & Flows

1. **State Flow**:
   - The user edits JSON in Monaco Editor (`JsonEditor`).
   - The text is passed to Zustand store (`documentStore`). If it's valid JSON, it gets parsed and set as `parsedDocument`.
   - `DocumentPreview` listens to the parsed schema.
2. **Measurement & Pagination**:
   - `OffscreenMeasurer` renders elements offscreen to measure their heights.
   - `PaginationEngine` uses these measurements to compute which elements fit on page 1, page 2, etc., based on page size and margins.
   - `DocumentPreview` displays pages side-by-side or stacked on the screen.

## Build and Tests

- Run `pnpm run dev` to start the development server.
- Run `pnpm run build` to verify the Next.js production build and TypeScript compilation.

## Pre-Commit Hooks & Validation

To ensure code quality and schema validity:

- A Git pre-commit hook (configured via Husky in [.husky/pre-commit](file:///Users/pavankumar/Documents/formcast/.husky/pre-commit)) runs:
  1. `pnpm run schema:validate` to regenerate the JSON schema from types (`src/types/schema.ts`) and validate the test document (`src/store/test.data.ts`) using the script `scripts/validate-schema.ts`.
  2. `pnpm exec lint-staged` to run ESLint autofixes and Prettier formatting on staged files.
