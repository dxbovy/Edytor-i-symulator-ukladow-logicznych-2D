import { projectState, subscribe } from "../state/projectState.js";
import { getPinWorldPosition } from "./pinPositions.js";

const NS = "http://www.w3.org/2000/svg";
const WIRE_STROKE = "#000000";

/** @type {{ fromNode: string, fromPin: string, x: number, y: number } | null} */
let dragPreview = null;

export function setWireDragPreview(preview) {
  dragPreview = preview;
  renderWires();
}

/** Krzywa typu Blueprint / Simulink — czarna linia. */
function splinePath(x1, y1, x2, y2) {
  const dx = Math.max(48, Math.abs(x2 - x1) * 0.45);
  const c1x = x1 + dx;
  const c2x = x2 - dx;
  return `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
}

function el(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

/** @type {SVGSVGElement | null} */
let layer = null;

function renderWires() {
  if (!layer) return;
  layer.replaceChildren();
  for (const wire of Object.values(projectState.wires)) {
    if (
      !projectState.nodes[wire.fromNode] ||
      !projectState.nodes[wire.toNode]
    ) {
      continue;
    }
    const a = getPinWorldPosition(wire.fromNode, wire.fromPin);
    const b = getPinWorldPosition(wire.toNode, wire.toPin);
    layer.appendChild(
      el("path", {
        d: splinePath(a.x, a.y, b.x, b.y),
        fill: "none",
        stroke: WIRE_STROKE,
        "stroke-width": "2",
        "stroke-linecap": "round",
      })
    );
  }
  if (dragPreview) {
    const a = getPinWorldPosition(dragPreview.fromNode, dragPreview.fromPin);
    const b = { x: dragPreview.x, y: dragPreview.y };
    layer.appendChild(
      el("path", {
        d: splinePath(a.x, a.y, b.x, b.y),
        fill: "none",
        stroke: WIRE_STROKE,
        "stroke-width": "2",
        "stroke-dasharray": "5 4",
        "stroke-linecap": "round",
        opacity: "0.75",
      })
    );
  }
}

export function initWireRender() {
  const world = document.getElementById("world");
  if (!world) return;
  const svg = document.createElementNS(NS, "svg");
  svg.id = "wire-layer";
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("pointer-events-none", "absolute", "inset-0", "overflow-visible");
  layer = svg;
  world.appendChild(svg);
  renderWires();
  subscribe(renderWires);
}