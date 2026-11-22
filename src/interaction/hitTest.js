import { projectState } from "../state/projectState.js";
import { nodeSizeFor } from "../canvas/nodeSizes.js";

export function nodeWorldAABB(node) {
  const { w: bw, h: bh } = nodeSizeFor(node.type);
  let w = bw;
  let h = bh;
  const r = ((node.rotation % 360) + 360) % 360;
  if (r === 90 || r === 270) {
    w = bh;
    h = bw;
  }
  w *= node.scale;
  h *= node.scale;
  const cx = node.x + bw / 2;
  const cy = node.y + bh / 2;
  return {
    minX: cx - w / 2,
    minY: cy - h / 2,
    maxX: cx + w / 2,
    maxY: cy + h / 2,
  };
}

/** @param {number} worldX @param {number} worldY */
export function hitTestTopNode(worldX, worldY) {
  let hit = null;
  for (const [id, node] of Object.entries(projectState.nodes)) {
    const box = nodeWorldAABB(node);
    if (
      worldX >= box.minX &&
      worldX <= box.maxX &&
      worldY >= box.minY &&
      worldY <= box.maxY
    ) {
      hit = id;
    }
  }
  return hit;
}

function intersects(a, b) {
  return (
    a.minX <= b.maxX &&
    a.maxX >= b.minX &&
    a.minY <= b.maxY &&
    a.maxY >= b.minY
  );
}

/** @param {{ minX: number, minY: number, maxX: number, maxY: number }} rect */
export function nodesIntersectingRect(rect) {
  const ids = [];
  for (const [id, node] of Object.entries(projectState.nodes)) {
    if (intersects(rect, nodeWorldAABB(node))) ids.push(id);
  }
  return ids;
}

/** @param {{ x: number, y: number }} a @param {{ x: number, y: number }} b */
export function worldRectFromPoints(a, b) {
  return {
    minX: Math.min(a.x, b.x),
    minY: Math.min(a.y, b.y),
    maxX: Math.max(a.x, b.x),
    maxY: Math.max(a.y, b.y),
  };
}