import { projectState, subscribe } from "../state/projectState.js";
import { getPinWorldPosition } from "./pinPositions.js";

const NS = "http://www.w3.org/2000/svg";
/** @type {{ fromNode: string, fromPin: string, x: number, y: number } | null} */
let dragPreview = null;

export function setWireDragPreview(preview) {
  dragPreview = preview;
  renderWires();
}

function wireStroke(state) {
  if (state === 1) return "#16a34a";
  if (state === 0) return "#dc2626";
  return "#1e293b";
}

function orthPath(x1, y1, x2, y2) {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
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
        d: orthPath(a.x, a.y, b.x, b.y),
        fill: "none",
        stroke: wireStroke(wire.state),
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      })
    );
  }
  if (dragPreview) {
    const a = getPinWorldPosition(dragPreview.fromNode, dragPreview.fromPin);
    const b = { x: dragPreview.x, y: dragPreview.y };
    layer.appendChild(
      el("path", {
        d: orthPath(a.x, a.y, b.x, b.y),
        fill: "none",
        stroke: "#1e293b",
        "stroke-width": "2",
        "stroke-dasharray": "4 3",
        "stroke-linecap": "round",
      })
    );
    for (const [nodeId, node] of Object.entries(projectState.nodes)) {
      for (const pin of Object.keys(node.inputStates)) {
        const p = getPinWorldPosition(nodeId, pin);
        layer.appendChild(
          el("circle", {
            cx: String(p.x),
            cy: String(p.y),
            r: "3",
            fill: "#2dd4bf",
            opacity: "0.45",
          })
        );
      }
    }
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