import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendCommandToActiveSession } from "../services/ws.js";
import { patchNodeProperties, validateAndSend } from "../services/ast.js";
import {
  findNodeGlobal,
  insertNodeIntoAst,
  deleteNodeFromAst,
} from "@formcast/core";
// to-replace
import { DEFAULT_WIDGET_CONFIGS, WIDGET_DOCUMENTATION } from "../constants.js";
import { WsEventType } from "@formcast/core/ws";
// to-replace

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
    async ({ nodeId }) => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const result = findNodeGlobal(state.schema, nodeId);
      if (!result)
        throw new Error(`Node ${nodeId} not found in active schema.`);
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result.node, null, 2) },
        ],
      };
    }
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
    async ({ nodeId, patch }) => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = patchNodeProperties(state.schema, nodeId, patch);
      return validateAndSend(
        newSchema,
        `Successfully patched properties on node ${nodeId}`
      );
    }
  );

  server.registerTool(
    "get_available_widgets",
    {
      description:
        "Get the list of valid node types/widgets and their detailed property structures. Call this tool to understand how to correctly construct `props` (like `literal`, `contentLiteral`, `columns`, etc) for different widgets before building AST nodes.",
      annotations: { readOnlyHint: true },
    },
    async () => {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(WIDGET_DOCUMENTATION, null, 2),
          },
        ],
      };
    }
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
    async ({ parentId, literal, style = {}, layout = {} }) => {
      const generatedId = `text-${Math.random().toString(36).substring(2, 9)}`;
      const newNode = {
        type: "text",
        id: generatedId,
        layout,
        style,
        props: { literal },
      };
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = insertNodeIntoAst(state.schema, parentId, newNode);
      return validateAndSend(
        newSchema,
        `Successfully inserted text widget (ID: ${generatedId}) under parent ${parentId}`
      );
    }
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
      },
    },
    async ({ parentId, dataPath, columns, layout = {} }) => {
      const generatedId = `table-${Math.random().toString(36).substring(2, 9)}`;
      const newNode: any = {
        type: "table",
        id: generatedId,
        layout,
        bind: { path: dataPath, mode: "repeat" },
        props: { columns },
      };
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = insertNodeIntoAst(state.schema, parentId, newNode);
      return validateAndSend(
        newSchema,
        `Successfully inserted table widget (ID: ${generatedId}) under parent ${parentId}`
      );
    }
  );

  server.registerTool(
    "insert_layout_element",
    {
      description:
        "Insert a new element or widget into a parent layout node. Validated against AJV.",
      inputSchema: {
        parentId: z.string().describe("The ID of the parent layout node."),
        widgetType: z
          .enum(["row", "column", "text", "image", "table", "input"])
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
    async ({ parentId, widgetType, index, props = {} }) => {
      const baseMock =
        DEFAULT_WIDGET_CONFIGS[
          widgetType as keyof typeof DEFAULT_WIDGET_CONFIGS
        ];
      if (!baseMock) throw new Error(`Unsupported widget type: ${widgetType}`);

      const generatedId = `${widgetType}-${Math.random().toString(36).substring(2, 9)}`;
      const newNode = {
        ...structuredClone(baseMock),
        id: generatedId,
        ...props,
      } as any;

      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = insertNodeIntoAst(
        state.schema,
        parentId,
        newNode,
        index
      );

      return validateAndSend(
        newSchema,
        `Successfully inserted widget ${widgetType} (ID: ${generatedId}) under parent ${parentId}`
      );
    }
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
    async ({ nodeId }) => {
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = deleteNodeFromAst(state.schema, nodeId);
      return validateAndSend(newSchema, `Successfully deleted node ${nodeId}`);
    }
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
    async ({ nodeId, propertyGroup, key, value }) => {
      const patch = { [propertyGroup]: { [key]: value } };
      const state = await sendCommandToActiveSession({
        type: WsEventType.GET_CURRENT_SCHEMA,
      });
      const newSchema = patchNodeProperties(state.schema, nodeId, patch);

      return validateAndSend(
        newSchema,
        `Successfully updated node ${nodeId} property ${propertyGroup}.${key}`
      );
    }
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
    async ({ pageNumber, headerId, footerId }) => {
      const state = await sendCommandToActiveSession({
        type: "GET_CURRENT_SCHEMA",
      });
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
  );
}
