import { projectState } from "../state/projectState.js";
import { nodeSizeFor } from "../canvas/nodeSizes.js";
import { worldToScreen } from "../canvas/coordinates.js";
import { nodeWorldAABB } from "./hitTest.js";

/** @param {string[]} ids */
export function selectionWorldBounds(ids) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let any = false;
  for (const id of ids) {
    const node = projectState.nodes[id];
    if (!node) continue;
    const box = nodeWorldAABB(node);
    minX = Math.min(minX, box.minX);
    minY = Math.min(minY, box.minY);
    maxX = Math.max(maxX, box.maxX);
    maxY = Math.max(maxY, box.maxY);
    any = true;
  }
  if (!any) return null;
  return { minX, minY, maxX, maxY };
}

/** @param {{ minX: number, minY: number, maxX: number, maxY: number }} bounds */
export function boundsScreenRect(bounds) {
  const cam = projectState.camera;
  const tl = worldToScreen(bounds.minX, bounds.minY, cam);
  const br = worldToScreen(bounds.maxX, bounds.maxY, cam);
  return {
    left: tl.x,
    top: tl.y,
    width: br.x - tl.x,
    height: br.y - tl.y,
    right: br.x,
    bottom: br.y,
  };
}

/** @param {import("../state/projectState.js").projectState["nodes"][string]} node */
export function nodeVisualCenter(node) {
  const { w: bw, h: bh } = nodeSizeFor(node.type);
  return { x: node.x + bw / 2, y: node.y + bh / 2 };
}

/** @param {import("../state/projectState.js").projectState["nodes"][string]} node @param {number} cx @param {number} cy */
export function placeNodeAtVisualCenter(node, cx, cy) {
  const { w: bw, h: bh } = nodeSizeFor(node.type);
  node.x = cx - bw / 2;
  node.y = cy - bh / 2;
}