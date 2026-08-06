"use client";

import { useEffect } from "react";

export function DragDropTouchPolyfill() {
  useEffect(() => {
    // Only import polyfill on client side to avoid SSR errors
    // @ts-expect-error: no types for drag-drop-touch
    import("drag-drop-touch");
  }, []);

  return null;
}
