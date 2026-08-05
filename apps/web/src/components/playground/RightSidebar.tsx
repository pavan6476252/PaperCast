import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDocumentStore } from "../../store/documentStore";
import { PropertyPanel, WidgetsPanel } from "@papercast/react/editor";
import { ThemeToggle } from "../ThemeToggle";

export const RightSidebar = () => {
  const [rightWidth, setRightWidth] = useState(320);
  const isRightDragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    isRightDragging.current = true;
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
  }, []);

  const handleMouseUp = useCallback(() => {
    isRightDragging.current = false;
    setIsDragging(false);
    document.body.style.cursor = "default";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isRightDragging.current) {
      const newWidth = Math.max(
        200,
        Math.min(window.innerWidth - e.clientX, window.innerWidth - 400)
      );
      setRightWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const rightPanelMode = useDocumentStore((state) => state.rightPanelMode);
  const setRightPanelMode = useDocumentStore(
    (state) => state.setRightPanelMode
  );
  const selectedNodeId = useDocumentStore((state) => state.selectedNodeId);

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        className="w-2 bg-surface border-x border-border hover:bg-accent transition-colors cursor-col-resize z-20 hidden md:flex items-center justify-center shrink-0 print:hidden group"
      >
        <div className="h-8 w-1 bg-foreground/20 rounded-full group-hover:bg-white" />
      </div>
      <div
        style={{ "--right-width": `${rightWidth}px` } as React.CSSProperties}
        className="hidden md:flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)] relative shrink-0 print:hidden bg-background border-l border-border h-full md:w-[var(--right-width)] min-w-[260px]"
      >
        <div className="flex border-b border-border shrink-0">
          <button
            className={`flex-1 py-3 text-xs font-medium text-center focus:outline-none ${rightPanelMode === "widgets" ? "border-b-2 border-accent text-accent bg-background" : "text-foreground/70 hover:text-foreground bg-surface"}`}
            onClick={() => setRightPanelMode("widgets")}
          >
            Widgets
          </button>
          <button
            className={`flex-1 py-3 text-xs font-medium text-center focus:outline-none ${rightPanelMode === "properties" ? "border-b-2 border-accent text-accent bg-background" : "text-foreground/70 hover:text-foreground bg-surface"}`}
            onClick={() => setRightPanelMode("properties")}
          >
            Properties
          </button>
        </div>

        <div className="flex-1 overflow-auto relative">
          {rightPanelMode === "widgets" ? <WidgetsPanel /> : <PropertyPanel />}

          {/* Quick theme toggle at the bottom of the right sidebar */}
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
};
