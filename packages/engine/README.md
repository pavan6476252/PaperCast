# @formcast/engine

Welcome to **@formcast/engine**!

This is the main calculator (engine) of FormCast. It takes your long document and figures out exactly how to cut it into separate pages so it can be printed or saved as a PDF properly.

## What is inside?

1. **PaginationEngine**: The logic that measures every item on the screen and splits them when they reach the bottom of the page.
2. **Resolver**: A tool to solve simple logic and variables inside the document.
3. **No React required**: This package uses only pure JavaScript/TypeScript. It does not know anything about React or the browser window.

## Why do we need this?

By keeping the pagination (page splitting) logic separate from React, we make sure that the calculation is very fast and can run anywhere (even on a server!). It also makes the code easy to test.

## Installation

Run this command in your terminal:

```bash
npm install @formcast/engine
```

_Note: You will also need to install `@formcast/core` because the engine uses its types._

## Basic Usage

Here is a simple example showing how to run the engine:

```typescript
import { PaginationEngine } from "@formcast/engine";
import { DocumentSchema } from "@formcast/core";

// 1. You give it your document
const myDoc: DocumentSchema = {/* ... */};

// 2. You create a simple measurer that tells the engine how tall each text is.
// (In a real app, @formcast/react gives you a ready-made Measurer using the real browser DOM).
const fakeMeasurer = {
  measureNode: (node) => ({ height: 20 }),
  measureText: (text) => ({ height: 15, width: 100 }),
};

// 3. Create the engine
const engine = new PaginationEngine(myDoc, fakeMeasurer);

// 4. Calculate the pages!
const paginatedResult = engine.paginate();
console.log("Total pages created: ", paginatedResult.pages.length);
```

## Need Help?

If you want to use this easily in your React application without writing your own Measurer, please check our `@formcast/react` package!
