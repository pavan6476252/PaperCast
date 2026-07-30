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
pnpm --filter formcast-cli run clean

# Clean the core package
pnpm --filter @formcast/core run clean
```
