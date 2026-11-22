import { projectState, notify } from "../state/projectState.js";
import { snapToGrid } from "../canvas/snap.js";
import { clientToWorld } from "../canvas/coordinates.js";
import { getSelectedIds } from "./selection.js";
import {
  nodeVisualCenter,
  placeNodeAtVisualCenter,
  selectionWorldBounds,
} from "./geometry.js";

export const SCALE_MIN = 0.5;
export const SCALE_MAX = 2;

function clampScale(s) {
  return Math.min(SCALE_MAX, Math.max(SCALE_MIN, s));
}

/** @typedef {{ anchor: { x: number, y: number }, startDist: number, snaps: Record<string, { scale: number, center: { x: number, y: number } }> }} ScaleGesture */

/** @returns {ScaleGesture | null} */
export function beginScaleGesture(clientX, clientY) {
  const ids = getSelectedIds();
  if (ids.length === 0) return null;
  const pointer = clientToWorld(clientX, clientY);
  let anchor;
  if (ids.length === 1) {
    const node = projectState.nodes[ids[0]];
    anchor = node ? nodeVisualCenter(node) : { x: 0, y: 0 };
  } else {
    const bounds = selectionWorldBounds(ids);
    anchor = bounds
      ? {
          x: (bounds.minX + bounds.maxX) / 2,
          y: (bounds.minY + bounds.maxY) / 2,
        }
      : { x: 0, y: 0 };
  }
  const startDist = Math.hypot(pointer.x - anchor.x, pointer.y - anchor.y);
  /** @type {ScaleGesture["snaps"]} */
  const snaps = {};
  for (const id of ids) {
    const node = projectState.nodes[id];
    if (!node) continue;
    snaps[id] = { scale: node.scale, center: nodeVisualCenter(node) };
  }
  return { anchor, startDist: Math.max(startDist, 1e-6), snaps };
}

/** @param {ScaleGesture} gesture @param {number} clientX @param {number} clientY */
export function updateScaleGesture(gesture, clientX, clientY) {
  const pointer = clientToWorld(clientX, clientY);
  const d1 = Math.hypot(
    pointer.x - gesture.anchor.x,
    pointer.y - gesture.anchor.y
  );
  const factor = d1 / gesture.startDist;
  const ids = getSelectedIds();
  const multi = ids.length > 1;
  const gcx = gesture.anchor.x;
  const gcy = gesture.anchor.y;

  for (const id of ids) {
    const snap = gesture.snaps[id];
    const node = projectState.nodes[id];
    if (!snap || !node) continue;
    const newScale = clampScale(snap.scale * factor);
    const applied = newScale / snap.scale;
    node.scale = newScale;
    if (multi) {
      const dx = snap.center.x - gcx;
      const dy = snap.center.y - gcy;
      placeNodeAtVisualCenter(node, gcx + dx * applied, gcy + dy * applied);
    }
  }
  notify();
}

export function rotateSelection90() {
  const ids = getSelectedIds();
  if (ids.length === 0) return;

  if (ids.length === 1) {
    const node = projectState.nodes[ids[0]];
    if (!node) return;
    node.rotation = (node.rotation + 90) % 360;
    const s = snapToGrid(node.x, node.y);
    node.x = s.x;
    node.y = s.y;
  } else {
    const bounds = selectionWorldBounds(ids);
    if (!bounds) return;
    const gcx = (bounds.minX + bounds.maxX) / 2;
    const gcy = (bounds.minY + bounds.maxY) / 2;
    for (const id of ids) {
      const node = projectState.nodes[id];
      if (!node) continue;
      const vc = nodeVisualCenter(node);
      const dx = vc.x - gcx;
      const dy = vc.y - gcy;
      node.rotation = (node.rotation + 90) % 360;
      placeNodeAtVisualCenter(node, gcx - dy, gcy + dx);
      const s = snapToGrid(node.x, node.y);
      node.x = s.x;
      node.y = s.y;
    }
  }
  notify();
}

/** @param {number} delta */
export function nudgeSelectionScale(delta) {
  const ids = getSelectedIds();
  if (ids.length === 0) return;

  if (ids.length === 1) {
    const node = projectState.nodes[ids[0]];
    if (!node) return;
    node.scale = clampScale(node.scale + delta);
    notify();
    return;
  }

  const bounds = selectionWorldBounds(ids);
  if (!bounds) return;
  const gcx = (bounds.minX + bounds.maxX) / 2;
  const gcy = (bounds.minY + bounds.maxY) / 2;

  for (const id of ids) {
    const node = projectState.nodes[id];
    if (!node) continue;
    const prev = node.scale;
    node.scale = clampScale(prev + delta);
    const applied = node.scale / prev;
    const vc = nodeVisualCenter(node);
    const dx = vc.x - gcx;
    const dy = vc.y - gcy;
    placeNodeAtVisualCenter(node, gcx + dx * applied, gcy + dy * applied);
  }
  notify();
}