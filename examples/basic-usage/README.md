# PaperCast Basic Usage Example

Welcome to the PaperCast basic usage example! This folder shows you the simplest way to use PaperCast in a real React application.

This example is intentionally kept separate from the `packages/react` folder. We do this to make sure that the `@papercast/react` library remains small, fast, and easy to tree-shake. If we put a full example application inside the library itself, it would make the library bloated with things like dev servers, build tools, and application logic. Keeping it here in the `examples` folder is the best practice for a clean Open Source (OSS) project!

## What does this example do?

1. It takes test document data from `@papercast/core/test`.
2. It passes that data to the `DocumentPreview` component from `@papercast/react`.
3. The component automatically talks to `@papercast/engine` in the background to calculate the pages and shows them nicely on the screen.

## How to run this example

Since you are in the PaperCast repository, you can simply run it using:

```bash
npm install
npm run dev
```

If you are a user trying to copy this into your own project, just copy this entire `basic-usage` folder and run `npm install` inside it!

## Looking for a more advanced example?

If you want to see a full application with a JSON editor, property panels, PDF downloading, and more, please check the main `apps/web` folder in this repository. It shows you the maximum power of PaperCast!
