import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as layoutService from "../services/layout.service.js";

export function registerLayoutTools(server: McpServer) {
  server.registerTool(
    "get_layout_element",
    {
      description:
        "Fetches a single node (and its children) from the active schema by its nodeId.",
      inputSchema: {
        nodeId: z.string().describe("The ID of the node to fetch."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ nodeId }) => layoutService.getLayoutElement(nodeId)
  );

  server.registerTool(
    "patch_element_properties",
    {
      description:
        "Deep-merges properties (style, layout, props, bind) into the target node. Example props: { style: { backgroundColor: '#fff', fontSizePx: 14 }, layout: { paddingTop: 10 } }",
      inputSchema: {
        nodeId: z.string().describe("The ID of the target node."),
        patch: z
          .record(z.string(), z.any())
          .describe(
            "Nested object containing style, layout, props, or bind overrides."
          ),
      },
      annotations: { idempotentHint: true },
    },
    async ({ nodeId, patch }) =>
      layoutService.patchElementProperties(nodeId, patch)
  );

  server.registerTool(
    "get_available_widgets",
    {
      description:
        "Get the list of valid node types/widgets and their detailed property structures. Call this tool to understand how to correctly construct `props` (like `literal`, `contentLiteral`, `columns`, etc) for different widgets before building AST nodes.",
      annotations: { readOnlyHint: true },
    },
    async () => layoutService.getAvailableWidgets()
  );

  server.registerTool(
    "add_text_widget",
    {
      description:
        "Safely creates and inserts a text widget. Automatically handles the tricky `literal` property mapping.",
      inputSchema: {
        parentId: z.string().describe("Parent node ID to insert into."),
        literal: z.string().describe("The raw text string to display."),
        style: z
          .record(z.string(), z.any())
          .optional()
          .describe(
            "Optional typography styles (e.g. fontSizePx, color, fontWeight)."
          ),
        layout: z
          .record(z.string(), z.any())
          .optional()
          .describe("Optional layout properties."),
      },
    },
    async ({ parentId, literal, style, layout }) =>
      layoutService.addTextWidget(parentId, literal, style, layout)
  );

  server.registerTool(
    "add_table_widget",
    {
      description:
        "Safely creates and inserts a table widget mapping to an array of objects.",
      inputSchema: {
        parentId: z.string().describe("Parent node ID to insert into."),
        dataPath: z
          .string()
          .describe(
            "The path in the document data object mapping to the array (e.g. 'items')."
          ),
        columns: z
          .array(z.record(z.string(), z.any()))
          .describe(
            "Array of column objects: { headerText: string, bindPath: string, flex?: number, align?: 'left'|'center'|'right' }"
          ),
        layout: z
          .record(z.string(), z.any())
          .optional()
          .describe("Optional layout properties."),
        styleConfig: z
          .record(z.string(), z.any())
          .optional()
          .describe(
            "Optional TableStyleConfig properties (e.g. gridLines, colors)."
          ),
        footerRows: z
          .array(z.any())
          .optional()
          .describe("Optional array of TableFooterRow objects."),
        tableSplitBehaviour: z
          .enum(["withHeader", "withoutHeader"])
          .optional()
          .describe("How the table should behave when split across pages."),
      },
    },
    async ({
      parentId,
      dataPath,
      columns,
      layout,
      styleConfig,
      footerRows,
      tableSplitBehaviour,
    }) =>
      layoutService.addTableWidget(
        parentId,
        dataPath,
        columns,
        layout,
        styleConfig,
        footerRows,
        tableSplitBehaviour
      )
  );

  server.registerTool(
    "set_table_footer_rows",
    {
      description:
        "Overwrites the footerRows array for a specific table node. Use this to create or update the table footer structure (rows, colSpans, alignments) before adding widgets to the cells.",
      inputSchema: {
        tableId: z.string().describe("The ID of the table node."),
        footerRows: z
          .array(z.any())
          .describe(
            "Array of TableFooterRow objects. Example: [{ id: 'row1', cells: [{ colSpan: 2, content: [] }] }]"
          ),
      },
    },
    async ({ tableId, footerRows }) =>
      layoutService.setTableFooterRows(tableId, footerRows)
  );

  server.registerTool(
    "add_node_to_table_footer_cell",
    {
      description:
        "Insert a new element or widget into a specific cell of a table's footer row, since cells do not have their own node IDs.",
      inputSchema: {
        tableId: z.string().describe("The ID of the table node."),
        rowIndex: z
          .number()
          .describe("The index of the footer row (0-indexed)."),
        cellIndex: z
          .number()
          .describe("The index of the cell in that row (0-indexed)."),
        widgetType: z
          .enum([
            "row",
            "column",
            "text",
            "image",
            "table",
            "spacer",
            "listTile",
            "richText",
            "ul",
            "ol",
            "checkbox",
            "radio",
            "radioGroup",
            "widgetInstance",
          ])
          .describe("The type of widget to create."),
        props: z
          .record(z.string(), z.any())
          .optional()
          .describe(
            "Optional overrides for widget config, style, layout, or props."
          ),
      },
    },
    async ({ tableId, rowIndex, cellIndex, widgetType, props }) =>
      layoutService.addNodeToTableFooterCell(
        tableId,
        rowIndex,
        cellIndex,
        widgetType,
        props
      )
  );

  server.registerTool(
    "insert_layout_element",
    {
      description:
        "Insert a new element or widget into a parent layout node. Validated against AJV.",
      inputSchema: {
        parentId: z.string().describe("The ID of the parent layout node."),
        widgetType: z
          .enum([
            "row",
            "column",
            "text",
            "image",
            "table",
            "spacer",
            "listTile",
            "richText",
            "ul",
            "ol",
            "checkbox",
            "radio",
            "radioGroup",
            "widgetInstance",
          ])
          .describe("The type of widget to create."),
        index: z
          .number()
          .optional()
          .describe("The child position index to insert at (optional)."),
        props: z
          .record(z.string(), z.any())
          .optional()
          .describe(
            "Optional overrides for widget config, style, layout, or props."
          ),
      },
    },
    async ({ parentId, widgetType, index, props }) =>
      layoutService.insertLayoutElement(parentId, widgetType, index, props)
  );

  server.registerTool(
    "delete_layout_element",
    {
      description:
        "Delete an element/widget node from the document layout AST by its ID.",
      inputSchema: {
        nodeId: z.string().describe("The ID of the node to delete."),
      },
      annotations: { idempotentHint: true, destructiveHint: true },
    },
    async ({ nodeId }) => layoutService.deleteLayoutElement(nodeId)
  );

  server.registerTool(
    "update_element_properties",
    {
      description:
        "Update a single layout, style, props, or binding property on an element node.",
      inputSchema: {
        nodeId: z.string().describe("ID of the target node."),
        propertyGroup: z
          .enum(["layout", "style", "props", "bind"])
          .describe("The property block to update."),
        key: z
          .string()
          .describe("Property key (e.g. 'paddingTop', 'color', 'content')."),
        value: z.any().describe("The new property value."),
      },
      annotations: { idempotentHint: true },
    },
    async ({ nodeId, propertyGroup, key, value }) =>
      layoutService.updateElementProperties(nodeId, propertyGroup, key, value)
  );

  server.registerTool(
    "set_page_override",
    {
      description:
        "Sets or removes a specific page's header/footer mapping in document.pageOverrides.",
      inputSchema: {
        pageNumber: z.number().describe("The page number to override."),
        headerId: z
          .string()
          .nullable()
          .optional()
          .describe("Header section key to use, or null to hide."),
        footerId: z
          .string()
          .nullable()
          .optional()
          .describe("Footer section key to use, or null to hide."),
      },
      annotations: { idempotentHint: true },
    },
    async ({ pageNumber, headerId, footerId }) =>
      layoutService.setPageOverride(pageNumber, headerId, footerId)
  );
}
