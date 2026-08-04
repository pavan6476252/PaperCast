import type { DocumentSchema } from "./schema";

export enum WsEventType {
  REGISTER_TAB = "REGISTER_TAB",
  TAB_FOCUS = "TAB_FOCUS",
  STATE_CHANGED = "STATE_CHANGED",
  GET_CURRENT_SCHEMA = "GET_CURRENT_SCHEMA",
  UPDATE_SCHEMA = "UPDATE_SCHEMA",
  AST_ACTION = "AST_ACTION",
  WORKSPACE_LIST_REQ = "WORKSPACE_LIST_REQ",
  WORKSPACE_LIST_RES = "WORKSPACE_LIST_RES",
  WORKSPACE_LOAD = "WORKSPACE_LOAD",
  WORKSPACE_SAVE = "WORKSPACE_SAVE",
  WORKSPACE_DELETE = "WORKSPACE_DELETE",
}

export interface RegisterTabPayload {
  type: WsEventType.REGISTER_TAB;
  sessionId: string;
  title: string;
  timestamp: number;
}

export interface TabFocusPayload {
  type: WsEventType.TAB_FOCUS;
  sessionId: string;
}

export interface StateChangedPayload {
  type: WsEventType.STATE_CHANGED;
  requestId?: string;
  sessionId: string;
  schema: DocumentSchema;
  selectedNodeId: string | null;
}

export interface GetCurrentSchemaPayload {
  type: WsEventType.GET_CURRENT_SCHEMA;
  requestId?: string;
}

export interface UpdateSchemaPayload {
  type: WsEventType.UPDATE_SCHEMA;
  payload: DocumentSchema;
}

export interface AstActionPayload {
  type: WsEventType.AST_ACTION;
  action: string;
  args: any[];
}

export interface WorkspaceListReqPayload {
  type: WsEventType.WORKSPACE_LIST_REQ;
  requestId: string;
}

export interface WorkspaceSchemaMetadata {
  id: string;
  name: string;
  updatedAt: number;
}

export interface WorkspaceListResPayload {
  type: WsEventType.WORKSPACE_LIST_RES;
  requestId: string;
  schemas: WorkspaceSchemaMetadata[];
}

export interface WorkspaceLoadPayload {
  type: WsEventType.WORKSPACE_LOAD;
  id: string;
}

export interface WorkspaceSavePayload {
  type: WsEventType.WORKSPACE_SAVE;
}

export interface WorkspaceDeletePayload {
  type: WsEventType.WORKSPACE_DELETE;
  id: string;
}

export type WsMessage =
  | RegisterTabPayload
  | TabFocusPayload
  | StateChangedPayload
  | GetCurrentSchemaPayload
  | UpdateSchemaPayload
  | AstActionPayload
  | WorkspaceListReqPayload
  | WorkspaceListResPayload
  | WorkspaceLoadPayload
  | WorkspaceSavePayload
  | WorkspaceDeletePayload;
