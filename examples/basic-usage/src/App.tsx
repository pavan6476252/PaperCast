import { useState, useCallback, useMemo } from "react";
import {
  NodeRenderer,
  FormCastProvider,
  OffscreenMeasurer,
  getStyle,
  autoDeconstructRichTextAst,
} from "@formcast/react";
import { Measurements, paginateDocument, PageData } from "@formcast/engine";
import { DocumentSchema, AnyNode } from "@formcast/core";
import { TEST_DOCUMENT } from "@formcast/core/test";
import "./index.css";

function App() {
  const [pages, setPages] = useState<PageData[] | null>(null);
  const width = 794;
  const height = 1123; // A4 size

  const parsedDocument = useMemo(() => {
    return {
      ...TEST_DOCUMENT,
      document: {
        ...TEST_DOCUMENT.document,
        body: autoDeconstructRichTextAst(
          TEST_DOCUMENT.document.body as AnyNode,
          TEST_DOCUMENT.meta?.richTextPreferences
        ),
      },
    } as DocumentSchema;
  }, []);

  const handleMeasure = useCallback(
    (measurements: Measurements) => {
      const newPages = paginateDocument(parsedDocument, height, measurements);
      setPages(newPages);
    },
    [parsedDocument]
  );

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#e5e7eb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <OffscreenMeasurer
        document={parsedDocument as DocumentSchema}
        pageWidth={width}
        onMeasure={handleMeasure}
      />

      {!pages && <div style={{ marginTop: 20 }}>Loading and Measuring...</div>}

      {pages &&
        pages.map((page, idx) => {
          const header = page.headerId
            ? parsedDocument.document.headers[page.headerId]
            : null;
          const footer = page.footerId
            ? parsedDocument.document.footers[page.footerId]
            : null;

          return (
            <div
              key={idx}
              className="page-container"
              style={{
                width,
                height,
                backgroundColor: "white",
                marginBottom: 20,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormCastProvider
                data={parsedDocument.data}
                pageContext={{
                  pageNumber: page.pageNumber,
                  pageCount: pages.length,
                }}
                activeTab="content"
              >
                {/* Render Header */}
                {header?.root && (
                  <FormCastProvider
                    data={parsedDocument.data}
                    pageContext={{
                      pageNumber: page.pageNumber,
                      pageCount: pages.length,
                    }}
                    activeTab="content"
                    location="header"
                  >
                    <div
                      style={{
                        height:
                          header.heightPx !== undefined
                            ? header.heightPx
                            : "auto",
                      }}
                    >
                      <NodeRenderer node={header.root} />
                    </div>
                  </FormCastProvider>
                )}

                {/* Render Body for this page */}
                <FormCastProvider
                  data={parsedDocument.data}
                  pageContext={{
                    pageNumber: page.pageNumber,
                    pageCount: pages.length,
                  }}
                  activeTab="content"
                  location="body"
                >
                  <div
                    style={{
                      ...getStyle(parsedDocument.document.body),
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    {page.bodyNodes.map((node: any, i: number) => (
                      <NodeRenderer key={`body-${node.id || i}`} node={node} />
                    ))}
                  </div>
                </FormCastProvider>

                {/* Render Footer */}
                {footer?.root && (
                  <FormCastProvider
                    data={parsedDocument.data}
                    pageContext={{
                      pageNumber: page.pageNumber,
                      pageCount: pages.length,
                    }}
                    activeTab="content"
                    location="footer"
                  >
                    <div
                      style={{
                        height:
                          footer.heightPx !== undefined
                            ? footer.heightPx
                            : "auto",
                      }}
                    >
                      <NodeRenderer node={footer.root} />
                    </div>
                  </FormCastProvider>
                )}
              </FormCastProvider>
            </div>
          );
        })}
    </div>
  );
}

export default App;
