# PaperCast Web Application Guide

## Workspace Overview

This workspace (`apps/web`) contains the PaperCast Next.js web application. It acts as the interactive visual playground for editing and previewing JSON Schemas.

## Key Responsibilities

1. **Interactive Visual Editor**: The primary interface for users, providing a dual-pane view: Monaco JSON Editor on the left, Visual Preview on the right.
2. **Component Rendering**: Resolves the JSON AST into React nodes using `src/registry/NodeRegistry.ts` and `src/components/renderer/NodeRenderer.tsx`.
3. **Pagination Engine**: Contains the logic to split continuous AST blocks into physical pages (A4, Letter) based on offscreen height measurements.
4. **PDF Generation Endpoint**: Exposes a Next.js API route (`src/app/api/pdf/route.ts`) that runs Puppeteer to generate high-quality PDFs from the documents.

## Architectural Boundaries

- **No Direct AST Manipulation**: All core logic for modifying the AST is strictly maintained in `@papercast/core`. The Next.js app consumes this via standard imports.
- **State Management**: Uses Zustand (`src/store/documentStore.ts`) to synchronize the AST between the Monaco Editor and the visual preview.

## Getting Started

- **Development**: Run `pnpm run dev` from the workspace root or `next dev` inside `apps/web`.
- **Styling**: Uses Tailwind CSS via PostCSS.
- **Dependencies**: React, Next.js, Framer Motion, Monaco Editor, Zustand.
