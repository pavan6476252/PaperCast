# @formcast/react

Welcome to **@formcast/react**!

This package is the bridge between the FormCast engine and your screen. It provides ready-to-use React components that take a FormCast document and draw it on the screen nicely.

## What is inside?

1. **DocumentPreview Component**: A simple React component that shows the final pages on the screen.
2. **NodeRenderer**: A component that reads each block (like text, table, column) from the JSON schema and draws the correct UI for it.
3. **Headless Binding**: It connects to `@formcast/engine` and automatically measures how tall every text or block is on your actual browser, so the engine can split pages perfectly.
4. **Widgets**: Pre-built small UI blocks (like rich text, simple text, tables) that show up inside your documents.

## Why do we need this?

While `@formcast/core` gives the rules, and `@formcast/engine` does the math, `@formcast/react` is the only package that knows how to use React to actually draw the elements in a web browser.

## Installation

Run this command in your terminal:

```bash
npm install @formcast/react @formcast/core @formcast/engine
```

## Basic Usage

Here is a simple example showing how to show a document:

```tsx
import React, { useState } from "react";
import {
  NodeRenderer,
  FormCastProvider,
  OffscreenMeasurer,
  getStyle,
} from "@formcast/react";
import { paginateDocument, PageData } from "@formcast/engine";
import { TEST_DOCUMENT } from "@formcast/core/test";
import { DocumentSchema } from "@formcast/core";

export default function App() {
  const [pages, setPages] = useState<PageData[] | null>(null);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
      <OffscreenMeasurer
        document={TEST_DOCUMENT as DocumentSchema}
        pageWidth={794}
        onMeasure={(measurements) => {
          setPages(
            paginateDocument(
              TEST_DOCUMENT as DocumentSchema,
              1123,
              measurements
            )
          );
        }}
      />

      {pages &&
        pages.map((page, idx) => {
          const header = page.headerId
            ? TEST_DOCUMENT.document.headers[page.headerId]
            : null;
          const footer = page.footerId
            ? TEST_DOCUMENT.document.footers[page.footerId]
            : null;

          return (
            <div
              key={idx}
              style={{
                width: 794,
                height: 1123,
                backgroundColor: "white",
                marginBottom: 20,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormCastProvider
                data={TEST_DOCUMENT.data}
                pageContext={{
                  pageNumber: page.pageNumber,
                  pageCount: pages.length,
                }}
                activeTab="content"
              >
                {header?.root && (
                  <div style={{ height: header.heightPx || "auto" }}>
                    <FormCastProvider
                      location="header"
                      data={TEST_DOCUMENT.data}
                      pageContext={{
                        pageNumber: page.pageNumber,
                        pageCount: pages.length,
                      }}
                      activeTab="content"
                    >
                      <NodeRenderer node={header.root} />
                    </FormCastProvider>
                  </div>
                )}

                <div
                  style={{
                    ...getStyle(TEST_DOCUMENT.document.body),
                    flex: 1,
                    overflow: "hidden",
                  }}
                >
                  <FormCastProvider
                    location="body"
                    data={TEST_DOCUMENT.data}
                    pageContext={{
                      pageNumber: page.pageNumber,
                      pageCount: pages.length,
                    }}
                    activeTab="content"
                  >
                    {page.bodyNodes.map((node: any, i: number) => (
                      <NodeRenderer key={`body-${node.id || i}`} node={node} />
                    ))}
                  </FormCastProvider>
                </div>

                {footer?.root && (
                  <div style={{ height: footer.heightPx || "auto" }}>
                    <FormCastProvider
                      location="footer"
                      data={TEST_DOCUMENT.data}
                      pageContext={{
                        pageNumber: page.pageNumber,
                        pageCount: pages.length,
                      }}
                      activeTab="content"
                    >
                      <NodeRenderer node={footer.root} />
                    </FormCastProvider>
                  </div>
                )}
              </FormCastProvider>
            </div>
          );
        })}
    </div>
  );
}
```

### Understanding the Code

1. **Registering Widgets**: Before rendering, you must call `registerDefaultWidgets()` (or register your own custom widgets) so `NodeRenderer` knows how to draw text, rows, columns, etc.
2. **OffscreenMeasurer**: This invisible component measures all the text sizes in your exact browser to tell the engine where to cut the pages.
3. **FormCastProvider**: Notice how we wrap the header, body, and footer inside separate `<FormCastProvider location="...">` tags. This tells the `NodeRenderer` which part of the document it is currently drawing, ensuring that variables like `{{pageNumber}}` or data bindings evaluate correctly for that specific region.
4. **NodeRenderer**: This component takes any node from your JSON schema and automatically draws the correct React component for it.

## Note on Examples

Please check the `examples/basic-usage` folder in the root repository to see a complete working setup.
