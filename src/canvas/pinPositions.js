import { projectState } from "../state/projectState.js";
import { nodeSizeFor } from "./nodeSizes.js";

const WIDGET_BOX = 56;
const WIDGET_INSET_X = (80 - WIDGET_BOX) / 2;
const WIDGET_MID_Y = (58 - WIDGET_BOX) / 2 + WIDGET_BOX / 2;
const WIDGET_LEFT = WIDGET_INSET_X;
const WIDGET_RIGHT = WIDGET_INSET_X + WIDGET_BOX;

/** Pinów na wierzchołku chevrona „>” (bodyEdgeX, y). */
/** @type {Record<string, Record<string, { x: number, y: number }>>} */
const PIN_LOCAL = {
  AND: { in_A: { x: 18, y: 22 }, in_B: { x: 18, y: 38 }, out_Q: { x: 60, y: 30 } },
  OR: { in_A: { x: 22.4, y: 22 }, in_B: { x: 22.4, y: 38 }, out_Q: { x: 74, y: 30 } },
  XOR: { in_A: { x: 24.4, y: 22 }, in_B: { x: 24.4, y: 38 }, out_Q: { x: 76, y: 30 } },
  NOT: { in_A: { x: 8, y: 26 }, out_Q: { x: 49, y: 26 } },
  DFF: { in_D: { x: 22, y: 22 }, in_CLK: { x: 22, y: 38 }, out_Q: { x: 74, y: 30 } },
  LED: { in_A: { x: 14, y: 26 } },
  INPUT: { out: { x: WIDGET_RIGHT, y: WIDGET_MID_Y } },
  OUTPUT: { in: { x: WIDGET_LEFT, y: WIDGET_MID_Y } },
};

/** @param {import("../state/projectState.js").projectState["nodes"][string]} node @param {string} pinName */
export function getPinLocalPosition(node, pinName) {
  const map = PIN_LOCAL[node.type];
  const p = map?.[pinName];
  if (p) return { x: p.x, y: p.y };
  const { w, h } = nodeSizeFor(node.type);
  return { x: w / 2, y: h / 2 };
}

/** @param {string} nodeId @param {string} pinName */
export function getPinWorldPosition(nodeId, pinName) {
  const node = projectState.nodes[nodeId];
  if (!node) return { x: 0, y: 0 };
  const local = getPinLocalPosition(node, pinName);
  const { w: bw, h: bh } = nodeSizeFor(node.type);
  const cx = bw / 2;
  const cy = bh / 2;
  const dx = (local.x - cx) * node.scale;
  const dy = (local.y - cy) * node.scale;
  const rad = (node.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rx = dx * cos - dy * sin;
  const ry = dx * sin + dy * cos;
  return { x: node.x + cx + rx, y: node.y + cy + ry };
}