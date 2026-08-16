import { TableNode } from "@papercast/core";
import { MeasureContext, SplitContext } from "../registry";
import { resolvePath } from "../resolver";

function parseSize(val: number | string | undefined): number {
  if (val === undefined) return 0;
  if (typeof val === "number") return val;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

export const TableBehavior = {
  measure: (node: TableNode, ctx: MeasureContext): number => {
    if (!ctx.measurements) return 0;

    const originalId = node.id.split("-part")[0];
    const rowHeights = ctx.measurements.tableRows?.[originalId];
    const footerRowHeights = ctx.measurements.tableFooterRows?.[originalId];

    let headerHeight = 38;
    if (ctx.measurements.tableHeaders?.[originalId] !== undefined) {
      headerHeight = ctx.measurements.tableHeaders[originalId];
    }

    if (node.props?.hideHeaderOnSplit && (node.props?.splitIndex || 0) > 0) {
      headerHeight = 0;
    }

    const marginTop = parseSize(node.layout?.marginTop);
    const marginBottom = parseSize(node.layout?.marginBottom);
    const paddingTop = parseSize(node.layout?.paddingTop);
    const paddingBottom = parseSize(node.layout?.paddingBottom);

    let rowSum = 0;
    const startIndex = node.props?.splitIndex || 0;
    const totalRows = rowHeights ? rowHeights.length : 0;
    const endIndex =
      node.props?.endIndex !== undefined ? node.props.endIndex : totalRows;

    if (rowHeights) {
      const end = Math.min(endIndex, rowHeights.length);
      for (let i = startIndex; i < end; i++) {
        rowSum += rowHeights[i] || 0;
      }
    } else {
      const count = endIndex - startIndex;
      rowSum = Math.max(0, count) * 38;
    }

    let footerRowSum = 0;
    const fStartIndex = node.props?.footerSplitIndex || 0;
    const totalFooterRows = node.props?.footerRows?.length || 0;
    const fEndIndex =
      node.props?.footerEndIndex !== undefined
        ? node.props.footerEndIndex
        : totalFooterRows;

    if (footerRowHeights) {
      const fEnd = Math.min(fEndIndex, footerRowHeights.length);
      for (let i = fStartIndex; i < fEnd; i++) {
        footerRowSum += footerRowHeights[i] || 0;
      }
    } else {
      const fCount = fEndIndex - fStartIndex;
      footerRowSum = Math.max(0, fCount) * 38;
    }

    return (
      headerHeight +
      rowSum +
      footerRowSum +
      marginTop +
      marginBottom +
      paddingTop +
      paddingBottom
    );
  },

  split: (
    node: TableNode,
    remainingHeight: number,
    ctx: SplitContext
  ): [TableNode, TableNode | null, number?] | null => {
    const originalId = node.id.split("-part")[0];
    const rowHeights = ctx.measurements?.tableRows?.[originalId];
    const footerRowHeights = ctx.measurements?.tableFooterRows?.[originalId];

    let headerHeight = 38;
    if (ctx.measurements?.tableHeaders?.[originalId] !== undefined) {
      headerHeight = ctx.measurements.tableHeaders[originalId];
    }

    if (node.props?.hideHeaderOnSplit && (node.props?.splitIndex || 0) > 0) {
      headerHeight = 0;
    }

    const marginTop = parseSize(node.layout?.marginTop);
    const marginBottom = parseSize(node.layout?.marginBottom);
    const actualRemaining = remainingHeight - marginTop - marginBottom - 1;

    let totalRows = 0;
    if (node.props?.bodyRows) {
      totalRows = node.props.bodyRows.length;
    } else if (node.bind?.path) {
      const val = resolvePath(ctx.data, node.bind.path);
      if (Array.isArray(val)) {
        totalRows = val.length;
      }
    } else {
      totalRows = node.props?.data?.length || 0;
    }

    const currentStartIndex = node.props?.splitIndex || 0;
    const currentEndIndex =
      node.props?.endIndex !== undefined ? node.props.endIndex : totalRows;

    let availableRows = 0;
    let accumulatedHeight = 0;
    let reachedEndOfBody = false;

    if (rowHeights && rowHeights.length >= currentEndIndex) {
      let activeRowSpans = 0;
      let safeCutoff = 0;
      let tempHeight = 0;

      for (let i = currentStartIndex; i < currentEndIndex; i++) {
        const rowH = rowHeights[i];
        if (headerHeight + tempHeight + rowH <= actualRemaining) {
          tempHeight += rowH;

          // Track rowSpans to ensure we don't break mid-merge
          let maxSpanInRow = 1;
          if (node.props?.bodyRows) {
            const rowDef = node.props.bodyRows[i];
            if (rowDef && rowDef.cells) {
              for (const cell of rowDef.cells) {
                if (cell.rowSpan && cell.rowSpan > maxSpanInRow) {
                  maxSpanInRow = cell.rowSpan;
                }
              }
            }
          } else if ((node.bind?.path && ctx.data) || node.props?.data) {
            const dataArray = node.bind?.path
              ? resolvePath(ctx.data, node.bind.path)
              : node.props?.data;
            if (Array.isArray(dataArray) && node.props?.columns) {
              const currentRowData = dataArray[i];
              for (const col of node.props.columns) {
                if (col.mergeBy && col.mergeBy.length > 0) {
                  let isNewGroup = true;
                  if (i > 0) {
                    const prevRowData = dataArray[i - 1];
                    let allMatched = true;
                    for (const path of col.mergeBy) {
                      if (
                        resolvePath(currentRowData, path) !==
                        resolvePath(prevRowData, path)
                      ) {
                        allMatched = false;
                        break;
                      }
                    }
                    if (allMatched) isNewGroup = false;
                  }

                  if (isNewGroup) {
                    let span = 1;
                    while (i + span < currentEndIndex) {
                      const nextRowData = dataArray[i + span];
                      let allMatched = true;
                      for (const path of col.mergeBy) {
                        if (
                          resolvePath(nextRowData, path) !==
                          resolvePath(currentRowData, path)
                        ) {
                          allMatched = false;
                          break;
                        }
                      }
                      if (allMatched) span++;
                      else break;
                    }
                    if (span > maxSpanInRow) {
                      maxSpanInRow = span;
                    }
                  }
                }
              }
            }
          }
          if (maxSpanInRow > 1 && activeRowSpans === 0) {
            activeRowSpans = maxSpanInRow;
          }

          if (activeRowSpans > 0) activeRowSpans--;

          availableRows++;
          if (activeRowSpans === 0) {
            safeCutoff = availableRows;
          }
        } else {
          if (node.props?.bodyRows) {
            availableRows = safeCutoff;
          }
          break;
        }
      }

      for (let i = 0; i < availableRows; i++) {
        accumulatedHeight += rowHeights[currentStartIndex + i] || 38;
      }

      reachedEndOfBody = currentStartIndex + availableRows >= currentEndIndex;
    } else {
      const rowHeight = 38;
      availableRows = Math.floor((actualRemaining - headerHeight) / rowHeight);
      const needed = currentEndIndex - currentStartIndex;
      if (availableRows >= needed) {
        availableRows = needed;
        reachedEndOfBody = true;
      }
      accumulatedHeight = availableRows * rowHeight;
    }

    const newSplitIndex = currentStartIndex + availableRows;

    // Now calculate footer rows if we reached end of body
    let availableFooterRows = 0;
    const currentFooterStartIndex = node.props?.footerSplitIndex || 0;
    const totalFooterRows = node.props?.footerRows?.length || 0;
    const currentFooterEndIndex =
      node.props?.footerEndIndex !== undefined
        ? node.props.footerEndIndex
        : totalFooterRows;

    if (reachedEndOfBody) {
      if (footerRowHeights) {
        let activeRowSpans = 0;
        let safeFooterCutoff = 0;
        let tempHeight = 0;

        for (let i = currentFooterStartIndex; i < currentFooterEndIndex; i++) {
          const rowH = footerRowHeights[i] || 38;
          if (
            headerHeight + accumulatedHeight + tempHeight + rowH <=
            actualRemaining
          ) {
            tempHeight += rowH;

            // Track rowSpans to ensure we don't break mid-merge
            const rowDef = node.props?.footerRows?.[i];
            let maxSpanInRow = 1;
            if (rowDef && rowDef.cells) {
              for (const cell of rowDef.cells) {
                if (cell.rowSpan && cell.rowSpan > maxSpanInRow) {
                  maxSpanInRow = cell.rowSpan;
                }
              }
            }
            if (maxSpanInRow > 1 && activeRowSpans === 0) {
              activeRowSpans = maxSpanInRow;
            }

            if (activeRowSpans > 0) activeRowSpans--;

            availableFooterRows++;
            if (activeRowSpans === 0) {
              safeFooterCutoff = availableFooterRows;
            }
          } else {
            // we can't fit this row. Break at safe cutoff.
            availableFooterRows = safeFooterCutoff;
            break;
          }
        }

        // update accumulatedHeight with the safely added footer rows
        for (let i = 0; i < availableFooterRows; i++) {
          accumulatedHeight +=
            footerRowHeights[currentFooterStartIndex + i] || 38;
        }
      } else {
        const rowHeight = 38;
        const maxCanFit = Math.floor(
          (actualRemaining - headerHeight - accumulatedHeight) / rowHeight
        );
        const needed = currentFooterEndIndex - currentFooterStartIndex;
        availableFooterRows = Math.min(maxCanFit, needed);
        accumulatedHeight += availableFooterRows * rowHeight;
      }
    }

    if (availableRows <= 0 && availableFooterRows <= 0) return null;

    const newFooterSplitIndex = currentFooterStartIndex + availableFooterRows;

    const chunk1: TableNode = {
      ...node,
      id: `${node.id}-part1`,
      props: {
        ...node.props,
        splitIndex: currentStartIndex,
        endIndex:
          newSplitIndex > currentEndIndex ? currentEndIndex : newSplitIndex,
        footerSplitIndex: currentFooterStartIndex,
        footerEndIndex:
          newFooterSplitIndex > currentFooterEndIndex
            ? currentFooterEndIndex
            : newFooterSplitIndex,
      },
    };

    const chunk1Height =
      headerHeight + accumulatedHeight + marginTop + marginBottom;

    if (
      newSplitIndex >= currentEndIndex &&
      newFooterSplitIndex >= currentFooterEndIndex
    ) {
      return [chunk1, null, chunk1Height];
    }

    const chunk2: TableNode = {
      ...node,
      id: `${node.id}-part2`,
      props: {
        ...node.props,
        splitIndex: newSplitIndex,
        endIndex: currentEndIndex,
        footerSplitIndex: newFooterSplitIndex,
        footerEndIndex: currentFooterEndIndex,
        hideHeaderOnSplit: node.props?.tableSplitBehaviour === "withoutHeader",
      },
      layout: {
        ...node.layout,
        marginTop: 0,
      },
    };

    if (chunk1.layout) {
      chunk1.layout = {
        ...chunk1.layout,
        marginBottom: 0,
      };
    }

    return [chunk1, chunk2, chunk1Height];
  },
};
