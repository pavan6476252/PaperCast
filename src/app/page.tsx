"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { JsonEditor } from "../components/editor/JsonEditor";
import { DocumentPreview } from "../components/renderer/DocumentPreview";

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(400); // initial width in pixels
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) {
      // Prevent it from getting too small or too large
      const newWidth = Math.max(300, Math.min(e.clientX, window.innerWidth - 300));
      setLeftWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-white text-black font-sans print:h-auto print:w-auto print:overflow-visible">
      <div 
        style={{ width: leftWidth }} 
        className="flex flex-col z-10 shadow-xl relative shrink-0 print:hidden"
      >
        <JsonEditor />
      </div>
      
      {/* Resizer Handle */}
      <div 
        onMouseDown={handleMouseDown}
        className="w-2 bg-gray-200 hover:bg-blue-500 transition-colors cursor-col-resize z-20 flex items-center justify-center shrink-0 print:hidden"
      >
        <div className="h-8 w-1 bg-gray-400 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden print:overflow-visible">
        <DocumentPreview />
      </div>
    </main>
  );
}
