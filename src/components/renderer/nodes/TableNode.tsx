import React from "react";
import { TableNode } from "../../../types/schema";
import { getStyle } from "../utils/styleUtils";
import { NodeRegistry } from "../../../registry/NodeRegistry";
import { useRendererContext } from "../RendererContext";

// Helper to resolve nested object path
const resolvePath = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const TableComponent: React.FC<{ 
  node: TableNode;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}> = ({ node, isSelected, onSelect }) => {
  const { data } = useRendererContext();
  const props = node.props || {};
  const columns = props.columns || [];

  // Retrieve bound data
  let rowData: any[] = [];
  if (node.bind?.path) {
    const val = resolvePath(data, node.bind.path);
    if (Array.isArray(val)) {
      rowData = val;
    }
  }

  // Handle pagination limits
  const startIndex = props.splitIndex || 0;
  const endIndex = props.endIndex !== undefined ? props.endIndex : rowData.length;
  const displayRows = rowData.slice(startIndex, endIndex);

  return (
    <div 
      style={{ 
        ...getStyle(node), 
        width: "100%", 
        overflow: "hidden",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "-2px",
        cursor: "pointer", 
      }}
      onClick={onSelect}
    >
      <table data-table-id={node.id} style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        {/* Table Columns */}
        <colgroup>
          {columns.map((col, idx) => (
            <col key={idx} style={{ width: col.widthPx ? `${col.widthPx}px` : undefined }} />
          ))}
        </colgroup>

        {/* Table Header */}
        {(!props.hideHeaderOnSplit || startIndex === 0) && (
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ccc" }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: "8px",
                    textAlign: col.align || "left",
                    fontWeight: "bold",
                    fontSize: "0.9em",
                  }}
                >
                  {col.headerText || col.bindPath}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Table Body */}
        <tbody>
          {displayRows.map((row, rowIdx) => (
            <tr key={rowIdx} style={{ borderBottom: "1px solid #eee" }}>
              {columns.map((col, colIdx) => {
                let cellVal = "";
                if (col.bindPath) {
                  const val = resolvePath(row, col.bindPath);
                  cellVal = val !== undefined ? String(val) : "";
                }
                return (
                  <td
                    key={colIdx}
                    style={{
                      padding: "8px",
                      textAlign: col.align || "left",
                      fontSize: "0.9em",
                      wordWrap: "break-word",
                    }}
                  >
                    {cellVal}
                  </td>
                );
              })}
            </tr>
          ))}
          {displayRows.length === 0 && (
            <tr>
              <td colSpan={columns.length || 1} style={{ padding: "16px", textAlign: "center", color: "#999" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

NodeRegistry.register({
  type: "table",
  measure: () => 0,
  render: TableComponent,
  split: (node: TableNode, remainingHeight: number, ctx) => {
    const originalId = node.id.split('-part')[0];
    const rowHeights = ctx.measurements?.tableRows?.[originalId];
    
    let headerHeight = 38;
    if (ctx.measurements?.tableHeaders?.[originalId] !== undefined) {
      headerHeight = ctx.measurements.tableHeaders[originalId];
    }
    
    if (node.props?.hideHeaderOnSplit && (node.props?.splitIndex || 0) > 0) {
      headerHeight = 0;
    }
    
    const marginTop = node.layout?.marginTop || 0;
    const marginBottom = node.layout?.marginBottom || 0;
    // Add 1px safety margin to actual remaining space to prevent rounding overlaps
    const actualRemaining = remainingHeight - marginTop - marginBottom - 1;
    
    let totalRows = 0;
    if (node.bind?.path) {
      const val = resolvePath(ctx.data, node.bind.path);
      if (Array.isArray(val)) {
        totalRows = val.length;
      }
    } else {
      totalRows = node.props?.customRows?.length || 0;
    }

    const currentStartIndex = node.props?.splitIndex || 0;
    const currentEndIndex = node.props?.endIndex !== undefined ? node.props.endIndex : totalRows;

    let availableRows = 0;
    let accumulatedHeight = 0;

    if (rowHeights && rowHeights.length >= currentEndIndex) {
      // Use exact measured row heights for perfect precision
      for (let i = currentStartIndex; i < currentEndIndex; i++) {
        const rowH = rowHeights[i];
        if (headerHeight + accumulatedHeight + rowH <= actualRemaining) {
          accumulatedHeight += rowH;
          availableRows++;
        } else {
          break; // Next row would overflow
        }
      }
    } else {
      // Fallback to static math if measurements are somehow missing
      const rowHeight = 38;
      availableRows = Math.floor((actualRemaining - headerHeight) / rowHeight);
      accumulatedHeight = availableRows * rowHeight;
    }

    if (availableRows <= 0) return null; // Can't even fit one row

    const newSplitIndex = currentStartIndex + availableRows;

    const chunk1: TableNode = {
      ...node,
      id: `${node.id}-part1`,
      props: {
        ...node.props,
        splitIndex: currentStartIndex,
        endIndex: newSplitIndex > currentEndIndex ? currentEndIndex : newSplitIndex,
      }
    };

    const chunk1Height = headerHeight + accumulatedHeight + marginTop + marginBottom;

    // If we've processed all rows, there is no chunk2
    if (newSplitIndex >= currentEndIndex) {
      return [chunk1, null, chunk1Height];
    }

    const chunk2: TableNode = {
      ...node,
      id: `${node.id}-part2`,
      props: {
        ...node.props,
        splitIndex: newSplitIndex,
        endIndex: currentEndIndex,
        hideHeaderOnSplit: node.props?.tableSplitBehaviour === "withoutHeader"
      }
    };

    return [chunk1, chunk2, chunk1Height];
  }
});
