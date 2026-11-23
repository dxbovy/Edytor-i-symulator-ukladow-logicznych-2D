import { projectState, subscribe } from "../state/projectState.js";
import { getPinWorldPosition } from "./pinPositions.js";
import {
  getPinFaceOutward,
  manhattanWirePath,
  outputChevronTip,
  WIRE_STUB,
} from "./pinGeometry.js";

const NS = "http://www.w3.org/2000/svg";
const WIRE_STROKE = "#000000";

/** 1 = zielony, 0 = kolor konturu (zależny od motywu), brak sygnału = szary */
function wireStroke(state) {
  if (state === 1) return "var(--wire-on)";
  if (state === 0) return "var(--node-stroke)";
  return "var(--wire-unknown)";
}

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

function previewPathLoose(fromNode, fromPin, tx, ty) {
  const apex = getPinWorldPosition(fromNode, fromPin);
  const face = getPinFaceOutward(fromNode, fromPin);
  const tip = outputChevronTip(apex, face);
  const stub = {
    x: tip.x + face.x * WIRE_STUB,
    y: tip.y + face.y * WIRE_STUB,
  };
  const horizontal = Math.abs(face.x) >= Math.abs(face.y);
  if (horizontal) {
    return `M ${tip.x} ${tip.y} L ${stub.x} ${stub.y} L ${stub.x} ${ty} L ${tx} ${ty}`;
  }
  return `M ${tip.x} ${tip.y} L ${stub.x} ${stub.y} L ${tx} ${stub.y} L ${tx} ${ty}`;
}

function previewPath(fromNode, fromPin, tx, ty, toNode, toPin) {
  if (toNode && toPin) {
    const a = getPinWorldPosition(fromNode, fromPin);
    const b = getPinWorldPosition(toNode, toPin);
    return manhattanWirePath(a, fromPin, b, toPin, fromNode, toNode);
  }
  return previewPathLoose(fromNode, fromPin, tx, ty);
}

function renderWires() {
  if (!layer) return;
  layer.replaceChildren();
   // Kable ze stanem 1 rysujemy na wierzchu, żeby zieleń nie była zasłaniana
  const wires = Object.values(projectState.wires)
    .filter((w) => projectState.nodes[w.fromNode] && projectState.nodes[w.toNode])
    .sort((p, q) => (p.state === 1) - (q.state === 1));
  for (const wire of wires) {
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
        stroke: wireStroke(wire.state),
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