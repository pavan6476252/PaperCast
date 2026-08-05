import { WebSocketServer, WebSocket } from "ws";
import { WsEventType, WsMessage } from "@papercast/core/ws";
import { DocumentSchema } from "@papercast/core";
// to-replace

export interface PaperCastSession {
  ws: WebSocket;
  title: string;
  lastActive: number;
  schema?: DocumentSchema;
}

export const sessions = new Map<string, PaperCastSession>();
export let activeSessionId: string | null = null;

const pendingRequests = new Map<
  string,
  {
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
    timeoutId: NodeJS.Timeout;
  }
>();

export function initWebSocketServer(port: number = 9000) {
  const wss = new WebSocketServer({ port });

  wss.on("error", (error: unknown) => {
    const err = error as Error & { code?: string };
    if (err?.code === "EADDRINUSE") {
      console.error(
        `🚨 WARNING: Port ${port} is already in use. The MCP server is running, but browser sync is disabled. Make sure you don't have multiple IDEs running the server.`
      );
    } else {
      console.error("WebSocket Server encountered a fatal error:", error);
    }
  });

  console.error(`Starting PaperCast Sync WebSocket Server on port ${port}...`);

  wss.on("connection", (ws) => {
    let registeredSessionId: string | null = null;

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString()) as WsMessage;

        switch (message.type) {
          case WsEventType.REGISTER_TAB: {
            const { sessionId, title } = message;
            registeredSessionId = sessionId;
            sessions.set(sessionId, {
              ws,
              title: title || "PaperCast Playground",
              lastActive: Date.now(),
            });

            if (!activeSessionId) {
              activeSessionId = sessionId;
            }
            console.error(`Session registered: ${sessionId} (${title})`);
            break;
          }

          case WsEventType.TAB_FOCUS: {
            const { sessionId } = message;
            if (sessions.has(sessionId)) {
              sessions.get(sessionId)!.lastActive = Date.now();
              activeSessionId = sessionId;
              console.error(`Active session switched to: ${sessionId}`);
            }
            break;
          }

          case WsEventType.STATE_CHANGED: {
            const { sessionId, schema, requestId } = message as Extract<
              WsMessage,
              { type: WsEventType.STATE_CHANGED }
            >;
            if (sessions.has(sessionId)) {
              const session = sessions.get(sessionId)!;
              session.lastActive = Date.now();
              if (schema) {
                session.schema = schema;
              }

              if (requestId && pendingRequests.has(requestId)) {
                const pending = pendingRequests.get(requestId)!;
                clearTimeout(pending.timeoutId);
                pendingRequests.delete(requestId);
                pending.resolve({ schema, sessionId });
              }
            }
            break;
          }

          case WsEventType.WORKSPACE_LIST_RES: {
            const { requestId, schemas } = message as Extract<
              WsMessage,
              { type: WsEventType.WORKSPACE_LIST_RES }
            >;
            if (requestId && pendingRequests.has(requestId)) {
              const pending = pendingRequests.get(requestId)!;
              clearTimeout(pending.timeoutId);
              pendingRequests.delete(requestId);
              pending.resolve({ schemas });
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
          if (activeSessionId) {
            console.error(`Active session fell back to: ${activeSessionId}`);
          }
        }
      }
    });

    ws.on("error", (err) => {
      console.error("WebSocket connection error:", err);
    });
  });

  return wss;
}

export function setActiveSessionId(sessionId: string | null) {
  activeSessionId = sessionId;
}

export function sendCommandToActiveSession(
  message: Record<string, unknown>
): Promise<any> {
  return new Promise((resolve, reject) => {
    const targetSessionId = activeSessionId;
    if (!targetSessionId || !sessions.has(targetSessionId)) {
      return reject(
        new Error(
          "No active browser session connected. Open the PaperCast Playground in your browser."
        )
      );
    }

    const session = sessions.get(targetSessionId)!;
    const requestId = "req-" + Math.random().toString(36).substring(2, 9);

    const timeoutId = setTimeout(() => {
      pendingRequests.delete(requestId);
      reject(
        new Error(
          "Request timed out. Browser did not respond within 15 seconds. (Is the Playground tab sleeping?)"
        )
      );
    }, 15000);

    pendingRequests.set(requestId, { resolve, reject, timeoutId });
    session.ws.send(JSON.stringify({ ...message, requestId }));
  });
}

export function fireCommandToActiveSession(message: Record<string, unknown>) {
  const targetSessionId = activeSessionId;
  if (!targetSessionId || !sessions.has(targetSessionId)) {
    throw new Error(
      "No active browser session connected. Open the PaperCast Playground in your browser."
    );
  }
  const session = sessions.get(targetSessionId)!;
  session.ws.send(JSON.stringify(message));
}

export async function getCurrentSchemaFromSession(): Promise<{
  schema: DocumentSchema;
  sessionId: string;
}> {
  const targetSessionId = activeSessionId;
  if (!targetSessionId || !sessions.has(targetSessionId)) {
    throw new Error(
      "No active browser session connected. Open the PaperCast Playground in your browser."
    );
  }
  const session = sessions.get(targetSessionId)!;
  if (session.schema) {
    return { schema: session.schema, sessionId: targetSessionId };
  }

  // Fallback: If cache is empty (e.g. server just restarted), request it from the browser
  return sendCommandToActiveSession({
    type: WsEventType.GET_CURRENT_SCHEMA,
  });
}
