# @formcast/core

Welcome to **@formcast/core**!

This is the main brain of FormCast. It does not have any UI (like React) or complex calculation logic. It only keeps the rules.

## What is inside?

1. **JSON Schema**: The strict rules (schema) that tell us how a FormCast document should look.
2. **TypeScript Types**: Types used in the whole project so that developers do not make mistakes.
3. **AST Manipulators**: Simple functions to add, remove, or change elements (nodes) inside the document safely.

## Why do we need this?

By keeping rules separate from UI and Engine, we make sure that anyone can build their own engine or UI on top of FormCast using these exact same rules.

## Installation

Run this command in your terminal:

```bash
npm install @formcast/core
```

## Basic Usage

Here is a simple example showing how to use the types:

```typescript
import { DocumentSchema, NodeTypes } from "@formcast/core";
import formcastSchema from "@formcast/core/schema.json";

// Create a simple empty document using the standard rules
const myDocument: DocumentSchema = {
  id: "doc_123",
  type: "document",
  meta: {
    title: "My First Document",
    pageSize: "A4",
    orientation: "portrait",
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
  },
  body: {
    type: "container",
    children: [
      {
        type: "text",
        text: "Hello World",
      },
    ],
  },
};
```

## Need Help?

If you want to see how to show this document on the screen, please check our `@formcast/react` package!
