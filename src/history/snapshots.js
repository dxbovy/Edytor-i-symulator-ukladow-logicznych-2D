import { projectState, notify } from "../state/projectState.js";

/** @param {string[]} ids */
export function captureTransforms(ids) {
  /** @type {Record<string, { x: number, y: number, rotation: number, scale: number }>} */
  const out = {};
  for (const id of ids) {
    const n = projectState.nodes[id];
    if (!n) continue;
    out[id] = { x: n.x, y: n.y, rotation: n.rotation, scale: n.scale };
  }
  return out;
}

/** @param {Record<string, { x: number, y: number, rotation: number, scale: number }>} snaps */
export function applyTransforms(snaps) {
  for (const [id, t] of Object.entries(snaps)) {
    const n = projectState.nodes[id];
    if (!n) continue;
    n.x = t.x;
    n.y = t.y;
    n.rotation = t.rotation;
    n.scale = t.scale;
  }
  notify();
}

/** @param {string[]} ids */
export function captureFullNodes(ids) {
  /** @type {Record<string, object>} */
  const out = {};
  for (const id of ids) {
    const n = projectState.nodes[id];
    if (n) out[id] = structuredClone(n);
  }
  return out;
}

/** @param {Record<string, object>} nodes */
export function insertNodes(nodes) {
  for (const [id, node] of Object.entries(nodes)) {
    projectState.nodes[id] = structuredClone(node);
  }
  notify();
}

/** @param {string[]} ids */
export function removeNodes(ids) {
  for (const id of ids) delete projectState.nodes[id];
  notify();
}

/** @param {Record<string, { x: number, y: number, rotation: number, scale: number }>} before */
/** @param {Record<string, { x: number, y: number, rotation: number, scale: number }>} after */
export function transformsDiffer(before, after) {
  for (const id of Object.keys(before)) {
    const a = before[id];
    const b = after[id];
    if (!a || !b) continue;
    if (
      a.x !== b.x ||
      a.y !== b.y ||
      a.rotation !== b.rotation ||
      a.scale !== b.scale
    ) {
      return true;
    }
  }
  return false;
}