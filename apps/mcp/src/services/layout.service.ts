import {
  AnyNode,
  BoxModel,
  deleteNodeFromAst,
  findNodeGlobal,
  insertNodeIntoAst,
  TableColumnConfig,
  TableFooterRow,
  TableNode,
  TableStyleConfig,
  TextNode,
  TypographyAndColor,
} from "@papercast/core";
import { DEFAULT_WIDGET_CONFIGS, WIDGET_DOCUMENTATION } from "../constants.js";
import { patchNodeProperties, validateAndSend } from "./ast.js";
import { getCurrentSchemaFromSession } from "./ws.js";

export async function getLayoutElement(nodeId: string) {
  const state = await getCurrentSchemaFromSession();
  const result = findNodeGlobal(state.schema, nodeId);
  if (!result) throw new Error(`Node ${nodeId} not found in active schema.`);
  return {
    content: [{ type: "text", text: JSON.stringify(result.node, null, 2) }],
  };
}

export async function patchElementProperties(
  nodeId: string,
  patch: Partial<AnyNode>
) {
  const state = await getCurrentSchemaFromSession();
  const newSchema = patchNodeProperties(state.schema, nodeId, patch);
  return validateAndSend(
    newSchema,
    `Successfully patched properties on node ${nodeId}`
  );
}

export async function getAvailableWidgets() {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(WIDGET_DOCUMENTATION, null, 2),
      },
    ],
  };
}

export async function addTextWidget(
  parentId: string,
  literal: string,
  style: TypographyAndColor = {},
  layout: BoxModel = {}
) {
  const generatedId = `text-${Math.random().toString(36).substring(2, 9)}`;
  const newNode: TextNode = {
    type: "text",
    id: generatedId,
    layout,
    style,
    props: { literal },
  };
  const state = await getCurrentSchemaFromSession();
  const newSchema = insertNodeIntoAst(state.schema, parentId, newNode);
  return validateAndSend(
    newSchema,
    `Successfully inserted text widget (ID: ${generatedId}) under parent ${parentId}`
  );
}

export async function addTableWidget(
  parentId: string,
  dataPath: string,
  columns: TableColumnConfig[],
  layout: BoxModel = {},
  styleConfig?: TableStyleConfig,
  footerRows?: TableFooterRow[],
  tableSplitBehaviour?: "withHeader" | "withoutHeader"
) {
  const generatedId = `table-${Math.random().toString(36).substring(2, 9)}`;
  const newNode: TableNode = {
    type: "table",
    id: generatedId,
    layout,
    bind: { path: dataPath, mode: "repeat" },
    props: {
      columns,
      ...(styleConfig && { styleConfig }),
      ...(footerRows && { footerRows }),
      ...(tableSplitBehaviour && { tableSplitBehaviour }),
    },
  };
  const state = await getCurrentSchemaFromSession();
  const newSchema = insertNodeIntoAst(state.schema, parentId, newNode);
  return validateAndSend(
    newSchema,
    `Successfully inserted table widget (ID: ${generatedId}) under parent ${parentId}`
  );
}

export async function setTableFooterRows(
  tableId: string,
  footerRows: TableFooterRow[]
) {
  const state = await getCurrentSchemaFromSession();
  const newSchema = patchNodeProperties(state.schema, tableId, {
    props: { footerRows },
  });
  return validateAndSend(
    newSchema,
    `Successfully updated footerRows for table ${tableId}`
  );
}

export async function addNodeToTableFooterCell(
  tableId: string,
  rowIndex: number,
  cellIndex: number,
  widgetType: string,
  props: Partial<AnyNode> = {}
) {
  const baseMock =
    DEFAULT_WIDGET_CONFIGS[widgetType as keyof typeof DEFAULT_WIDGET_CONFIGS];
  if (!baseMock) throw new Error(`Unsupported widget type: ${widgetType}`);

  const generatedId = `${widgetType}-${Math.random().toString(36).substring(2, 9)}`;
  const newNode = {
    ...(structuredClone(baseMock) as AnyNode),
    id: generatedId,
    ...props,
  } as AnyNode;

  const state = await getCurrentSchemaFromSession();

  const newSchema = structuredClone(state.schema);
  const result = findNodeGlobal(newSchema, tableId);
  if (!result) throw new Error(`Table node ${tableId} not found.`);

  const tableNode: any = result.node;
  if (tableNode.type !== "table")
    throw new Error(`Node ${tableId} is not a table.`);

  if (!tableNode.props) tableNode.props = {};
  if (!tableNode.props.footerRows) tableNode.props.footerRows = [];

  const row = tableNode.props.footerRows[rowIndex];
  if (!row) throw new Error(`Footer row at index ${rowIndex} not found.`);

  const cell = row.cells[cellIndex];
  if (!cell)
    throw new Error(`Cell at index ${cellIndex} not found in footer row.`);

  if (!cell.content) cell.content = [];
  cell.content.push(newNode);

  return validateAndSend(
    newSchema,
    `Successfully inserted ${widgetType} (ID: ${generatedId}) into table ${tableId} footer cell.`
  );
}

export async function insertLayoutElement(
  parentId: string,
  widgetType: string,
  index?: number,
  props: Partial<AnyNode> = {}
) {
  const baseMock =
    DEFAULT_WIDGET_CONFIGS[widgetType as keyof typeof DEFAULT_WIDGET_CONFIGS];
  if (!baseMock) throw new Error(`Unsupported widget type: ${widgetType}`);

  const generatedId = `${widgetType}-${Math.random().toString(36).substring(2, 9)}`;
  const newNode = {
    ...(structuredClone(baseMock) as AnyNode),
    id: generatedId,
    ...props,
  } as AnyNode;

  const state = await getCurrentSchemaFromSession();
  const newSchema = insertNodeIntoAst(state.schema, parentId, newNode, index);

  return validateAndSend(
    newSchema,
    `Successfully inserted widget ${widgetType} (ID: ${generatedId}) under parent ${parentId}`
  );
}

export async function deleteLayoutElement(nodeId: string) {
  const state = await getCurrentSchemaFromSession();
  const newSchema = deleteNodeFromAst(state.schema, nodeId);
  return validateAndSend(newSchema, `Successfully deleted node ${nodeId}`);
}

export async function updateElementProperties(
  nodeId: string,
  propertyGroup: keyof AnyNode,
  key: string,
  value: any
) {
  const patch = { [propertyGroup]: { [key]: value } };
  const state = await getCurrentSchemaFromSession();
  const newSchema = patchNodeProperties(state.schema, nodeId, patch);

  return validateAndSend(
    newSchema,
    `Successfully updated node ${nodeId} property ${propertyGroup}.${key}`
  );
}

export async function setPageOverride(
  pageNumber: number,
  headerId?: string | null,
  footerId?: string | null
) {
  const state = await getCurrentSchemaFromSession();
  const newSchema = structuredClone(state.schema);
  newSchema.document.pageOverrides = newSchema.document.pageOverrides || {};
  const pageKey = pageNumber.toString();
  newSchema.document.pageOverrides[pageKey] =
    newSchema.document.pageOverrides[pageKey] || {};
  if (headerId !== undefined)
    newSchema.document.pageOverrides[pageKey].headerId = headerId;
  if (footerId !== undefined)
    newSchema.document.pageOverrides[pageKey].footerId = footerId;
  return validateAndSend(
    newSchema,
    `Successfully updated page overrides for page ${pageNumber}.`
  );
}
