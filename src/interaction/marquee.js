import { projectState } from "../state/projectState.js";
import { screenToWorld } from "../canvas/coordinates.js";
import { nodesIntersectingRect, worldRectFromPoints } from "./hitTest.js";
import { clear, selectMany } from "./selection.js";
import { CLICK_PX, screenSpanPx } from "./drag.js";

export function ensureMarqueeOverlay(root) {
  let el = document.getElementById("marquee-overlay");
  if (el) return el;
  el = document.createElement("div");
  el.id = "marquee-overlay";
  el.className =
    "pointer-events-none absolute z-10 border border-blue-700 bg-blue-700/10";
  el.setAttribute("aria-hidden", "true");
  el.style.display = "none";
  root.appendChild(el);
  return el;
}

export function hideMarquee(overlay) {
  overlay.style.display = "none";
}

export function paintMarquee(overlay, x0, y0, x1, y1) {
  const left = Math.min(x0, x1);
  const top = Math.min(y0, y1);
  overlay.style.display = "block";
  overlay.style.left = `${left}px`;
  overlay.style.top = `${top}px`;
  overlay.style.width = `${Math.abs(x1 - x0)}px`;
  overlay.style.height = `${Math.abs(y1 - y0)}px`;
}

export function finishMarquee(
  startScreenX,
  startScreenY,
  endScreenX,
  endScreenY,
  shiftKey
) {
  const span = screenSpanPx(startScreenX, startScreenY, endScreenX, endScreenY);
  if (span < CLICK_PX) {
    if (!shiftKey) clear();
    return;
  }
  const camera = projectState.camera;
  const w1 = screenToWorld(startScreenX, startScreenY, camera);
  const w2 = screenToWorld(endScreenX, endScreenY, camera);
  const rect = worldRectFromPoints(w1, w2);
  const ids = nodesIntersectingRect(rect);
  selectMany(ids, { additive: shiftKey });
}