import { projectState, subscribe } from "../state/projectState.js";
import { getPinWorldPosition } from "./pinPositions.js";
import { manhattanWirePath } from "./pinGeometry.js";

const NS = "http://www.w3.org/2000/svg";
const WIRE_STROKE = "#000000";

/** @type {{ fromNode: string, fromPin: string, x: number, y: number, toNode?: string, toPin?: string } | null} */
let dragPreview = null;

export function setWireDragPreview(preview) {
  dragPreview = preview;
  renderWires();
}

function el(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

/** @type {SVGSVGElement | null} */
let layer = null;

function previewPath(fromNode, fromPin, tx, ty, toNode, toPin) {
  if (toNode && toPin) {
    const a = getPinWorldPosition(fromNode, fromPin);
    const b = getPinWorldPosition(toNode, toPin);
    return manhattanWirePath(a, fromPin, b, toPin, fromNode, toNode);
  }
  const a = getPinWorldPosition(fromNode, fromPin);
  const fake = { x: tx, y: ty };
  return `M ${a.x} ${a.y} L ${tx} ${ty}`;
}

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
        d: manhattanWirePath(
          a,
          wire.fromPin,
          b,
          wire.toPin,
          wire.fromNode,
          wire.toNode
        ),
        fill: "none",
        stroke: WIRE_STROKE,
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      })
    );
  }
  if (dragPreview) {
    const d =
      dragPreview.toNode && dragPreview.toPin
        ? previewPath(
            dragPreview.fromNode,
            dragPreview.fromPin,
            dragPreview.x,
            dragPreview.y,
            dragPreview.toNode,
            dragPreview.toPin
          )
        : previewPath(
            dragPreview.fromNode,
            dragPreview.fromPin,
            dragPreview.x,
            dragPreview.y
          );
    layer.appendChild(
      el("path", {
        d,
        fill: "none",
        stroke: WIRE_STROKE,
        "stroke-width": "2",
        "stroke-dasharray": "5 4",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
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