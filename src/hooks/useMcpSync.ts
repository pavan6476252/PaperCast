import { useEffect, useRef, useState } from "react";
import { useDocumentStore } from "../store/documentStore";

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
        console.log("Connected to FormCast MCP Sync Server");
        setIsConnected(true);
        // Register this tab session
        ws.send(
          JSON.stringify({
            type: "REGISTER_TAB",
            sessionId,
            title: document.title || "FormCast Playground",
            timestamp: Date.now(),
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case "UPDATE_SCHEMA":
              if (message.payload) {
                setJsonString(JSON.stringify(message.payload, null, 2));
              }
              break;

            case "GET_CURRENT_SCHEMA":
              const store = useDocumentStore.getState();
              ws.send(
                JSON.stringify({
                  type: "STATE_CHANGED",
                  requestId: message.requestId,
                  sessionId,
                  schema: store.parsedDocument,
                  selectedNodeId: store.selectedNodeId,
                })
              );
              break;

            case "AST_ACTION": {
              const { action, args } = message;
              const store = useDocumentStore.getState();
              if (typeof (store as any)[action] === "function") {
                console.log(`Executing AST action from MCP: ${action}`, args);
                (store as any)[action](...args);
              } else {
                console.warn(
                  `AST action ${action} not found on useDocumentStore`
                );
              }
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
              "Disconnected from FormCast MCP Sync Server. Reconnecting in 5s..."
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
