import { projectState, notify } from "../state/projectState.js";
import { snapToGrid } from "../canvas/snap.js";
import { getSelectedIds, selectOnly } from "./selection.js";

export const CLICK_PX = 4;

export function screenSpanPx(sx, sy, ex, ey) {
  return Math.hypot(ex - sx, ey - sy);
}

/** @returns {Record<string, { x: number, y: number }>} */
export function captureDragStarts() {
  /** @type {Record<string, { x: number, y: number }>} */
  const starts = {};
  for (const id of getSelectedIds()) {
    const node = projectState.nodes[id];
    if (node) starts[id] = { x: node.x, y: node.y };
  }
  return starts;
}

export function applyDragFromScreenDelta(
  starts,
  screenDx,
  screenDy,
  screenSpan
) {
  if (screenSpan < CLICK_PX) return;
  const z = projectState.camera.zoom;
  const dx = screenDx / z;
  const dy = screenDy / z;
  for (const id of getSelectedIds()) {
    const start = starts[id];
    const node = projectState.nodes[id];
    if (!start || !node) continue;
    node.x = start.x + dx;
    node.y = start.y + dy;
  }
  notify();
}

export function restoreDragStarts(starts) {
  for (const id of getSelectedIds()) {
    const start = starts[id];
    const node = projectState.nodes[id];
    if (!start || !node) continue;
    node.x = start.x;
    node.y = start.y;
  }
  notify();
}

export function finishDragGesture(screenSpan, hitId, starts) {
  if (screenSpan >= CLICK_PX) snapSelectedToGrid();
  else {
    if (starts) restoreDragStarts(starts);
    if (hitId) selectOnly(hitId);
  }
}

export function snapSelectedToGrid() {
  for (const id of getSelectedIds()) {
    const node = projectState.nodes[id];
    if (!node) continue;
    const s = snapToGrid(node.x, node.y);
    node.x = s.x;
    node.y = s.y;
  }
  notify();
}