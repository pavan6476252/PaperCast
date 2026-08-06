import React, { useMemo } from "react";
import {
  TableColumnConfig,
  TableNode,
  TableProps,
  TableStyleConfig,
  TableHeaderCell,
  TableBodyCell,
  TableFooterCell,
  AnyNode,
} from "@papercast/core";
import { ComponentTypeDefinition } from "../registry";
import { resolvePath, TableBehavior } from "@papercast/engine";
import { useNodeData } from "../headless/useNodeData";
import { useNodeStyle } from "../headless/useNodeStyle";
import { NodeRenderer } from "../NodeRenderer";

interface BaseProps {
  injectedProps?: React.HTMLAttributes<HTMLDivElement> & {
    "data-selected"?: boolean;
  };
  pageContext?: { pageNumber: number; pageCount: number };
}

// Helper to DRY up border styles
const getBorderStyles = (
  cell: TableHeaderCell | TableBodyCell | TableFooterCell,
  borderStr: string
): React.CSSProperties => ({
  ...(cell.borderRight ? { borderRight: borderStr } : {}),
  ...(cell.borderLeft ? { borderLeft: borderStr } : {}),
  ...(cell.borderTop ? { borderTop: borderStr } : {}),
  ...(cell.borderBottom ? { borderBottom: borderStr } : {}),
});

const TableColGroup: React.FC<{
  visibleColumns: TableColumnConfig[];
  totalFlex: number;
}> = ({ visibleColumns, totalFlex }) => (
  <colgroup>
    {visibleColumns.map((col, idx) => {
      let width: string | undefined = undefined;
      if (col.widthPx) {
        width = `${col.widthPx}px`;
      } else if (col.flex && totalFlex > 0) {
        width = `${(col.flex / totalFlex) * 100}%`;
      }
      return <col key={idx} style={{ width }} />;
    })}
  </colgroup>
);

const TableHeader: React.FC<{
  props: TableProps;
  visibleColumns: TableColumnConfig[];
  startIndex: number;
  thStyle: React.CSSProperties;
  borderStr: string;
}> = ({ props, visibleColumns, startIndex, thStyle, borderStr }) => {
  if (props.hideHeaderOnSplit && startIndex > 0) return null;

  return (
    <thead>
      {props.headerRows && props.headerRows.length > 0 ? (
        props.headerRows.map((row, rowIdx) => (
          <tr key={row.id || rowIdx}>
            {row.cells.map((cell, cellIdx) => (
              <th
                key={cellIdx}
                colSpan={cell.colSpan || 1}
                rowSpan={cell.rowSpan || 1}
                style={{ ...thStyle, ...getBorderStyles(cell, borderStr) }}
              >
                {cell.content?.map((childNode) => (
                  <NodeRenderer key={childNode.id} node={childNode} />
                ))}
              </th>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          {visibleColumns.map((col, idx) => (
            <th
              key={idx}
              style={{ ...thStyle, textAlign: col.align || "left" }}
            >
              {col.headerText || col.bindPath}
            </th>
          ))}
        </tr>
      )}
    </thead>
  );
};

const TableBody: React.FC<{
  props: TableProps;
  visibleColumns: TableColumnConfig[];
  displayRows: Record<string, unknown>[];
  errorMsg: string | null;
  tdStyle: React.CSSProperties;
  borderStr: string;
  styleConfig: TableStyleConfig;
}> = ({
  props,
  visibleColumns,
  displayRows,
  errorMsg,
  tdStyle,
  borderStr,
  styleConfig,
}) => {
  if (props.bodyRows && props.bodyRows.length > 0) {
    const bStartIndex = props.splitIndex || 0;
    const bEndIndex =
      props.endIndex !== undefined ? props.endIndex : props.bodyRows.length;
    const displayBodyRows = props.bodyRows.slice(bStartIndex, bEndIndex);

    if (displayBodyRows.length === 0) return <tbody></tbody>;

    return (
      <tbody>
        {displayBodyRows.map((row, rowIdx) => {
          const isAlt = rowIdx % 2 === 1;
          const rowBg = isAlt
            ? styleConfig.alternateRowBackgroundColor
            : styleConfig.rowBackgroundColor;
          return (
            <tr
              key={row.id || rowIdx}
              style={{ backgroundColor: rowBg || "transparent" }}
            >
              {row.cells.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  colSpan={cell.colSpan || 1}
                  rowSpan={cell.rowSpan || 1}
                  style={{ ...tdStyle, ...getBorderStyles(cell, borderStr) }}
                >
                  {cell.content?.map((childNode) => (
                    <NodeRenderer key={childNode.id} node={childNode} />
                  ))}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    );
  }

  return (
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
              {visibleColumns.map((col, colIdx) => {
                let cellVal = "";
                if (col.bindPath) {
                  const val = resolvePath(row, col.bindPath);
                  if (val === undefined) {
                    cellVal = `[Missing: ${col.bindPath}]`;
                  } else {
                    cellVal = String(val);
                  }
                }

                let rowSpan = 1;
                let shouldRender = true;

                if (col.mergeBy && col.mergeBy.length > 0) {
                  // Check if we are absorbed by the previous row
                  if (rowIdx > 0) {
                    const prevRow = displayRows[rowIdx - 1];
                    let allMatched = true;
                    for (const path of col.mergeBy) {
                      if (
                        resolvePath(row, path) !== resolvePath(prevRow, path)
                      ) {
                        allMatched = false;
                        break;
                      }
                    }
                    if (allMatched) shouldRender = false;
                  }

                  // If we are rendering, calculate forward span
                  if (shouldRender) {
                    let span = 1;
                    while (rowIdx + span < displayRows.length) {
                      const nextRow = displayRows[rowIdx + span];
                      let allMatched = true;
                      for (const path of col.mergeBy) {
                        if (
                          resolvePath(nextRow, path) !== resolvePath(row, path)
                        ) {
                          allMatched = false;
                          break;
                        }
                      }
                      if (allMatched) span++;
                      else break;
                    }
                    rowSpan = span;
                  }
                }

                if (!shouldRender) return null;

                return (
                  <td
                    key={colIdx}
                    rowSpan={rowSpan > 1 ? rowSpan : undefined}
                    style={{ ...tdStyle, textAlign: col.align || "left" }}
                  >
                    {cellVal}
                  </td>
                );
              })}
            </tr>
          );
        })
      )}
    </tbody>
  );
};

const TableFooter: React.FC<{
  props: TableProps;
  footerTdStyle: React.CSSProperties;
  borderStr: string;
  styleConfig: TableStyleConfig;
}> = ({ props, footerTdStyle, borderStr, styleConfig }) => {
  if (!props.footerRows || props.footerRows.length === 0) return null;

  const fStartIndex = props.footerSplitIndex || 0;
  const fEndIndex =
    props.footerEndIndex !== undefined
      ? props.footerEndIndex
      : props.footerRows.length;
  const displayFooterRows = props.footerRows.slice(fStartIndex, fEndIndex);

  if (displayFooterRows.length === 0) return null;

  return (
    <tfoot>
      {displayFooterRows.map((row, rowIdx) => (
        <tr
          key={row.id || rowIdx}
          style={{
            backgroundColor: styleConfig.footerBackgroundColor || "#fafafa",
          }}
        >
          {row.cells.map((cell, cellIdx) => (
            <td
              key={cellIdx}
              colSpan={cell.colSpan || 1}
              rowSpan={cell.rowSpan || 1}
              style={{ ...footerTdStyle, ...getBorderStyles(cell, borderStr) }}
            >
              {cell.content?.map((childNode: AnyNode) => (
                <NodeRenderer key={childNode.id} node={childNode} />
              ))}
            </td>
          ))}
        </tr>
      ))}
    </tfoot>
  );
};

export const TableComponent: React.FC<{ node: TableNode } & BaseProps> = ({
  node,
  injectedProps,
}) => {
  const { data } = useNodeData();
  const style = useNodeStyle(node, injectedProps);
  const props = node.props || {};

  const { visibleColumns, totalFlex } = useMemo(() => {
    const cols = props.columns || [];
    const visible = cols.filter((col) => !col.hidden);
    const flex = visible.reduce((sum, col) => sum + (col.flex || 0), 0);
    return { visibleColumns: visible, totalFlex: flex };
  }, [props.columns]);

  const { displayRows, errorMsg, startIndex } = useMemo(() => {
    let rowData: Record<string, unknown>[] = [];
    let err: string | null = null;
    if (node.bind?.path) {
      const val = resolvePath(data as Record<string, unknown>, node.bind.path);
      if (val === undefined) {
        err = `[Missing Data: Path '${node.bind.path}' not found]`;
      } else if (!Array.isArray(val)) {
        err = `[Invalid Data: Path '${node.bind.path}' is not an array]`;
      } else {
        rowData = val;
      }
    } else if (props.data) {
      rowData = props.data;
    }

    const start = props.splitIndex || 0;
    const end = props.endIndex !== undefined ? props.endIndex : rowData.length;
    return {
      displayRows: rowData.slice(start, end),
      errorMsg: err,
      startIndex: start,
    };
  }, [node.bind?.path, props.data, props.splitIndex, props.endIndex, data]);

  const { styleConfig, borderStr, thStyle, tdStyle, footerTdStyle } =
    useMemo(() => {
      const config = props.styleConfig || {};
      const cellPadding =
        config.cellPaddingPx !== undefined
          ? `${config.cellPaddingPx}px`
          : "8px";
      const borderColor = config.borderColor || "#ccc";
      const borderWidth =
        config.borderWidthPx !== undefined
          ? `${config.borderWidthPx}px`
          : "1px";
      const border = `${borderWidth} solid ${borderColor}`;
      const gridLines = config.gridLines || "horizontal";

      return {
        styleConfig: config,
        borderStr: border,
        thStyle: {
          padding: cellPadding,
          border: gridLines === "all" ? border : undefined,
          borderBottom: gridLines === "horizontal" ? border : undefined,
          backgroundColor: config.headerBackgroundColor || "#f5f5f5",
          color: config.headerTextColor || "inherit",
          fontSize: config.headerFontSizePx
            ? `${config.headerFontSizePx}px`
            : "0.9em",
          fontWeight: config.headerFontWeight || "bold",
        },
        tdStyle: {
          padding: cellPadding,
          border: gridLines === "all" ? border : undefined,
          borderBottom: gridLines === "horizontal" ? border : undefined,
          color: config.rowTextColor || "inherit",
          fontSize: config.rowFontSizePx
            ? `${config.rowFontSizePx}px`
            : "0.9em",
          wordWrap: "break-word" as const,
        },
        footerTdStyle: {
          padding: cellPadding,
          border: gridLines === "all" ? border : undefined,
          borderTop: gridLines === "horizontal" ? border : undefined,
          color: config.footerTextColor || "inherit",
          fontSize: config.footerFontSizePx
            ? `${config.footerFontSizePx}px`
            : "inherit",
          fontWeight: config.footerFontWeight || "inherit",
        },
      };
    }, [props.styleConfig]);

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
        <TableColGroup visibleColumns={visibleColumns} totalFlex={totalFlex} />
        <TableHeader
          props={props}
          visibleColumns={visibleColumns}
          startIndex={startIndex}
          thStyle={thStyle}
          borderStr={borderStr}
        />
        <TableBody
          props={props}
          visibleColumns={visibleColumns}
          displayRows={displayRows}
          errorMsg={errorMsg}
          tdStyle={tdStyle}
          borderStr={borderStr}
          styleConfig={styleConfig}
        />
        <TableFooter
          props={props}
          footerTdStyle={footerTdStyle}
          borderStr={borderStr}
          styleConfig={styleConfig}
        />
      </table>
    </div>
  );
};

export const TableNodeDef: ComponentTypeDefinition<TableNode> = {
  type: "table",
  measure: TableBehavior.measure,
  split: TableBehavior.split,
  render: TableComponent,
};
