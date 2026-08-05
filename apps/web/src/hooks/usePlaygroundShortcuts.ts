import { useEffect } from "react";
import {
  useDocumentStore,
  useDocumentTemporalStore,
} from "../store/documentStore";

export const usePlaygroundShortcuts = (
  setShowEditor: React.Dispatch<React.SetStateAction<boolean>>,
  showToast: (msg: string) => void
) => {
  const setZoom = useDocumentStore((state) => state.setZoom);
  const { undo, redo } = useDocumentTemporalStore((state) => state);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not hijack undo/redo if typing in an input field
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";

      const isMod = e.metaKey || e.ctrlKey;
      if (isMod) {
        if (e.key.toLowerCase() === "z") {
          if (!isInput) {
            e.preventDefault();
            if (e.shiftKey) {
              redo();
              showToast("Redo");
            } else {
              undo();
              showToast("Undo");
            }
          }
          return;
        }
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault();
            setZoom((z) => Math.min(2, z + 0.1));
            showToast("Zoom In");
            break;
          case "-":
            e.preventDefault();
            setZoom((z) => Math.max(0.25, z - 0.1));
            showToast("Zoom Out");
            break;
          case "0":
            e.preventDefault();
            setZoom(1);
            showToast("Reset Zoom");
            break;
          case "\\":
          case "b":
          case "e":
            e.preventDefault();
            setShowEditor((s) => !s);
            break;
          case "s":
          case "S":
            e.preventDefault();
            // handled by DocumentPreview for saving schema
            break;
          case "p":
          case "P":
            e.preventDefault();
            window.print();
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [setZoom, setShowEditor, showToast, undo, redo]);
};
