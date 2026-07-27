import { DocumentSchema, BaseNode } from "../types/schema";
import { resolveHeader, resolveFooter } from "./resolver";
import { Measurements } from "./OffscreenMeasurer";
import { NodeRegistry } from "../registry/NodeRegistry";

export interface PageData {
  pageNumber: number;
  headerId?: string;
  footerId?: string;
  headerHeight: number;
  footerHeight: number;
  bodyNodes: BaseNode[];
}

export function paginateDocument(
  doc: DocumentSchema,
  pageHeight: number,
  measurements: Measurements
): PageData[] {
  const pages: PageData[] = [];
  let currentPageNumber = 1;
  let currentNodes: BaseNode[] = [];
  
  const bodyLayout = doc.document.body.layout || {};
  const paddingTop = bodyLayout.paddingTop || 0;
  const paddingBottom = bodyLayout.paddingBottom || 0;
  const borderTop = bodyLayout.borderTopWidth || 0;
  const borderBottom = bodyLayout.borderBottomWidth || 0;
  const rowGap = bodyLayout.rowGap || 0;
  
  let headerKey = resolveHeader(currentPageNumber, Infinity, doc.document);
  let footerKey = resolveFooter(currentPageNumber, Infinity, doc.document);
  
  let headerSection = headerKey ? doc.document.headers[headerKey] : undefined;
  let footerSection = footerKey ? doc.document.footers[footerKey] : undefined;
  
  let headerHeight = headerSection ? (headerSection.heightPx ?? measurements.headers[headerKey!] ?? 0) : 0;
  let footerHeight = footerSection ? (footerSection.heightPx ?? measurements.footers[footerKey!] ?? 0) : 0;
  
  let availableHeight = pageHeight - headerHeight - footerHeight - paddingTop - paddingBottom - borderTop - borderBottom;
  let currentHeight = 0;
  
  const blocks = [...(doc.document.body.children || [])];
  
  while (blocks.length > 0) {
    const block = blocks.shift()!;
    const blockId = block.id || "unnamed";

    const forcePageBreak = block.layout?.pageBreakBefore && currentNodes.length > 0;
    
    // If the block was split in a previous pass, it might not be in measurements.
    let blockHeight = measurements.blocks[blockId] || 0;
    if (!measurements.blocks[blockId]) {
      const originalId = blockId.split('-part')[0];
      blockHeight = measurements.blocks[originalId] || 0;
    }

    const addedHeight = currentNodes.length > 0 ? rowGap + blockHeight : blockHeight;
    // Add 1px subpixel safety margin to available height comparison
    const exceedsSpace = forcePageBreak || (currentHeight + addedHeight > availableHeight - 1);

    if (exceedsSpace) {
      let didSplit = false;

      if (!forcePageBreak) {
        const def = NodeRegistry.get(block.type);
        if (def && def.split) {
          const remaining = availableHeight - currentHeight - (currentNodes.length > 0 ? rowGap : 0);
          const splitResult = def.split(block, remaining, { data: doc.data, measurements });
          
          if (splitResult) {
            const [chunk1, chunk2, chunk1Height] = splitResult;
            currentNodes.push(chunk1);
            if (chunk2) {
              // chunk2 needs to be processed on the next page
              blocks.unshift(chunk2);
              didSplit = true;
            } else {
              // Overestimated height caused a split check, but it actually fits entirely!
              currentHeight += (currentNodes.length > 1 ? rowGap : 0) + (chunk1Height ?? remaining);
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
          bodyNodes: currentNodes
        });
        
        currentPageNumber++;
        currentNodes = [];
        currentHeight = 0;
        
        headerKey = resolveHeader(currentPageNumber, Infinity, doc.document);
        footerKey = resolveFooter(currentPageNumber, Infinity, doc.document);
        headerSection = headerKey ? doc.document.headers[headerKey] : undefined;
        footerSection = footerKey ? doc.document.footers[footerKey] : undefined;
        
        headerHeight = headerSection ? (headerSection.heightPx ?? measurements.headers[headerKey!] ?? 0) : 0;
        footerHeight = footerSection ? (footerSection.heightPx ?? measurements.footers[footerKey!] ?? 0) : 0;
        availableHeight = pageHeight - headerHeight - footerHeight - paddingTop - paddingBottom;
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
      bodyNodes: currentNodes
    });
  }
  
  // Second pass: correct "last" page header/footer resolution
  const totalPages = pages.length;
  const lastPage = pages[totalPages - 1];
  
  const lastHeaderKey = resolveHeader(totalPages, totalPages, doc.document);
  const lastFooterKey = resolveFooter(totalPages, totalPages, doc.document);
  
  const lastHeaderSection = lastHeaderKey ? doc.document.headers[lastHeaderKey] : undefined;
  const lastFooterSection = lastFooterKey ? doc.document.footers[lastFooterKey] : undefined;
  
  lastPage.headerId = lastHeaderKey;
  lastPage.footerId = lastFooterKey;
  lastPage.headerHeight = lastHeaderSection ? (lastHeaderSection.heightPx ?? measurements.headers[lastHeaderKey!] ?? 0) : 0;
  lastPage.footerHeight = lastFooterSection ? (lastFooterSection.heightPx ?? measurements.footers[lastFooterKey!] ?? 0) : 0;
  
  return pages;
}
