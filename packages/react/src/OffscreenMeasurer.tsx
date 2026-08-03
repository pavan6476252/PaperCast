import React, { useLayoutEffect, useRef } from "react";
import { DocumentSchema } from "@formcast/core";
import { Measurements } from "@formcast/engine";
import { NodeRenderer } from "./NodeRenderer";
import { getStyle } from "./utils/styleUtils";

import { FormCastProvider } from "./FormCastProvider";

export interface OffscreenMeasurerProps {
  /** The complete document schema to measure */
  document: DocumentSchema;
  /** The physical width of the page to constrain layout rendering */
  pageWidth: number;
  /** Callback triggered once all elements have been rendered and measured off-screen */
  onMeasure: (measurements: Measurements) => void;
}

/**
 * Headless utility component that renders the document off-screen to measure
 * exact pixel heights of all nodes, rows, tables, and regions.
 * These measurements are then fed to the PaginationEngine to determine page breaks.
 */
export const OffscreenMeasurer: React.FC<OffscreenMeasurerProps> = ({
  document: doc,
  pageWidth,
  onMeasure,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Use requestAnimationFrame or immediate layout evaluation
    // Since this is useLayoutEffect, the DOM is ready but not painted yet.
    const headers: Record<string, number> = {};
    const footers: Record<string, number> = {};
    const blocks: Record<string, number> = {};
    const tableRows: Record<string, number[]> = {};
    const tableFooterRows: Record<string, number[]> = {};
    const tableHeaders: Record<string, number> = {};

    const headerNodes = containerRef.current.querySelectorAll(
      "[data-measure-header]"
    );
    headerNodes.forEach((node) => {
      const id = node.getAttribute("data-measure-header");
      if (id) headers[id] = node.getBoundingClientRect().height;
    });

    const footerNodes = containerRef.current.querySelectorAll(
      "[data-measure-footer]"
    );
    footerNodes.forEach((node) => {
      const id = node.getAttribute("data-measure-footer");
      if (id) footers[id] = node.getBoundingClientRect().height;
    });

    const blockNodes = containerRef.current.querySelectorAll(
      "[data-measure-block]"
    );
    blockNodes.forEach((node) => {
      const id = node.getAttribute("data-measure-block");
      if (id) blocks[id] = node.getBoundingClientRect().height;
    });

    const allNodeElements =
      containerRef.current.querySelectorAll("[data-node-id]");
    allNodeElements.forEach((node) => {
      const id = node.getAttribute("data-node-id");
      if (id) blocks[id] = node.getBoundingClientRect().height;
    });

    const tables = containerRef.current.querySelectorAll(
      "table[data-table-id]"
    );
    tables.forEach((table) => {
      const id = table.getAttribute("data-table-id");
      if (id) {
        const thead = table.querySelector("thead");
        tableHeaders[id] = thead ? thead.getBoundingClientRect().height : 0;

        const trs = table.querySelectorAll("tbody tr");
        tableRows[id] = Array.from(trs).map(
          (tr) => tr.getBoundingClientRect().height
        );

        const footerTrs = table.querySelectorAll("tfoot tr");
        tableFooterRows[id] = Array.from(footerTrs).map(
          (tr) => tr.getBoundingClientRect().height
        );
      }
    });

    console.log("OffscreenMeasurer blocks:", blocks);
    onMeasure({
      headers,
      footers,
      blocks,
      tableRows,
      tableFooterRows,
      tableHeaders,
    });
  }, [doc, pageWidth, onMeasure]);

  return (
    <FormCastProvider data={doc.data}>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          left: -9999,
          top: -9999,
          opacity: 0,
          pointerEvents: "none",
          width: pageWidth,
        }}
      >
        {/* Measure Headers */}
        {Object.entries(doc.document.headers || {}).map(([id, header]) => (
          <div
            key={`header-${id}`}
            data-measure-header={id}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {header.root && <NodeRenderer node={header.root} />}
          </div>
        ))}

        {/* Measure Footers */}
        {Object.entries(doc.document.footers || {}).map(([id, footer]) => (
          <div
            key={`footer-${id}`}
            data-measure-footer={id}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {footer.root && <NodeRenderer node={footer.root} />}
          </div>
        ))}

        {/* Measure Top-level Body Blocks */}
        <div style={{ ...getStyle(doc.document.body), width: "100%" }}>
          {doc.document.body.children?.map((child, index) => (
            <div
              key={`block-${child.id || index}`}
              data-measure-block={child.id || index}
            >
              <NodeRenderer node={child} />
            </div>
          ))}
        </div>
      </div>
    </FormCastProvider>
  );
};
