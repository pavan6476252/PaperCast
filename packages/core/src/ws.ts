import type { DocumentSchema } from "./schema";

export enum WsEventType {
  REGISTER_TAB = "REGISTER_TAB",
  TAB_FOCUS = "TAB_FOCUS",
  STATE_CHANGED = "STATE_CHANGED",
  GET_CURRENT_SCHEMA = "GET_CURRENT_SCHEMA",
  UPDATE_SCHEMA = "UPDATE_SCHEMA",
  AST_ACTION = "AST_ACTION",
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

export type WsMessage =
  | RegisterTabPayload
  | TabFocusPayload
  | StateChangedPayload
  | GetCurrentSchemaPayload
  | UpdateSchemaPayload
  | AstActionPayload;
