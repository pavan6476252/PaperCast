# PaperCast

[![CI](https://github.com/pavan6476252/papercast/actions/workflows/ci.yml/badge.svg)](https://github.com/pavan6476252/papercast/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PaperCast is a powerful, dynamic Document Builder built with Next.js. It allows you to design, preview, and generate print-ready PDF documents dynamically using a simple JSON structure.

## Features

- **Live Preview:** Real-time rendering of your document based on JSON input.
- **Local Workspaces:** Save and manage multiple document schemas natively in your browser via IndexedDB.
- **Template Gallery:** Quickly jumpstart your designs using built-in snippets or your own saved documents.
- **Undo & Redo:** Full history tracking across all document edits.
- **Customizable Layouts:** Select standard page sizes (A4, A3, Letter) or set custom dimensions.
- **Orientation Control:** Toggle instantly between Portrait and Landscape modes.
- **PDF Generation:** Save your documents as high-quality PDFs seamlessly.

## Getting Started

First, ensure you have dependencies installed (this project uses `pnpm`):

```bash
pnpm install
```

Install Husky git hooks and set executable permissions:

```bash
./scripts/setup-husky.sh
```

```
chmod +x scripts/setup-husky.sh && find .husky -type f -exec chmod +x {} \; && ls -l scripts/setup-husky.sh .husky .husky/_
```

Run the development server:

```bash
pnpm run dev
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the application in action. You can also view the live version at [https://paper-cast-web.vercel.app/](https://paper-cast-web.vercel.app/).

## How to Use

1. **Edit Content:** Use the JSON editor panel on the left side to define your document structure (Headers, Body segments, Footers, etc.).
2. **Configure Layout:** Use the top toolbar to select the desired page dimensions and orientation.
3. **Preview:** Watch the live preview update instantly on the right side as you edit the JSON or change settings.
4. **Export:** Click the "Save" button in the toolbar to generate and download a PDF of your document.

## Development

### Generate JSON Schema

If you update the core TypeScript types (`packages/core/src/schema.ts`), you can regenerate the JSON schema for validation using:

```bash
pnpm --filter @papercast/core run schema:generate
```

### Cleaning the Workspace

To remove all build artifacts and caches (e.g., `.next`, `dist`, `.turbo`) across the entire monorepo, run:

```bash
pnpm run clean
```

To clean a specific app or package, use Turborepo's filter flag:

```bash
# Clean the Next.js web app
pnpm --filter papercast-web run clean

# Clean the CLI app
pnpm --filter papercast-mcp run clean

# Clean the core package
pnpm --filter @papercast/core run clean
```

## Architecture & Core Concepts

PaperCast is a Schema-First Document Builder and Renderer, split across multiple decoupled packages:

- **Core Engine (`packages/engine`)**: Framework-agnostic vanilla TypeScript logic responsible for parsing the PaperCast JSON schema, calculating pagination, and resolving dynamic data. It contains no React or DOM-specific code.
- **Headless Binding (`packages/react`)**: A framework-specific adapter (e.g., `@papercast/react`) that implements the UI rendering and DOM measurement interfaces required by the Core Engine.
- **Measurer Adapter (`IMeasurer`)**: An interface defined by the Core Engine but implemented by the Headless Binding. It provides the layout heights of rendered elements without coupling the engine to a specific DOM implementation.
- **Schema & Component Registries**: A lightweight registry in the Core Engine stores node metadata, while a Component Registry in the Headless Binding maps node types to actual UI components.

By keeping the business logic and layout orchestration strictly separated from the rendering framework, PaperCast remains fast, flexible, and portable.

## Agent Skills

PaperCast includes custom AI agent skills (stored in `.agents/skills/`) to help maintain code quality and consistency:

- **UI Consistency Guidelines** (`ui-consistency-guidelines`): Enforces pure CSS and Tailwind usage in alignment with PaperCast's design tokens and dark mode standards. Ensure your agents run this skill when building or reviewing UI components.
- **Web Changelogs** (`adding-web-changelogs`): Guidelines for updating the user-facing marketing Changelog (`apps/web/content/changelog.mdx`). Ensure agents use this skill to write curated, benefit-driven release notes instead of technical git logs.
