import { projectState } from "../state/projectState.js";
import { getPinLocalPosition, getPinWorldPosition } from "./pinPositions.js";
import { nodeSizeFor } from "./nodeSizes.js";

export const HOOK = 7;
export const CHEVRON_HALF = 5;
export const WIRE_STUB = 18;

function rotateLocal(lx, ly, rotationDeg) {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: lx * cos - ly * sin,
    y: lx * sin + ly * cos,
  };
}

/** Oś portu: prostopadły do ściany bloczka (±X lub ±Y lokalnie). */
export function getPinFaceOutward(nodeId, pinName) {
  const node = projectState.nodes[nodeId];
  if (!node) return { x: 1, y: 0 };
  const { w, h } = nodeSizeFor(node.type);
  const local = getPinLocalPosition(node, pinName);
  const cx = w / 2;
  const cy = h / 2;
  const dx = local.x - cx;
  const dy = local.y - cy;
  let lx;
  let ly;
  if (Math.abs(dx) >= Math.abs(dy)) {
    lx = dx >= 0 ? 1 : -1;
    ly = 0;
  } else {
    lx = 0;
    ly = dy >= 0 ? 1 : -1;
  }
  return rotateLocal(lx, ly, node.rotation);
}

export function getPinOutwardDir(nodeId, pinName) {
  return getPinFaceOutward(nodeId, pinName);
}

/** @deprecated alias */
export function getPinApproachDir(nodeId, pinName) {
  const f = getPinFaceOutward(nodeId, pinName);
  return { x: -f.x, y: -f.y };
}

export { getPinWorldPosition } from "./pinPositions.js";

/** Środek podstawy chevrona (gdzie wchodzi przewód). */
/** @param {{ x: number, y: number }} apex @param {{ x: number, y: number }} faceOut */
export function wireAttachAtPort(apex, faceOut) {
  return {
    x: apex.x + faceOut.x * HOOK,
    y: apex.y + faceOut.y * HOOK,
  };
}

export function wireAttachFromApproach(apex, faceOut) {
  return wireAttachAtPort(apex, faceOut);
}

/** Czubek chevrona wyjścia — stąd wychodzi przewód. */
export function outputChevronTip(apex, faceOut) {
  return {
    x: apex.x + faceOut.x * HOOK,
    y: apex.y + faceOut.y * HOOK,
  };
}

export function getOutputChevronTipWorld(nodeId, pinName) {
  const apex = getPinWorldPosition(nodeId, pinName);
  const face = getPinFaceOutward(nodeId, pinName);
  return outputChevronTip(apex, face);
}

export function wireAttachFromOutput(apex, faceOut) {
  return outputChevronTip(apex, faceOut);
}

/** @param {{ x: number, y: number }} a @param {{ x: number, y: number }} b */
function orthBetweenStubs(aStub, bStub, outFace, inFace) {
  const outHorizontal = Math.abs(outFace.x) >= Math.abs(outFace.y);
  const inHorizontal = Math.abs(inFace.x) >= Math.abs(inFace.y);
  if (outHorizontal) {
    return { x: aStub.x, y: bStub.y };
  }
  if (inHorizontal) {
    return { x: bStub.x, y: aStub.y };
  }
  return { x: aStub.x, y: bStub.y };
}

export function manhattanWirePath(
  fromApex,
  fromPin,
  toApex,
  toPin,
  fromNodeId,
  toNodeId
) {
  const outFace = getPinFaceOutward(fromNodeId, fromPin);
  const inFace = getPinFaceOutward(toNodeId, toPin);
  const outTip = outputChevronTip(fromApex, outFace);
  const aStub = {
    x: outTip.x + outFace.x * WIRE_STUB,
    y: outTip.y + outFace.y * WIRE_STUB,
  };
  const bAttach = wireAttachAtPort(toApex, inFace);
  const bStub = {
    x: bAttach.x + inFace.x * WIRE_STUB,
    y: bAttach.y + inFace.y * WIRE_STUB,
  };
  const bend = orthBetweenStubs(aStub, bStub, outFace, inFace);
  return (
    `M ${outTip.x} ${outTip.y} L ${aStub.x} ${aStub.y} ` +
    `L ${bend.x} ${bend.y} L ${bStub.x} ${bStub.y} ` +
    `L ${bAttach.x} ${bAttach.y}`
  );
}

/** Wejście: tip na konturze, skrzydła na zewnątrz wzdłuż faceOut. */
export function openChevronPaths(apex, faceOut) {
  const px = -faceOut.y;
  const py = faceOut.x;
  const wingC = {
    x: apex.x + faceOut.x * HOOK,
    y: apex.y + faceOut.y * HOOK,
  };
  const top = { x: wingC.x + px * CHEVRON_HALF, y: wingC.y + py * CHEVRON_HALF };
  const bot = { x: wingC.x - px * CHEVRON_HALF, y: wingC.y - py * CHEVRON_HALF };
  return { top, apex, bot };
}

/** Wyjście: podstawa na konturze, czubek na zewnątrz (">" od bloczka). */
export function openOutputChevronPaths(apex, faceOut) {
  const px = -faceOut.y;
  const py = faceOut.x;
  const tip = {
    x: apex.x + faceOut.x * HOOK,
    y: apex.y + faceOut.y * HOOK,
  };
  const top = { x: apex.x + px * CHEVRON_HALF, y: apex.y + py * CHEVRON_HALF };
  const bot = { x: apex.x - px * CHEVRON_HALF, y: apex.y - py * CHEVRON_HALF };
  return { top, tip, bot };
}

export function solidInputTrianglePoints(apex, faceOut) {
  const { top, bot } = openChevronPaths(apex, faceOut);
  return [apex, top, bot];
}