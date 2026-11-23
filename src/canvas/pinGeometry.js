import { projectState } from "../state/projectState.js";
import { getPinLocalPosition } from "./pinPositions.js";
import { nodeSizeFor } from "./nodeSizes.js";

export const HOOK = 7;
export const CHEVRON_HALF = 5;
export const WIRE_STUB = 18;

/** Od środka bloczka do pinu (na zewnątrz konturu). */
export function getPinOutwardDir(nodeId, pinName) {
  const node = projectState.nodes[nodeId];
  if (!node) return { x: 1, y: 0 };
  const { w, h } = nodeSizeFor(node.type);
  const local = getPinLocalPosition(node, pinName);
  const cx = w / 2;
  const cy = h / 2;
  let dx = local.x - cx;
  let dy = local.y - cy;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const rad = (node.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: dx * cos - dy * sin,
    y: dx * sin + dy * cos,
  };
}

/** Kierunek, z którego przewód wjeżdża w wejście (przeciwny do outward). */
export function getPinApproachDir(nodeId, pinName) {
  const o = getPinOutwardDir(nodeId, pinName);
  return { x: -o.x, y: -o.y };
}

/** Wierzchołek chevrona na konturze (istniejący pin). */
export { getPinWorldPosition } from "./pinPositions.js";

/** @param {{ x: number, y: number }} apex @param {{ x: number, y: number }} approachDir od portu do świata */
export function wireAttachFromApproach(apex, approachDir) {
  return {
    x: apex.x - approachDir.x * HOOK,
    y: apex.y - approachDir.y * HOOK,
  };
}

/** @param {{ x: number, y: number }} apex @param {{ x: number, y: number }} outDir */
export function wireAttachFromOutput(apex, outDir) {
  return {
    x: apex.x + outDir.x * HOOK,
    y: apex.y + outDir.y * HOOK,
  };
}

/** Manhattan z prostymi odcinkami stub przed portem. */
export function manhattanWirePath(
  fromApex,
  fromPin,
  toApex,
  toPin,
  fromNodeId,
  toNodeId
) {
  const outDir = getPinOutwardDir(fromNodeId, fromPin);
  const inApproach = getPinApproachDir(toNodeId, toPin);
  const aExit = wireAttachFromOutput(fromApex, outDir);
  const aStub = {
    x: aExit.x + outDir.x * WIRE_STUB,
    y: aExit.y + outDir.y * WIRE_STUB,
  };
  const bAttach = wireAttachFromApproach(toApex, inApproach);
  const bStub = {
    x: bAttach.x - inApproach.x * WIRE_STUB,
    y: bAttach.y - inApproach.y * WIRE_STUB,
  };
  const midX = (aStub.x + bStub.x) / 2;
  return (
    `M ${aExit.x} ${aExit.y} L ${aStub.x} ${aStub.y} ` +
    `L ${midX} ${aStub.y} L ${midX} ${bStub.y} L ${bStub.x} ${bStub.y} ` +
    `L ${bAttach.x} ${bAttach.y}`
  );
}

/** @param {{ x: number, y: number }} apex @param {{ x: number, y: number }} approachDir */
export function openChevronPaths(apex, approachDir) {
  const px = -approachDir.y;
  const py = approachDir.x;
  const wing = {
    x: apex.x - approachDir.x * HOOK,
    y: apex.y - approachDir.y * HOOK,
  };
  const top = { x: wing.x + px * CHEVRON_HALF, y: wing.y + py * CHEVRON_HALF };
  const bot = { x: wing.x - px * CHEVRON_HALF, y: wing.y - py * CHEVRON_HALF };
  return { top, apex, bot };
}

/** @param {{ x: number, y: number }} apex @param {{ x: number, y: number }} approachDir */
export function solidInputTrianglePoints(apex, approachDir) {
  const { top, bot } = openChevronPaths(apex, approachDir);
  return [apex, top, bot];
}