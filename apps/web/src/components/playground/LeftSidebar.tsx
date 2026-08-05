import React, { useState, useRef, useEffect, useCallback } from "react";

export const LeftSidebar = ({ children }: { children: React.ReactNode }) => {
  const [leftWidth, setLeftWidth] = useState(400);
  const isLeftDragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    isLeftDragging.current = true;
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
  }, []);

  const handleMouseUp = useCallback(() => {
    isLeftDragging.current = false;
    setIsDragging(false);
    document.body.style.cursor = "default";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isLeftDragging.current) {
      const newWidth = Math.max(
        200,
        Math.min(e.clientX, window.innerWidth - 400)
      );
      setLeftWidth(newWidth);
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

  return (
    <>
      <div
        style={{ "--left-width": `${leftWidth}px` } as React.CSSProperties}
        className="flex flex-col z-40 absolute inset-0 md:relative md:z-10 shadow-xl shrink-0 print:hidden w-full md:w-[var(--left-width)] bg-background animate-in slide-in-from-left-8 fade-in duration-300 ease-out"
      >
        {children}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="w-2 bg-surface border-x border-border hover:bg-accent transition-colors cursor-col-resize z-20 hidden md:flex items-center justify-center shrink-0 print:hidden group"
      >
        <div className="h-8 w-1 bg-foreground/20 rounded-full group-hover:bg-white" />
      </div>
    </>
  );
};
