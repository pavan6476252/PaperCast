import { sessions, activeSessionId, setActiveSessionId } from "./ws.js";

export async function getActiveSessions() {
  const sessionList = Array.from(sessions.entries()).map(([id, s]) => ({
    sessionId: id,
    title: s.title,
    lastActive: new Date(s.lastActive).toISOString(),
    isActive: id === activeSessionId,
  }));
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          { activeSessionId, sessions: sessionList },
          null,
          2
        ),
      },
    ],
  };
}

export async function selectActiveSession(sessionId: string) {
  if (!sessions.has(sessionId)) {
    throw new Error(`Session ${sessionId} not found.`);
  }
  setActiveSessionId(sessionId);
  return {
    content: [
      {
        type: "text" as const,
        text: `Active session switched to ${sessionId}`,
      },
    ],
  };
}
