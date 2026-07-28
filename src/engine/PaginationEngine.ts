import { DocumentSchema, BaseNode, Measurements } from "../types/schema";
import { resolveHeader, resolveFooter } from "./resolver";
import { NodeRegistry } from "../registry/NodeRegistry";

export interface PageData {
  pageNumber: number;
  headerId?: string;
  footerId?: string;
  headerHeight: number;
  footerHeight: number;
  bodyNodes: BaseNode[];
}

function splitContainerNode(
  node: BaseNode,
  remainingHeight: number,
  ctx: { measurements: Measurements; data: any }
): [BaseNode, BaseNode | null, number] | null {
  if (!node.children || node.children.length === 0) return null;

  const originalId = node.id.split('-part')[0];
  const children = node.children;

  let currentHeight = 0;
  let splitIndex = 0;
  let fitsAtLeastOne = false;

  const layout = node.layout || {};
  const rowGap = layout.rowGap || 0;
  
  let splitChildChunk1: BaseNode | null = null;
  let splitChildChunk2: BaseNode | null = null;
  let splitChildHeight = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    let childHeight = getNodeHeight(child, ctx.measurements);

    const addedHeight = i > 0 ? rowGap + childHeight : childHeight;

    if (currentHeight + addedHeight <= remainingHeight) {
      currentHeight += addedHeight;
      splitIndex = i + 1;
      fitsAtLeastOne = true;
    } else {
      // Try to split the child itself recursively
      const def = NodeRegistry.get(child.type);
      const childSplitFn = def?.split || (child.children && child.children.length > 0 ? splitContainerNode : undefined);
      
      if (childSplitFn) {
        const childRemaining = remainingHeight - currentHeight - (i > 0 ? rowGap : 0);
        // Only try to split if we have reasonable space left
        if (childRemaining > 0) {
           const childSplitResult = childSplitFn(child, childRemaining, ctx);
           if (childSplitResult) {
              const [cChunk1, cChunk2, cChunk1Height] = childSplitResult;
              splitChildChunk1 = cChunk1;
              splitChildChunk2 = cChunk2;
              splitChildHeight = cChunk1Height ?? 0;
              
              currentHeight += (i > 0 ? rowGap : 0) + (cChunk1Height ?? 0);
              splitIndex = i; // The boundary is AT this child
              fitsAtLeastOne = true;
           }
        }
      }
      break;
    }
  }

  if (!fitsAtLeastOne) {
    return null;
  }

  if (splitIndex === children.length && !splitChildChunk1) {
    return [node, null, currentHeight];
  }

  const partNumber = (parseInt(node.id.split('-part')[1]) || 1) + 1;
  const chunk1Children = children.slice(0, splitIndex);
  const chunk2Children = children.slice(splitIndex);

  if (splitChildChunk1 && splitChildChunk2) {
    chunk1Children.push(splitChildChunk1);
    chunk2Children[0] = splitChildChunk2; // Replace the split child with its chunk2 part
  }

  const chunk1: BaseNode = {
    ...node,
    id: `${originalId}-part${partNumber - 1}`,
    children: chunk1Children,
  };

  const chunk2: BaseNode = {
    ...node,
    id: `${originalId}-part${partNumber}`,
    children: chunk2Children,
  };

  // Adjust margins/padding to keep flow clean
  if (chunk2.layout) {
    chunk2.layout = {
      ...chunk2.layout,
      marginTop: 0,
      paddingTop: 0,
    };
  }
  if (chunk1.layout) {
    chunk1.layout = {
      ...chunk1.layout,
      marginBottom: 0,
      paddingBottom: 0,
    };
  }

  return [chunk1, chunk2, currentHeight];
}

function getTableNodeHeight(node: BaseNode, measurements: Measurements): number {
  const originalId = node.id.split('-part')[0];
  const rowHeights = measurements.tableRows?.[originalId];
  
  let headerHeight = 38;
  if (measurements.tableHeaders?.[originalId] !== undefined) {
    headerHeight = measurements.tableHeaders[originalId];
  }
  
  if ((node.props as any)?.hideHeaderOnSplit && ((node.props as any)?.splitIndex || 0) > 0) {
    headerHeight = 0;
  }

  const marginTop = node.layout?.marginTop || 0;
  const marginBottom = node.layout?.marginBottom || 0;
  const paddingTop = node.layout?.paddingTop || 0;
  const paddingBottom = node.layout?.paddingBottom || 0;

  let rowSum = 0;
  const startIndex = (node.props as any)?.splitIndex || 0;
  const totalRows = rowHeights ? rowHeights.length : 0;
  const endIndex = (node.props as any)?.endIndex !== undefined ? (node.props as any).endIndex : totalRows;

  if (rowHeights) {
    const end = Math.min(endIndex, rowHeights.length);
    for (let i = startIndex; i < end; i++) {
      rowSum += rowHeights[i] || 0;
    }
  } else {
    const count = endIndex - startIndex;
    rowSum = Math.max(0, count) * 38;
  }

  return headerHeight + rowSum + marginTop + marginBottom + paddingTop + paddingBottom;
}

function getContainerNodeHeight(node: BaseNode, measurements: Measurements): number {
  if (!node.children || node.children.length === 0) return 0;
  
  const layout = node.layout || {};
  const rowGap = layout.rowGap || 0;
  const marginTop = layout.marginTop || 0;
  const marginBottom = layout.marginBottom || 0;
  const paddingTop = layout.paddingTop || 0;
  const paddingBottom = layout.paddingBottom || 0;
  
  const isHorizontal = node.type === "row";

  if (isHorizontal) {
    let maxHeight = 0;
    for (let i = 0; i < node.children.length; i++) {
      maxHeight = Math.max(maxHeight, getNodeHeight(node.children[i], measurements));
    }
    return maxHeight + marginTop + marginBottom + paddingTop + paddingBottom;
  } else {
    let heightSum = 0;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childHeight = getNodeHeight(child, measurements);
      heightSum += (i > 0 ? rowGap : 0) + childHeight;
    }
    return heightSum + marginTop + marginBottom + paddingTop + paddingBottom;
  }
}

function getNodeHeight(node: BaseNode, measurements: Measurements): number {
  const nodeId = node.id || "unnamed";
  
  if (node.type === "table") {
    return getTableNodeHeight(node, measurements);
  }
  
  if (measurements.blocks[nodeId] !== undefined) {
    return measurements.blocks[nodeId];
  }
  
  if (node.children && node.children.length > 0) {
    return getContainerNodeHeight(node, measurements);
  }
  
  const originalId = nodeId.split('-part')[0];
  if (measurements.blocks[originalId] !== undefined) {
    return measurements.blocks[originalId];
  }
  
  return 0;
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
    
    // Calculate accurate block height based on exact split parts / contents
    const blockHeight = getNodeHeight(block, measurements);

    const addedHeight = currentNodes.length > 0 ? rowGap + blockHeight : blockHeight;
    // Add 1px subpixel safety margin to available height comparison
    const exceedsSpace = forcePageBreak || (currentHeight + addedHeight > availableHeight - 1);

    if (exceedsSpace) {
      let didSplit = false;

      if (!forcePageBreak) {
        const def = NodeRegistry.get(block.type);
        const splitFn = def?.split || (block.children && block.children.length > 0 ? splitContainerNode : undefined);

        if (splitFn) {
          const remaining = availableHeight - currentHeight - (currentNodes.length > 0 ? rowGap : 0);
          const splitResult = splitFn(block, remaining, { data: doc.data, measurements });
          
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
