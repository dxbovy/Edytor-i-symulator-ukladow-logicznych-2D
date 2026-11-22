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
} from "./drag.js";
import {
  ensureMarqueeOverlay,
  finishMarquee,
  hideMarquee,
  paintMarquee,
} from "./marquee.js";

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
  let movedPx = 0;
  let dragStarts = null;

  const screenFromEvent = (event) => {
    const r = root.getBoundingClientRect();
    return { x: event.clientX - r.left, y: event.clientY - r.top };
  };

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

  root.addEventListener("pointerdown", (event) => {
    if (isViewPan(event) || event.button !== 0) return;
    const screen = screenFromEvent(event);
    const world = screenToWorld(screen.x, screen.y, projectState.camera);
    const id = hitTestTopNode(world.x, world.y);
    shiftKey = event.shiftKey;
    movedPx = 0;
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
    movedPx += Math.hypot(event.movementX, event.movementY);
    const screen = screenFromEvent(event);
    lastScreenX = screen.x;
    lastScreenY = screen.y;
    if (mode === "drag" && dragStarts) {
      applyDragFromScreenDelta(
        dragStarts,
        lastScreenX - startScreenX,
        lastScreenY - startScreenY,
        movedPx
      );
    } else if (mode === "marquee" && movedPx >= CLICK_PX) {
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
    if (isViewPan(event)) return release();
    if (mode === "drag") finishDragGesture(movedPx, hitId, dragStarts);
    else if (mode === "marquee") {
      finishMarquee(
        startScreenX,
        startScreenY,
        lastScreenX,
        lastScreenY,
        movedPx,
        shiftKey
      );
    }
    release();
  };

  root.addEventListener("pointerup", finish);
  root.addEventListener("pointercancel", finish);
}