import { screenToWorld } from "../canvas/coordinates.js";
import { projectState } from "../state/projectState.js";
import { isViewPan } from "../canvas/cameraInput.js";
import { hitTestTopNode } from "./hitTest.js";
import { isSelected, selectOnly, toggle } from "./selection.js";
import {
  applyDragFromScreenDelta,
  captureDragStarts,
  CLICK_PX,
  finishDragGesture,
  restoreDragStarts,
  screenSpanPx,
} from "./drag.js";
import {
  ensureMarqueeOverlay,
  finishMarquee,
  hideMarquee,
  paintMarquee,
} from "./marquee.js";
import {
  initSelectionHandles,
  isSelectionHandleTarget,
} from "./handles.js";

export function initInteraction() {
  const root = document.getElementById("canvas-root");
  if (!root) return;

  const overlay = ensureMarqueeOverlay(root);
  let active = false;
  let pointerId = null;
  let mode = null;
  let hitId = null;
  let shiftKey = false;
  let startScreenX = 0;
  let startScreenY = 0;
  let lastScreenX = 0;
  let lastScreenY = 0;
  let dragStarts = null;

  const screenFromEvent = (event) => {
    const r = root.getBoundingClientRect();
    return { x: event.clientX - r.left, y: event.clientY - r.top };
  };

  const screenSpan = () =>
    screenSpanPx(startScreenX, startScreenY, lastScreenX, lastScreenY);

  const release = () => {
    if (pointerId !== null && root.hasPointerCapture(pointerId)) {
      root.releasePointerCapture(pointerId);
    }
    active = false;
    pointerId = null;
    mode = null;
    hitId = null;
    dragStarts = null;
    hideMarquee(overlay);
  };

  const abortForPan = () => {
    if (dragStarts) restoreDragStarts(dragStarts);
    active = false;
    pointerId = null;
    mode = null;
    hitId = null;
    dragStarts = null;
    hideMarquee(overlay);
  };

  initSelectionHandles();

  root.addEventListener("pointerdown", (event) => {
    if (isSelectionHandleTarget(event.target)) return;
    if (active && isViewPan(event)) {
      abortForPan();
      return;
    }
    if (isViewPan(event) || event.button !== 0) return;
    const screen = screenFromEvent(event);
    const world = screenToWorld(screen.x, screen.y, projectState.camera);
    const id = hitTestTopNode(world.x, world.y);
    shiftKey = event.shiftKey;
    startScreenX = lastScreenX = screen.x;
    startScreenY = lastScreenY = screen.y;
    hitId = id;
    active = true;
    pointerId = event.pointerId;
    if (id) {
      if (shiftKey) {
        toggle(id);
        active = false;
        return;
      }
      if (!isSelected(id)) selectOnly(id);
      mode = "drag";
      dragStarts = captureDragStarts();
    } else mode = "marquee";
    root.setPointerCapture(event.pointerId);
  });

  root.addEventListener("pointermove", (event) => {
    if (!active || event.pointerId !== pointerId) return;
    const screen = screenFromEvent(event);
    lastScreenX = screen.x;
    lastScreenY = screen.y;
    const span = screenSpan();
    if (mode === "drag" && dragStarts) {
      applyDragFromScreenDelta(
        dragStarts,
        lastScreenX - startScreenX,
        lastScreenY - startScreenY,
        span
      );
    } else if (mode === "marquee" && span >= CLICK_PX) {
      paintMarquee(
        overlay,
        startScreenX,
        startScreenY,
        lastScreenX,
        lastScreenY
      );
    }
  });

  const finish = (event) => {
    if (!active || event.pointerId !== pointerId) return;
    const span = screenSpan();
    if (mode === "drag") finishDragGesture(span, hitId, dragStarts);
    else if (mode === "marquee") {
      finishMarquee(
        startScreenX,
        startScreenY,
        lastScreenX,
        lastScreenY,
        shiftKey
      );
    }
    release();
  };

  root.addEventListener("pointerup", finish);
  root.addEventListener("pointercancel", finish);
}