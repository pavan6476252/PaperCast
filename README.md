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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## How to Use

1. **Edit Content:** Use the JSON editor panel on the left side to define your document structure (Headers, Body segments, Footers, etc.).
2. **Configure Layout:** Use the top toolbar to select the desired page dimensions and orientation.
3. **Preview:** Watch the live preview update instantly on the right side as you edit the JSON or change settings.
4. **Export:** Click the "Save" button in the toolbar to generate and download a PDF of your document.

## Development

### Generate JSON Schema

If you update the core TypeScript types (`src/types/schema.ts`), you can regenerate the JSON schema for validation using:

```bash
npx ts-json-schema-generator --path src/types/schema.ts --type DocumentSchema --out src/schema/docframe.schema.json
```
