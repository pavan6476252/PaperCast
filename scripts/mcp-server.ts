import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { WebSocketServer, WebSocket } from "ws";
import * as fs from "fs";
import * as path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  insertNodeIntoAst,
  deleteNodeFromAst,
  findNodeGlobal,
} from "../src/store/astManipulators";

// -- Validation Setup --
const schemaPath = path.join(process.cwd(), "src/schema/docframe.schema.json");
const docframeSchema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateDocframe = ajv.compile(docframeSchema);

// Define FormCast Session Type
interface FormCastSession {
  ws: WebSocket;
  title: string;
  lastActive: number;
}

// Global active sessions map
const sessions = new Map<string, FormCastSession>();
let activeSessionId: string | null = null;

// Track pending requests from MCP tool to WebSocket client
const pendingRequests = new Map<
  string,
  {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
    timeoutId: NodeJS.Timeout;
  }
>();

// Initialize WebSocket Server on Port 9000
const wss = new WebSocketServer({ port: 9000 });

console.error("Starting FormCast Sync WebSocket Server on port 9000...");

wss.on("connection", (ws) => {
  let registeredSessionId: string | null = null;

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case "REGISTER_TAB": {
          const { sessionId, title } = message;
          registeredSessionId = sessionId;
          sessions.set(sessionId, {
            ws,
            title: title || "FormCast Playground",
            lastActive: Date.now(),
          });

          if (!activeSessionId) {
            activeSessionId = sessionId;
          }
          console.error(`Session registered: ${sessionId} (${title})`);
          break;
        }

        case "TAB_FOCUS": {
          const { sessionId } = message;
          if (sessions.has(sessionId)) {
            sessions.get(sessionId)!.lastActive = Date.now();
            activeSessionId = sessionId;
            console.error(`Active session switched to: ${sessionId}`);
          }
          break;
        }

        case "STATE_CHANGED": {
          const { sessionId, schema, requestId } = message;
          if (sessions.has(sessionId)) {
            const session = sessions.get(sessionId)!;
            session.lastActive = Date.now();

            if (requestId && pendingRequests.has(requestId)) {
              const pending = pendingRequests.get(requestId)!;
              clearTimeout(pending.timeoutId);
              pendingRequests.delete(requestId);
              pending.resolve({ schema, sessionId });
            }
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error("Error processing WebSocket message on server:", err);
    }
  });

  ws.on("close", () => {
    if (registeredSessionId) {
      sessions.delete(registeredSessionId);
      console.error(`Session disconnected: ${registeredSessionId}`);
      if (activeSessionId === registeredSessionId) {
        activeSessionId = null;
        let maxTime = 0;
        for (const [id, session] of Array.from(sessions.entries())) {
          if (session.lastActive > maxTime) {
            maxTime = session.lastActive;
            activeSessionId = id;
          }
        }
        console.error(`Active session fell back to: ${activeSessionId}`);
      }
    }
  });
});

function sendCommandToActiveSession(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const targetSessionId = activeSessionId;
    if (!targetSessionId || !sessions.has(targetSessionId)) {
      return reject(
        new Error(
          "No active browser session connected. Open the FormCast Playground in your browser."
        )
      );
    }

    const session = sessions.get(targetSessionId)!;
    const requestId = "req-" + Math.random().toString(36).substring(2, 9);

    const timeoutId = setTimeout(() => {
      pendingRequests.delete(requestId);
      reject(new Error("Request timed out. Browser did not respond."));
    }, 5000);

    pendingRequests.set(requestId, { resolve, reject, timeoutId });
    session.ws.send(JSON.stringify({ ...message, requestId }));
  });
}

function fireCommandToActiveSession(message: any) {
  const targetSessionId = activeSessionId;
  if (!targetSessionId || !sessions.has(targetSessionId)) {
    throw new Error(
      "No active browser session connected. Open the FormCast Playground in your browser."
    );
  }
  const session = sessions.get(targetSessionId)!;
  session.ws.send(JSON.stringify(message));
}

// Helper to validate and dispatch schema updates
function validateAndSend(schema: any, successMessage: string) {
  const isValid = validateDocframe(schema);
  if (!isValid) {
    const topErrors = validateDocframe.errors
      ?.slice(0, 10)
      .map((e: any) => `${e.instancePath}: ${e.message}`)
      .join("\n");
    throw new Error(`Schema validation failed. Top 10 errors:\n${topErrors}`);
  }
  fireCommandToActiveSession({ type: "UPDATE_SCHEMA", payload: schema });
  return {
    content: [{ type: "text", text: successMessage }],
  };
}

// Helpers for the new tools
function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function deepMerge(target: any, source: any) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}

function patchNodeProperties(schema: any, nodeId: string, patch: any) {
  const newSchema = JSON.parse(JSON.stringify(schema));
  const result = findNodeGlobal(newSchema, nodeId);
  if (!result) throw new Error(`Node ${nodeId} not found`);

  if (patch.style) result.node.style = { ...result.node.style, ...patch.style };
  if (patch.layout)
    result.node.layout = { ...result.node.layout, ...patch.layout };
  if (patch.props) result.node.props = { ...result.node.props, ...patch.props };
  if (patch.bind) result.node.bind = { ...result.node.bind, ...patch.bind };

  return newSchema;
}

const DEFAULT_WIDGET_CONFIGS = {
  row: {
    type: "row",
    id: "row-temp",
    layout: { direction: "row", columnGap: 12 },
    children: [],
  },
  column: {
    type: "column",
    id: "col-temp",
    layout: { direction: "column", rowGap: 12 },
    children: [],
  },
  text: {
    type: "text",
    id: "text-temp",
    layout: {},
    props: { literal: "Sample Text" },
  },
  image: {
    type: "image",
    id: "img-temp",
    layout: { width: 150, height: 150 },
    props: { srcLiteral: "" },
  },
  table: {
    type: "table",
    id: "table-temp",
    layout: {},
    props: { columns: [{ headerText: "Col 1", bindPath: "col1" }] },
  },
  input: {
    type: "input",
    id: "input-temp",
    layout: {},
    props: { label: "Input Label", placeholder: "Enter text..." },
  },
};

const WIDGET_DOCUMENTATION = {
  description:
    "FormCast schema nodes must always include 'id', 'type', and a 'layout' object. The 'props' structure depends on the widget type. Use *Literal fields for static data, and *Bind fields for data-binding.",
  widgets: {
    row: {
      type: "row",
      id: "row-id",
      layout: { direction: "row", columnGap: 12, width: "100%" },
      children: [],
    },
    column: {
      type: "column",
      id: "col-id",
      layout: { direction: "column", rowGap: 12 },
      children: [],
    },
    text: {
      type: "text",
      id: "text-id",
      layout: {},
      props: { literal: "Static text string", hrefLiteral: "Optional URL" },
      bind: { path: "data.path" },
    },
    richText: {
      type: "richText",
      id: "rich-text-id",
      layout: {},
      props: { htmlLiteral: "<p>HTML</p>" },
    },
    image: {
      type: "image",
      id: "image-id",
      layout: {},
      props: { srcLiteral: "https://...", fit: "contain|cover|stretch" },
    },
    listTile: {
      type: "listTile",
      id: "list-tile-id",
      layout: {},
      props: { titleLiteral: "Title", subtitleLiteral: "Subtitle" },
    },
    checkbox: {
      type: "checkbox",
      id: "check-id",
      layout: {},
      props: { labelLiteral: "Label", checkedLiteral: true },
    },
    table: {
      type: "table",
      id: "table-id",
      layout: {},
      bind: { path: "dataArrayKey", mode: "repeat" },
      props: {
        columns: [
          { headerText: "Col 1", bindPath: "field1", flex: 1, align: "left" },
        ],
      },
    },
  },
};

const server = new Server(
  { name: "formcast-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "formcast://schema/specification",
        name: "FormCast DocFrame Schema Specification",
        mimeType: "application/json",
        description:
          "The complete JSON Schema validating FormCast document templates.",
      },
      {
        uri: "formcast://schema/current",
        name: "Current Active Schema",
        mimeType: "application/json",
        description:
          "The layout schema currently loaded in the active browser tab.",
      },
      {
        uri: "formcast://template/invoice",
        name: "Invoice Template",
        mimeType: "application/json",
        description: "Starter invoice template schema.",
      },
      {
        uri: "formcast://template/report",
        name: "Report Template",
        mimeType: "application/json",
        description: "Starter report layout schema.",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === "formcast://schema/current") {
    try {
      const state = await sendCommandToActiveSession({
        type: "GET_CURRENT_SCHEMA",
      });
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(state.schema, null, 2),
          },
        ],
      };
    } catch (e: any) {
      throw new Error(`Failed to get active schema: ${e.message}`);
    }
  }

  const fileMap: Record<string, string> = {
    "formcast://schema/specification": "src/schema/docframe.schema.json",
    "formcast://template/invoice": "src/schema/invoice.template.json",
    "formcast://template/report": "src/schema/report.template.json",
  };

  if (fileMap[uri]) {
    const filePath = path.join(process.cwd(), fileMap[uri]);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Resource file not found: ${filePath}`);
    }
    const schemaContent = fs.readFileSync(filePath, "utf8");
    return {
      contents: [{ uri, mimeType: "application/json", text: schemaContent }],
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_active_sessions",
        description:
          "List all connected FormCast playground tabs and identify which session is active. Use this tool if you need to know how many sessions are active and to determine which one you are connected to.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "select_active_session",
        description: "Select which connected tab to control.",
        inputSchema: {
          type: "object",
          properties: {
            sessionId: {
              type: "string",
              description: "The ID of the target session.",
            },
          },
          required: ["sessionId"],
        },
      },
      {
        name: "get_document_state",
        description:
          "Get the complete active FormCast document schema JSON currently opened in the browser. IMPORTANT: If there are multiple active sessions, use get_active_sessions to check and select_active_session to explicitly target one.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "set_document_state",
        description:
          "Overwrite the entire document layout schema with a new JSON object. Example props: { schema: { document: { body: { ... } } } }",
        inputSchema: {
          type: "object",
          properties: {
            schema: {
              type: "object",
              description: "The complete valid FormCast JSON layout schema.",
            },
          },
          required: ["schema"],
        },
      },
      {
        name: "replace_document_body",
        description:
          "Clears all existing children in the document body and inserts a new array of nodes.",
        inputSchema: {
          type: "object",
          properties: {
            children: {
              type: "array",
              description:
                "Array of new BaseNode objects to insert into body.children",
            },
          },
          required: ["children"],
        },
      },
      {
        name: "get_layout_element",
        description:
          "Fetches a single node (and its children) from the active schema by its nodeId.",
        inputSchema: {
          type: "object",
          properties: {
            nodeId: {
              type: "string",
              description: "The ID of the node to fetch.",
            },
          },
          required: ["nodeId"],
        },
      },
      {
        name: "patch_element_properties",
        description:
          "Deep-merges properties (style, layout, props, bind) into the target node. Example props: { style: { backgroundColor: '#fff', fontSizePx: 14 }, layout: { paddingTop: 10 } }",
        inputSchema: {
          type: "object",
          properties: {
            nodeId: {
              type: "string",
              description: "The ID of the target node.",
            },
            patch: {
              type: "object",
              description:
                "Nested object containing style, layout, props, or bind overrides.",
            },
          },
          required: ["nodeId", "patch"],
        },
      },
      {
        name: "update_document_data",
        description:
          "Updates the `data` JSON object used for bindings. Merges provided object with existing data. Example: { revenue: 100 }",
        inputSchema: {
          type: "object",
          properties: {
            data: {
              type: "object",
              description: "JSON object to merge into schema.data",
            },
          },
          required: ["data"],
        },
      },
      {
        name: "get_available_widgets",
        description:
          "Get the list of valid node types/widgets and their detailed property structures. Call this tool to understand how to correctly construct `props` (like `literal`, `contentLiteral`, `columns`, etc) for different widgets before building AST nodes.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "add_text_widget",
        description:
          "Safely creates and inserts a text widget. Automatically handles the tricky `literal` property mapping.",
        inputSchema: {
          type: "object",
          properties: {
            parentId: {
              type: "string",
              description: "Parent node ID to insert into.",
            },
            literal: {
              type: "string",
              description: "The raw text string to display.",
            },
            style: {
              type: "object",
              description:
                "Optional typography styles (e.g. fontSizePx, color, fontWeight).",
            },
            layout: {
              type: "object",
              description: "Optional layout properties.",
            },
          },
          required: ["parentId", "literal"],
        },
      },
      {
        name: "add_table_widget",
        description:
          "Safely creates and inserts a table widget mapping to an array of objects.",
        inputSchema: {
          type: "object",
          properties: {
            parentId: {
              type: "string",
              description: "Parent node ID to insert into.",
            },
            dataPath: {
              type: "string",
              description:
                "The path in the document data object mapping to the array (e.g. 'items').",
            },
            columns: {
              type: "array",
              description:
                "Array of column objects: { headerText: string, bindPath: string, flex?: number, align?: 'left'|'center'|'right' }",
              items: { type: "object" },
            },
            layout: {
              type: "object",
              description: "Optional layout properties.",
            },
          },
          required: ["parentId", "dataPath", "columns"],
        },
      },
      {
        name: "insert_layout_element",
        description:
          "Insert a new element or widget into a parent layout node. Validated against AJV.",
        inputSchema: {
          type: "object",
          properties: {
            parentId: {
              type: "string",
              description: "The ID of the parent layout node.",
            },
            index: {
              type: "number",
              description: "The child position index to insert at (optional).",
            },
            widgetType: {
              type: "string",
              enum: ["row", "column", "text", "image", "table", "input"],
              description: "The type of widget to create.",
            },
            props: {
              type: "object",
              description:
                "Optional overrides for widget config, style, layout, or props.",
            },
          },
          required: ["parentId", "widgetType"],
        },
      },
      {
        name: "delete_layout_element",
        description:
          "Delete an element/widget node from the document layout AST by its ID.",
        inputSchema: {
          type: "object",
          properties: {
            nodeId: {
              type: "string",
              description: "The ID of the node to delete.",
            },
          },
          required: ["nodeId"],
        },
      },
      {
        name: "update_element_properties",
        description:
          "Update a single layout, style, props, or binding property on an element node.",
        inputSchema: {
          type: "object",
          properties: {
            nodeId: { type: "string", description: "ID of the target node." },
            propertyGroup: {
              type: "string",
              enum: ["layout", "style", "props", "bind"],
              description: "The property block to update.",
            },
            key: {
              type: "string",
              description:
                "Property key (e.g. 'paddingTop', 'color', 'content').",
            },
            value: { description: "The new property value." },
          },
          required: ["nodeId", "propertyGroup", "key", "value"],
        },
      },
      {
        name: "generate_pdf",
        description:
          "Export the current schema as a PDF using the local Next.js rendering API.",
        inputSchema: {
          type: "object",
          properties: {
            schema: {
              type: "object",
              description:
                "Optional full schema payload. If omitted, uses the active browser's current layout schema.",
            },
            outputPath: {
              type: "string",
              description:
                "Optional path where the generated PDF should be written relative to the workspace.",
            },
          },
        },
      },
      {
        name: "list_formcast_skills",
        description:
          "MASTER PROMPT: You are interacting with the FormCast AST. Before attempting to use any widget (e.g. Table, Text) or layout tools (e.g. BoxModel, styling), you MUST ALWAYS call this tool first to find the relevant schema rules. Do NOT guess the AST schema. Call this tool to list all available granular skill files, find the exact one you need (e.g. 'widget-TableNode.md'), and then read it using 'read_formcast_skill'.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "read_formcast_skill",
        description:
          "Read a specific FormCast skill or documentation topic. You must pass the exact filename (e.g. 'schema-BoxModel.md' or 'widget-TableNode.md') as returned by 'list_formcast_skills'.",
        inputSchema: {
          type: "object",
          properties: {
            skillSlug: {
              type: "string",
              description:
                "The filename of the documentation topic to read (e.g., 'widget-TextNode.md').",
            },
          },
          required: ["skillSlug"],
        },
      },
      {
        name: "set_document_section",
        description:
          "Upserts an entire DocumentSection into document.headers or document.footers.",
        inputSchema: {
          type: "object",
          properties: {
            sectionType: {
              type: "string",
              enum: ["headers", "footers"],
              description: "Whether it is a header or footer.",
            },
            sectionKey: {
              type: "string",
              description:
                "The key of the section (e.g., 'odd', 'even', 'first', 'common').",
            },
            sectionData: {
              type: "object",
              description:
                "The complete DocumentSection object including condition and root node.",
            },
          },
          required: ["sectionType", "sectionKey", "sectionData"],
        },
      },
      {
        name: "delete_document_section",
        description:
          "Completely removes a DocumentSection by key from headers or footers.",
        inputSchema: {
          type: "object",
          properties: {
            sectionType: { type: "string", enum: ["headers", "footers"] },
            sectionKey: {
              type: "string",
              description: "The key of the section to delete.",
            },
          },
          required: ["sectionType", "sectionKey"],
        },
      },
      {
        name: "update_document_meta",
        description:
          "Deep merges properties into the document.meta object (e.g. pageSize, orientation).",
        inputSchema: {
          type: "object",
          properties: {
            patch: {
              type: "object",
              description: "Partial meta object to merge.",
            },
          },
          required: ["patch"],
        },
      },
      {
        name: "update_document_theme",
        description:
          "Deep merges properties into the document.theme.defaults object.",
        inputSchema: {
          type: "object",
          properties: {
            patch: {
              type: "object",
              description: "Partial theme defaults object to merge.",
            },
          },
          required: ["patch"],
        },
      },
      {
        name: "set_page_override",
        description:
          "Sets or removes a specific page's header/footer mapping in document.pageOverrides.",
        inputSchema: {
          type: "object",
          properties: {
            pageNumber: {
              type: "number",
              description: "The page number to override.",
            },
            headerId: {
              type: "string",
              description: "Header section key to use, or null to hide.",
            },
            footerId: {
              type: "string",
              description: "Footer section key to use, or null to hide.",
            },
          },
          required: ["pageNumber"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case "get_active_sessions": {
        const sessionList = Array.from(sessions.entries()).map(([id, s]) => ({
          sessionId: id,
          title: s.title,
          lastActive: new Date(s.lastActive).toISOString(),
          isActive: id === activeSessionId,
        }));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { activeSessionId, sessions: sessionList },
                null,
                2
              ),
            },
          ],
        };
      }

      case "select_active_session": {
        const { sessionId } = args as { sessionId: string };
        if (!sessions.has(sessionId))
          throw new Error(`Session ${sessionId} not found.`);
        activeSessionId = sessionId;
        return {
          content: [
            { type: "text", text: `Active session switched to ${sessionId}` },
          ],
        };
      }

      case "get_document_state": {
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        return {
          content: [
            { type: "text", text: JSON.stringify(state.schema, null, 2) },
          ],
        };
      }

      case "set_document_state": {
        const { schema } = args as { schema: any };
        return validateAndSend(
          schema,
          "Successfully sent validated updated schema layout to browser tab."
        );
      }

      case "replace_document_body": {
        const { children } = args as { children: any[] };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = JSON.parse(JSON.stringify(state.schema));
        newSchema.document.body.children = children;
        return validateAndSend(
          newSchema,
          "Successfully replaced document body children and passed validation."
        );
      }

      case "get_layout_element": {
        const { nodeId } = args as { nodeId: string };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const result = findNodeGlobal(state.schema, nodeId);
        if (!result)
          throw new Error(`Node ${nodeId} not found in active schema.`);
        return {
          content: [
            { type: "text", text: JSON.stringify(result.node, null, 2) },
          ],
        };
      }

      case "patch_element_properties": {
        const { nodeId, patch } = args as { nodeId: string; patch: any };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = patchNodeProperties(state.schema, nodeId, patch);
        return validateAndSend(
          newSchema,
          `Successfully patched properties on node ${nodeId}`
        );
      }

      case "update_document_data": {
        const { data } = args as { data: any };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = JSON.parse(JSON.stringify(state.schema));
        newSchema.data = newSchema.data || {};
        deepMerge(newSchema.data, data);
        return validateAndSend(
          newSchema,
          `Successfully merged new data into document state.`
        );
      }

      case "set_document_section": {
        const { sectionType, sectionKey, sectionData } = args as {
          sectionType: "headers" | "footers";
          sectionKey: string;
          sectionData: any;
        };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = JSON.parse(JSON.stringify(state.schema));
        newSchema.document[sectionType] = newSchema.document[sectionType] || {};
        newSchema.document[sectionType][sectionKey] = sectionData;
        return validateAndSend(
          newSchema,
          `Successfully set document ${sectionType} section: ${sectionKey}`
        );
      }

      case "delete_document_section": {
        const { sectionType, sectionKey } = args as {
          sectionType: "headers" | "footers";
          sectionKey: string;
        };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = JSON.parse(JSON.stringify(state.schema));
        if (
          newSchema.document[sectionType] &&
          newSchema.document[sectionType][sectionKey]
        ) {
          delete newSchema.document[sectionType][sectionKey];
        }
        return validateAndSend(
          newSchema,
          `Successfully deleted document ${sectionType} section: ${sectionKey}`
        );
      }

      case "update_document_meta": {
        const { patch } = args as { patch: any };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = JSON.parse(JSON.stringify(state.schema));
        newSchema.meta = newSchema.meta || {};
        deepMerge(newSchema.meta, patch);
        return validateAndSend(
          newSchema,
          `Successfully merged properties into document.meta.`
        );
      }

      case "update_document_theme": {
        const { patch } = args as { patch: any };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = JSON.parse(JSON.stringify(state.schema));
        newSchema.theme = newSchema.theme || {};
        newSchema.theme.defaults = newSchema.theme.defaults || {};
        deepMerge(newSchema.theme.defaults, patch);
        return validateAndSend(
          newSchema,
          `Successfully merged properties into document.theme.defaults.`
        );
      }

      case "set_page_override": {
        const { pageNumber, headerId, footerId } = args as {
          pageNumber: number;
          headerId?: string | null;
          footerId?: string | null;
        };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = JSON.parse(JSON.stringify(state.schema));
        newSchema.document.pageOverrides =
          newSchema.document.pageOverrides || {};
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

      case "get_available_widgets": {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(WIDGET_DOCUMENTATION, null, 2),
            },
          ],
        };
      }

      case "add_text_widget": {
        const { parentId, literal, style = {}, layout = {} } = args as any;
        const generatedId = `text-${Math.random().toString(36).substring(2, 9)}`;
        const newNode = {
          type: "text",
          id: generatedId,
          layout,
          style,
          props: { literal },
        };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = insertNodeIntoAst(state.schema, parentId, newNode);
        return validateAndSend(
          newSchema,
          `Successfully inserted text widget (ID: ${generatedId}) under parent ${parentId}`
        );
      }

      case "add_table_widget": {
        const { parentId, dataPath, columns, layout = {} } = args as any;
        const generatedId = `table-${Math.random().toString(36).substring(2, 9)}`;
        const newNode: any = {
          type: "table",
          id: generatedId,
          layout,
          bind: { path: dataPath, mode: "repeat" },
          props: { columns },
        };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = insertNodeIntoAst(state.schema, parentId, newNode);
        return validateAndSend(
          newSchema,
          `Successfully inserted table widget (ID: ${generatedId}) under parent ${parentId}`
        );
      }

      case "insert_layout_element": {
        const {
          parentId,
          index,
          widgetType,
          props = {},
        } = args as {
          parentId: string;
          index?: number;
          widgetType: keyof typeof DEFAULT_WIDGET_CONFIGS;
          props?: any;
        };

        const baseMock = DEFAULT_WIDGET_CONFIGS[widgetType];
        if (!baseMock)
          throw new Error(`Unsupported widget type: ${widgetType}`);

        const generatedId = `${widgetType}-${Math.random().toString(36).substring(2, 9)}`;
        const newNode = {
          ...JSON.parse(JSON.stringify(baseMock)),
          id: generatedId,
          ...props,
        };

        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
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

      case "delete_layout_element": {
        const { nodeId } = args as { nodeId: string };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = deleteNodeFromAst(state.schema, nodeId);

        return validateAndSend(
          newSchema,
          `Successfully deleted node ${nodeId}`
        );
      }

      case "update_element_properties": {
        const { nodeId, propertyGroup, key, value } = args as {
          nodeId: string;
          propertyGroup: string;
          key: string;
          value: any;
        };
        const patch = { [propertyGroup]: { [key]: value } };
        const state = await sendCommandToActiveSession({
          type: "GET_CURRENT_SCHEMA",
        });
        const newSchema = patchNodeProperties(state.schema, nodeId, patch);

        return validateAndSend(
          newSchema,
          `Successfully updated node ${nodeId} property ${propertyGroup}.${key}`
        );
      }

      case "generate_pdf": {
        const { schema: providedSchema, outputPath } = args as {
          schema?: any;
          outputPath?: string;
        };
        let finalSchema = providedSchema;

        if (!finalSchema) {
          const wsResponse = await sendCommandToActiveSession({
            type: "GET_CURRENT_SCHEMA",
          });
          finalSchema = wsResponse.schema;
        }

        console.error("Calling Next.js API for PDF generation...");

        const appUrl =
          process.env.APP_URL ||
          process.env.NEXT_PUBLIC_APP_URL ||
          (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:8000");

        const response = await fetch(`${appUrl}/api/pdf`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalSchema),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`PDF generation API failed: ${errText}`);
        }

        const buffer = await response.arrayBuffer();
        const outputFilename = outputPath || `print-${Date.now()}.pdf`;
        const resolvedPath = path.isAbsolute(outputFilename)
          ? outputFilename
          : path.join(process.cwd(), outputFilename);

        fs.writeFileSync(resolvedPath, Buffer.from(buffer));
        return {
          content: [
            {
              type: "text",
              text: `Successfully generated PDF and wrote to file: ${resolvedPath}`,
            },
          ],
        };
      }

      case "list_formcast_skills": {
        const docsPath = path.join(process.cwd(), "mcp-skills");
        if (!fs.existsSync(docsPath)) {
          return {
            content: [
              { type: "text", text: "Docs directory not found at mcp-skills" },
            ],
          };
        }
        const files = fs.readdirSync(docsPath).filter((f) => f.endsWith(".md"));
        return {
          content: [
            {
              type: "text",
              text: `Available FormCast Skills/Docs:\n\n${files.map((f) => `- ${f}`).join("\n")}\n\nUse the 'read_formcast_skill' tool with the exact filename to read its contents.`,
            },
          ],
        };
      }

      case "read_formcast_skill": {
        const { skillSlug } = args as { skillSlug: string };
        const docsPath = path.join(process.cwd(), "mcp-skills", skillSlug);

        // Prevent path traversal
        const resolvedDocsDir = path.resolve(process.cwd(), "mcp-skills");
        const resolvedTargetPath = path.resolve(docsPath);

        if (!resolvedTargetPath.startsWith(resolvedDocsDir)) {
          throw new Error(
            "Invalid skill path. Cannot traverse directories outside of mcp-skills."
          );
        }

        if (!fs.existsSync(resolvedTargetPath)) {
          throw new Error(`Skill file not found: ${skillSlug}`);
        }

        const content = fs.readFileSync(resolvedTargetPath, "utf8");
        return {
          content: [
            {
              type: "text",
              text: content,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error: ${error.message}` }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("FormCast MCP Server running on stdio transport");
}

run().catch((error) => {
  console.error("Fatal error running MCP Server:", error);
  process.exit(1);
});
