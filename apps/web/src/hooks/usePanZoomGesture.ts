import { useEffect, useRef } from "react";

interface UsePanZoomGestureProps {
  zoom: number;
  onZoomChange?: (zoom: number) => void;
}

export function usePanZoomGesture({
  zoom,
  onZoomChange,
}: UsePanZoomGestureProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchState = useRef({
    initialDistance: 0,
    initialZoom: 1,
    currentZoom: zoom,
    initialMidX: 0,
    initialMidY: 0,
    initialScrollLeft: 0,
    initialScrollTop: 0,
    containerRect: null as DOMRect | null,
    wheelTimeout: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  useEffect(() => {
    touchState.current.currentZoom = zoom;
  }, [zoom]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        touchState.current.initialDistance = Math.hypot(dx, dy);
        touchState.current.initialZoom = touchState.current.currentZoom;
        touchState.current.initialMidX = (t1.clientX + t2.clientX) / 2;
        touchState.current.initialMidY = (t1.clientY + t2.clientY) / 2;
        touchState.current.initialScrollLeft = container.scrollLeft;
        touchState.current.initialScrollTop = container.scrollTop;
        touchState.current.containerRect = container.getBoundingClientRect();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault(); // Stop native zoom/scroll

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        const distance = Math.hypot(dx, dy);

        if (
          touchState.current.initialDistance > 0 &&
          touchState.current.containerRect
        ) {
          const scale = distance / touchState.current.initialDistance;
          // Dampen the scale to avoid huge jumps as requested by user
          const dampenedScale = 1 + (scale - 1) * 0.7;
          let newZoom = touchState.current.initialZoom * dampenedScale;
          newZoom = Math.min(Math.max(newZoom, 0.1), 3.0);

          touchState.current.currentZoom = newZoom;

          // Fast DOM update for buttery smoothness
          const zoomContainer = document.getElementById(
            "preview-zoom-container"
          );
          if (zoomContainer) {
            zoomContainer.style.zoom = newZoom.toString();
          }

          // Concurrent Panning with exact focal point math
          const currentMidX = (t1.clientX + t2.clientX) / 2;
          const currentMidY = (t1.clientY + t2.clientY) / 2;

          const rect = touchState.current.containerRect;
          const factor = newZoom / touchState.current.initialZoom;

          const initialContainerMidX =
            touchState.current.initialMidX - rect.left;
          const initialContainerMidY =
            touchState.current.initialMidY - rect.top;

          const currentContainerMidX = currentMidX - rect.left;
          const currentContainerMidY = currentMidY - rect.top;

          const newScrollLeft =
            (initialContainerMidX + touchState.current.initialScrollLeft) *
              factor -
            currentContainerMidX;
          const newScrollTop =
            (initialContainerMidY + touchState.current.initialScrollTop) *
              factor -
            currentContainerMidY;

          container.scrollLeft = newScrollLeft;
          container.scrollTop = newScrollTop;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2 && touchState.current.initialDistance > 0) {
        touchState.current.initialDistance = 0;
        if (onZoomChange) {
          onZoomChange(touchState.current.currentZoom);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // ctrlKey is true for trackpad pinch-to-zoom gestures in browsers
      if (e.ctrlKey) {
        e.preventDefault();

        const rect = container.getBoundingClientRect();
        const scaleMultiplier = Math.exp(-e.deltaY * 0.01);

        let newZoom = touchState.current.currentZoom * scaleMultiplier;
        newZoom = Math.min(Math.max(newZoom, 0.1), 3.0);

        if (newZoom !== touchState.current.currentZoom) {
          const factor = newZoom / touchState.current.currentZoom;
          touchState.current.currentZoom = newZoom;

          const zoomContainer = document.getElementById(
            "preview-zoom-container"
          );
          if (zoomContainer) {
            zoomContainer.style.zoom = newZoom.toString();
          }

          const pointerX = e.clientX - rect.left;
          const pointerY = e.clientY - rect.top;

          const newScrollLeft =
            (pointerX + container.scrollLeft) * factor - pointerX;
          const newScrollTop =
            (pointerY + container.scrollTop) * factor - pointerY;

          container.scrollLeft = newScrollLeft;
          container.scrollTop = newScrollTop;

          // Debounce the state sync since wheel events fire continuously
          clearTimeout(touchState.current.wheelTimeout);
          touchState.current.wheelTimeout = setTimeout(() => {
            if (onZoomChange) {
              onZoomChange(touchState.current.currentZoom);
            }
          }, 200);
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    container.addEventListener("touchcancel", handleTouchEnd, {
      passive: false,
    });
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [onZoomChange]);

  return scrollContainerRef;
}
