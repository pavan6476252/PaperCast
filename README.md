# FormCast

FormCast is a powerful, dynamic Document Builder built with Next.js. It allows you to design, preview, and generate print-ready PDF documents dynamically using a simple JSON structure.

## Features

- **Live Preview:** Real-time rendering of your document based on JSON input.
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

Open [http://localhost:8000](http://localhost:8000) with your browser to see the application in action.

## How to Use

1. **Edit Content:** Use the JSON editor panel on the left side to define your document structure (Headers, Body segments, Footers, etc.).
2. **Configure Layout:** Use the top toolbar to select the desired page dimensions and orientation.
3. **Preview:** Watch the live preview update instantly on the right side as you edit the JSON or change settings.
4. **Export:** Click the "Save" button in the toolbar to generate and download a PDF of your document.

## Development

### Generate JSON Schema

If you update the core TypeScript types (`packages/core/src/schema.ts`), you can regenerate the JSON schema for validation using:

```bash
pnpm --filter @formcast/core run schema:generate
```

### Cleaning the Workspace

To remove all build artifacts and caches (e.g., `.next`, `dist`, `.turbo`) across the entire monorepo, run:

```bash
pnpm run clean
```

To clean a specific app or package, use Turborepo's filter flag:

```bash
# Clean the Next.js web app
pnpm --filter formcast-web run clean

# Clean the CLI app
pnpm --filter formcast-mcp run clean

# Clean the core package
pnpm --filter @formcast/core run clean
```

## Architecture & Core Concepts

FormCast is a Schema-First Document Builder and Renderer, split across multiple decoupled packages:

- **Core Engine (`packages/engine`)**: Framework-agnostic vanilla TypeScript logic responsible for parsing the FormCast JSON schema, calculating pagination, and resolving dynamic data. It contains no React or DOM-specific code.
- **Headless Binding (`packages/react`)**: A framework-specific adapter (e.g., `@formcast/react`) that implements the UI rendering and DOM measurement interfaces required by the Core Engine.
- **Measurer Adapter (`IMeasurer`)**: An interface defined by the Core Engine but implemented by the Headless Binding. It provides the layout heights of rendered elements without coupling the engine to a specific DOM implementation.
- **Schema & Component Registries**: A lightweight registry in the Core Engine stores node metadata, while a Component Registry in the Headless Binding maps node types to actual UI components.

By keeping the business logic and layout orchestration strictly separated from the rendering framework, FormCast remains fast, flexible, and portable.
