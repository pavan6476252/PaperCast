import React from "react";
import { TableColumnConfig, TableNode } from "@formcast/core";
import { ComponentTypeDefinition } from "../registry";
import { resolvePath, TableBehavior } from "@formcast/engine";
import { useNodeData } from "../headless/useNodeData";
import { useNodeStyle } from "../headless/useNodeStyle";
import { NodeRenderer } from "../NodeRenderer";

interface BaseProps {
  injectedProps?: React.HTMLAttributes<HTMLDivElement> & {
    "data-selected"?: boolean;
  };
  pageContext?: { pageNumber: number; pageCount: number };
}

export const TableComponent: React.FC<{ node: TableNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const { data } = useNodeData();
  const style = useNodeStyle(node, injectedProps);

  const props = node.props || {};
  const columns = props.columns || [];

  let rowData: any[] = [];
  let errorMsg: string | null = null;
  if (node.bind?.path) {
    const val = resolvePath(data as Record<string, unknown>, node.bind.path);
    if (val === undefined) {
      errorMsg = `[Missing Data: Path '${node.bind.path}' not found]`;
    } else if (!Array.isArray(val)) {
      errorMsg = `[Invalid Data: Path '${node.bind.path}' is not an array]`;
    } else {
      rowData = val;
    }
  } else if (props.data) {
    rowData = props.data;
  }

  const visibleColumns = columns.filter(
    (col: TableColumnConfig) => !col.hidden
  );
  const totalFlex = visibleColumns.reduce(
    (sum, col) => sum + (col.flex || 0),
    0
  );

  const startIndex = props.splitIndex || 0;
  const endIndex =
    props.endIndex !== undefined ? props.endIndex : rowData.length;
  const displayRows = rowData.slice(startIndex, endIndex);

  const styleConfig = props.styleConfig || {};
  const cellPadding =
    styleConfig.cellPaddingPx !== undefined
      ? `${styleConfig.cellPaddingPx}px`
      : "8px";
  const borderColor = styleConfig.borderColor || "#ccc";
  const borderWidth =
    styleConfig.borderWidthPx !== undefined
      ? `${styleConfig.borderWidthPx}px`
      : "1px";
  const borderStr = `${borderWidth} solid ${borderColor}`;
  const gridLines = styleConfig.gridLines || "horizontal";

  const thStyle: React.CSSProperties = {
    padding: cellPadding,
    border: gridLines === "all" ? borderStr : undefined,
    borderBottom: gridLines === "horizontal" ? borderStr : undefined,
    backgroundColor: styleConfig.headerBackgroundColor || "#f5f5f5",
    color: styleConfig.headerTextColor || "inherit",
    fontSize: styleConfig.headerFontSizePx
      ? `${styleConfig.headerFontSizePx}px`
      : "0.9em",
    fontWeight: styleConfig.headerFontWeight || "bold",
  };

  const tdStyle: React.CSSProperties = {
    padding: cellPadding,
    border: gridLines === "all" ? borderStr : undefined,
    borderBottom: gridLines === "horizontal" ? borderStr : undefined,
    color: styleConfig.rowTextColor || "inherit",
    fontSize: styleConfig.rowFontSizePx
      ? `${styleConfig.rowFontSizePx}px`
      : "0.9em",
    wordWrap: "break-word",
  };

  const footerTdStyle: React.CSSProperties = {
    padding: cellPadding,
    border: gridLines === "all" ? borderStr : undefined,
    borderTop: gridLines === "horizontal" ? borderStr : undefined,
    color: styleConfig.footerTextColor || "inherit",
    fontSize: styleConfig.footerFontSizePx
      ? `${styleConfig.footerFontSizePx}px`
      : "inherit",
    fontWeight: styleConfig.footerFontWeight || "inherit",
  };

  return (
    <div
      role="button"
      tabIndex={0}
      {...injectedProps}
      style={{
        ...style,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <table
        data-table-id={node.id}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          {visibleColumns.map((col: TableColumnConfig, idx: number) => {
            let width: string | undefined = undefined;
            if (col.widthPx) {
              width = `${col.widthPx}px`;
            } else if (col.flex && totalFlex > 0) {
              width = `${(col.flex / totalFlex) * 100}%`;
            }
            return <col key={idx} style={{ width }} />;
          })}
        </colgroup>

        {(!props.hideHeaderOnSplit || startIndex === 0) && (
          <thead>
            <tr>
              {visibleColumns.map((col: TableColumnConfig, idx: number) => (
                <th
                  key={idx}
                  style={{ ...thStyle, textAlign: col.align || "left" }}
                >
                  {col.headerText || col.bindPath}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {errorMsg ? (
            <tr>
              <td
                colSpan={visibleColumns.length || 1}
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#dc2626",
                  backgroundColor: "#fef2f2",
                  fontSize: "0.9em",
                  border: "1px dashed #f87171",
                }}
              >
                {errorMsg}
              </td>
            </tr>
          ) : displayRows.length === 0 ? (
            <tr>
              <td
                colSpan={visibleColumns.length || 1}
                style={{ padding: "16px", textAlign: "center", color: "#999" }}
              >
                No data
              </td>
            </tr>
          ) : (
            displayRows.map((row, rowIdx) => {
              const isAlt = rowIdx % 2 === 1;
              const rowBg = isAlt
                ? styleConfig.alternateRowBackgroundColor
                : styleConfig.rowBackgroundColor;
              return (
                <tr
                  key={rowIdx}
                  style={{ backgroundColor: rowBg || "transparent" }}
                >
                  {visibleColumns.map(
                    (col: TableColumnConfig, colIdx: number) => {
                      let cellVal = "";
                      if (col.bindPath) {
                        const val = resolvePath(row, col.bindPath);
                        if (val === undefined) {
                          cellVal = `[Missing: ${col.bindPath}]`;
                        } else {
                          cellVal = String(val);
                        }
                      }
                      return (
                        <td
                          key={colIdx}
                          style={{ ...tdStyle, textAlign: col.align || "left" }}
                        >
                          {cellVal}
                        </td>
                      );
                    }
                  )}
                </tr>
              );
            })
          )}
        </tbody>

        {props.footerRows &&
          props.footerRows.length > 0 &&
          (() => {
            const fStartIndex = props.footerSplitIndex || 0;
            const fEndIndex =
              props.footerEndIndex !== undefined
                ? props.footerEndIndex
                : props.footerRows.length;
            const displayFooterRows = props.footerRows.slice(
              fStartIndex,
              fEndIndex
            );

            if (displayFooterRows.length === 0) return null;

            return (
              <tfoot>
                {displayFooterRows.map((row: any, rowIdx: number) => (
                  <tr
                    key={row.id || rowIdx}
                    style={{
                      backgroundColor:
                        styleConfig.footerBackgroundColor || "#fafafa",
                    }}
                  >
                    {row.cells.map((cell: any, cellIdx: number) => (
                      <td
                        key={cellIdx}
                        colSpan={cell.colSpan || 1}
                        rowSpan={cell.rowSpan || 1}
                        style={{
                          ...footerTdStyle,
                          ...(cell.borderRight
                            ? { borderRight: borderStr }
                            : {}),
                          ...(cell.borderLeft ? { borderLeft: borderStr } : {}),
                          ...(cell.borderTop ? { borderTop: borderStr } : {}),
                          ...(cell.borderBottom
                            ? { borderBottom: borderStr }
                            : {}),
                        }}
                      >
                        {cell.content?.map((childNode: any) => (
                          <NodeRenderer key={childNode.id} node={childNode} />
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tfoot>
            );
          })()}
      </table>
    </div>
  );
};

export const TableNodeDef: ComponentTypeDefinition<any> = {
  type: "table",
  measure: TableBehavior.measure,
  split: TableBehavior.split,
  render: TableComponent,
};
