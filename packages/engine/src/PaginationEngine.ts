import { DocumentSchema, AnyNode } from "@papercast/core";
import jexl from "jexl";
import { resolvePageRegion } from "./resolver";
import { SchemaRegistry } from "./registry";
import { Measurements } from "./types";

/**
 * Represents the final paginated state of a single physical page,
 * containing all node chunks that successfully fit within its height boundaries.
 */
export interface PageData {
  pageNumber: number;
  headerId?: string;
  footerId?: string;
  headerHeight: number;
  footerHeight: number;
  bodyNodes: AnyNode[];
}

function parseSize(val: number | string | undefined): number {
  if (val === undefined) return 0;
  if (typeof val === "number") return val;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

function getNodeHeight(node: AnyNode, measurements: Measurements): number {
  const def = SchemaRegistry.get(node.type);
  if (def?.measure) {
    const calculated = def.measure(node, {
      availableWidthPx: 0,
      measurements,
      getNodeHeight,
    });
    if (calculated > 0) return calculated;
  }

  const layout = node.layout || {};
  const marginTop = parseSize(layout.marginTop);
  const marginBottom = parseSize(layout.marginBottom);
  const margins = marginTop + marginBottom;

  const nodeId = node.id || "unnamed";
  if (measurements.blocks[nodeId] !== undefined) {
    return measurements.blocks[nodeId] + margins;
  }

  const originalId = nodeId.split("-part")[0];
  if (measurements.blocks[originalId] !== undefined) {
    return measurements.blocks[originalId] + margins;
  }

  return 0;
}

/**
 * Orchestrates the physical layout of a PaperCast document by dividing its
 * continuous AST structure into discrete, print-ready pages.
 *
 * @param doc - The complete PaperCast document schema to paginate.
 * @param pageHeight - The physical height of the target page in pixels.
 * @param measurements - Dictionary of pre-calculated DOM heights for nodes.
 * @returns Array of page data objects, each containing the localized nodes and resolved regions for that specific page.
 */
export function paginateDocument(
  doc: DocumentSchema,
  pageHeight: number,
  measurements: Measurements
): PageData[] {
  const pages: PageData[] = [];
  let currentPageNumber = 1;
  let currentNodes: AnyNode[] = [];

  const bodyLayout = doc.document.body.layout || {};
  const paddingTop = parseSize(bodyLayout.paddingTop);
  const paddingBottom = parseSize(bodyLayout.paddingBottom);
  const borderTop = parseSize(bodyLayout.borderTopWidth);
  const borderBottom = parseSize(bodyLayout.borderBottomWidth);
  const rowGap = parseSize(bodyLayout.rowGap);

  let headerKey = resolvePageRegion(
    "header",
    currentPageNumber,
    Infinity,
    doc.document
  );
  let footerKey = resolvePageRegion(
    "footer",
    currentPageNumber,
    Infinity,
    doc.document
  );

  let headerSection = headerKey ? doc.document.headers[headerKey] : undefined;
  let footerSection = footerKey ? doc.document.footers[footerKey] : undefined;

  let headerHeight = headerSection
    ? (headerSection.heightPx ?? measurements.headers[headerKey!] ?? 0)
    : 0;
  let footerHeight = footerSection
    ? (footerSection.heightPx ?? measurements.footers[footerKey!] ?? 0)
    : 0;

  let availableHeight =
    pageHeight -
    headerHeight -
    footerHeight -
    paddingTop -
    paddingBottom -
    borderTop -
    borderBottom;
  let currentHeight = 0;

  const blocks = [...(doc.document.body.children || [])];

  while (blocks.length > 0) {
    const block = blocks.shift()!;
    // const blockId = block.id || "unnamed";

    if (block.visibleIf) {
      try {
        const isVisible = jexl.evalSync(block.visibleIf, doc.data);
        if (!isVisible) continue;
      } catch (e) {
        console.warn(
          `Failed to evaluate visibleIf condition for block ${block.id}:`,
          e
        );
      }
    }

    const forcePageBreak =
      block.layout?.pageBreakBefore && currentNodes.length > 0;

    // Calculate accurate block height based on exact split parts / contents
    const blockHeight = getNodeHeight(block, measurements);

    const addedHeight =
      currentNodes.length > 0 ? rowGap + blockHeight : blockHeight;
    // Add 1px subpixel safety margin to available height comparison
    const exceedsSpace =
      forcePageBreak || currentHeight + addedHeight > availableHeight - 1;

    if (exceedsSpace) {
      let didSplit = false;

      if (!forcePageBreak) {
        const def = SchemaRegistry.get(block.type);
        const splitFn = def?.split;

        if (splitFn) {
          const remaining =
            availableHeight -
            currentHeight -
            (currentNodes.length > 0 ? rowGap : 0);
          const splitResult = splitFn(block, remaining, {
            data: doc.data,
            measurements,
            getNodeHeight,
          });

          if (splitResult) {
            const [chunk1, chunk2, chunk1Height] = splitResult;
            currentNodes.push(chunk1);
            if (chunk2) {
              // chunk2 needs to be processed on the next page
              blocks.unshift(chunk2);
              didSplit = true;
            } else {
              // Overestimated height caused a split check, but it actually fits entirely!
              currentHeight +=
                (currentNodes.length > 1 ? rowGap : 0) +
                (chunk1Height ?? remaining);
              continue; // Skip finalizing the page! Move to next block.
            }
          }
        }
      }

      if (!didSplit) {
        if (currentNodes.length > 0) {
          // Couldn't split (or forced page break), but we have content. Push block to the next page.
          blocks.unshift(block);
        } else {
          // It's the first node, it's too big, and we can't split it!
          // Force it onto this page to prevent an infinite loop, let it overflow.
          currentNodes.push(block);
        }
      }

      // Finalize current page if we have content
      if (currentNodes.length > 0) {
        pages.push({
          pageNumber: currentPageNumber,
          headerId: headerKey,
          footerId: footerKey,
          headerHeight,
          footerHeight,
          bodyNodes: currentNodes,
        });

        currentPageNumber++;
        currentNodes = [];
        currentHeight = 0;

        headerKey = resolvePageRegion(
          "header",
          currentPageNumber,
          Infinity,
          doc.document
        );
        footerKey = resolvePageRegion(
          "footer",
          currentPageNumber,
          Infinity,
          doc.document
        );
        headerSection = headerKey ? doc.document.headers[headerKey] : undefined;
        footerSection = footerKey ? doc.document.footers[footerKey] : undefined;

        headerHeight = headerSection
          ? (headerSection.heightPx ?? measurements.headers[headerKey!] ?? 0)
          : 0;
        footerHeight = footerSection
          ? (footerSection.heightPx ?? measurements.footers[footerKey!] ?? 0)
          : 0;
        availableHeight =
          pageHeight - headerHeight - footerHeight - paddingTop - paddingBottom;
      }
    } else {
      // It fits fully on the current page
      currentNodes.push(block);
      currentHeight += addedHeight;
    }
  }

  // Push the final page
  if (currentNodes.length > 0 || pages.length === 0) {
    pages.push({
      pageNumber: currentPageNumber,
      headerId: headerKey,
      footerId: footerKey,
      headerHeight,
      footerHeight,
      bodyNodes: currentNodes,
    });
  }

  // Second pass: correct "last" page header/footer resolution
  const totalPages = pages.length;
  const lastPage = pages[totalPages - 1];

  const lastHeaderKey = resolvePageRegion(
    "header",
    totalPages,
    totalPages,
    doc.document
  );
  const lastFooterKey = resolvePageRegion(
    "footer",
    totalPages,
    totalPages,
    doc.document
  );

  const lastHeaderSection = lastHeaderKey
    ? doc.document.headers[lastHeaderKey]
    : undefined;
  const lastFooterSection = lastFooterKey
    ? doc.document.footers[lastFooterKey]
    : undefined;

  lastPage.headerId = lastHeaderKey;
  lastPage.footerId = lastFooterKey;
  lastPage.headerHeight = lastHeaderSection
    ? (lastHeaderSection.heightPx ?? measurements.headers[lastHeaderKey!] ?? 0)
    : 0;
  lastPage.footerHeight = lastFooterSection
    ? (lastFooterSection.heightPx ?? measurements.footers[lastFooterKey!] ?? 0)
    : 0;

  return pages;
}
