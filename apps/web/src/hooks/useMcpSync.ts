import { useEffect, useRef, useState } from "react";
import { useDocumentStore } from "../store/documentStore";
import { useWorkspaceStore } from "../store/workspaceStore";
import { WsEventType, WsMessage } from "@papercast/core/ws";

export function useMcpSync() {
  const parsedDocument = useDocumentStore((state) => state.parsedDocument);
  const setJsonString = useDocumentStore((state) => state.setJsonString);
  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);

  const wsRef = useRef<WebSocket | null>(null);
  const [sessionId] = useState(
    () => "session-" + Math.random().toString(36).substring(2, 9)
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = () => {
      const wsUrl = process.env.NEXT_PUBLIC_MCP_WS_URL || "ws://localhost:9000";
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to PaperCast MCP Sync Server");
        setIsConnected(true);
        // Register this tab session
        ws.send(
          JSON.stringify({
            type: WsEventType.REGISTER_TAB,
            sessionId,
            title: document.title || "PaperCast Playground",
            timestamp: Date.now(),
          })
        );
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data) as WsMessage;

          switch (message.type) {
            case WsEventType.UPDATE_SCHEMA:
              if (message.payload) {
                setJsonString(JSON.stringify(message.payload, null, 2));
              }
              break;

            case WsEventType.GET_CURRENT_SCHEMA:
              const store = useDocumentStore.getState();
              ws.send(
                JSON.stringify({
                  type: WsEventType.STATE_CHANGED,
                  requestId: message.requestId,
                  sessionId,
                  schema: store.parsedDocument,
                  selectedNodeId: store.selectedNodeId,
                })
              );
              break;

            case WsEventType.AST_ACTION: {
              const { action, args } = message;
              const store = useDocumentStore.getState() as unknown as Record<
                string,
                unknown
              >;
              if (typeof store[action] === "function") {
                console.log(`Executing AST action from MCP: ${action}`, args);
                (store[action] as (...args: unknown[]) => void)(...args);
              } else {
                console.warn(
                  `AST action ${action} not found on useDocumentStore`
                );
              }
              break;
            }

            case WsEventType.WORKSPACE_LIST_REQ: {
              const schemas = useWorkspaceStore.getState().schemas;
              ws.send(
                JSON.stringify({
                  type: WsEventType.WORKSPACE_LIST_RES,
                  requestId: message.requestId,
                  schemas,
                })
              );
              break;
            }

            case WsEventType.WORKSPACE_LOAD: {
              const content = await useWorkspaceStore
                .getState()
                .loadSchemaContent(message.id);
              if (content) {
                setJsonString(content);
                useWorkspaceStore.getState().setActiveSchema(message.id);
              }
              break;
            }

            case WsEventType.WORKSPACE_SAVE: {
              const workspaceStore = useWorkspaceStore.getState();
              const activeId = workspaceStore.activeSchemaId;
              const currentJson = useDocumentStore.getState().jsonString;
              if (activeId) {
                const active = workspaceStore.schemas.find(
                  (s) => s.id === activeId
                );
                await workspaceStore.saveSchema(
                  activeId,
                  active ? active.name : "Saved Schema",
                  currentJson
                );
              } else {
                const newId = await workspaceStore.createSchema(
                  "Saved Schema",
                  currentJson
                );
                workspaceStore.setActiveSchema(newId);
              }
              break;
            }

            case WsEventType.WORKSPACE_DELETE: {
              await useWorkspaceStore.getState().deleteSchema(message.id);
              break;
            }

            case WsEventType.WORKSPACE_CREATE: {
              const workspaceStore = useWorkspaceStore.getState();
              const newContent = message.schema
                ? JSON.stringify(message.schema, null, 2)
                : useDocumentStore.getState().jsonString;
              const newId = await workspaceStore.createSchema(
                message.name,
                newContent
              );
              if (message.schema) {
                setJsonString(newContent);
              }
              workspaceStore.setActiveSchema(newId);
              break;
            }

            default:
              break;
          }
        } catch (err) {
          console.error("Error processing MCP sync message:", err);
        }
      };

      ws.onclose = () => {
        setIsConnected((prev) => {
          if (prev) {
            console.log(
              "Disconnected from PaperCast MCP Sync Server. Reconnecting in 5s..."
            );
          }
          return false;
        });
        setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        // Suppress noisy error logs when MCP server is not running
        ws.close();
      };
    };

    connect();

    // Handle focus events to let the MCP server know this is the active tab
    const handleFocus = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "TAB_FOCUS",
            sessionId,
          })
        );
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [setJsonString, sessionId]);

  // Synchronize local changes back to the MCP server
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "STATE_CHANGED",
          sessionId,
          schema: parsedDocument,
          selectedNodeId: selectedNodeId,
        })
      );
    }
  }, [parsedDocument, selectedNodeId, sessionId]);

  return { isConnected, sessionId };
}
