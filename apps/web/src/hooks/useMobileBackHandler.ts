import { useEffect, useRef, useId } from "react";

// Global stack of active panels
const activePanels: { id: string; close: () => void }[] = [];
let isProgrammaticBack = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    if (isProgrammaticBack) {
      // Ignore popstate events triggered by our manual history.back() cleanup
      isProgrammaticBack = false;
      return;
    }

    if (activePanels.length > 0) {
      // Only close the top-most panel
      const topPanel = activePanels[activePanels.length - 1];
      topPanel.close();
    }
  });
}

export const useMobileBackHandler = (isOpen: boolean, onClose: () => void) => {
  const onCloseRef = useRef(onClose);
  const panelId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    let pushed = false;

    // Use a small timeout to bypass React 18 Strict Mode double-mounts
    const pushTimeout = setTimeout(() => {
      window.history.pushState({ panelId }, "");
      pushed = true;
      activePanels.push({ id: panelId, close: () => onCloseRef.current() });
    }, 10);

    return () => {
      clearTimeout(pushTimeout);

      if (pushed) {
        // Remove this panel from the active stack
        const index = activePanels.findIndex((p) => p.id === panelId);
        if (index !== -1) {
          activePanels.splice(index, 1);
        }

        // If the current history state belongs to THIS panel, it means it was closed manually (e.g. clicking 'X').
        // We must clean up the stack so the user doesn't have to hit back twice.
        if (window.history.state?.panelId === panelId) {
          isProgrammaticBack = true;
          window.history.back();
        }
      }
    };
  }, [isOpen]);
};
