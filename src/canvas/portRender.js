import { projectState, subscribe } from "../state/projectState.js";
import { findWireAtInput } from "./wireStore.js";
import {
  CHEVRON_HALF,
  getPinFaceOutward,
  getPinWorldPosition,
  openChevronPaths,
  openOutputChevronPaths,
  solidInputTrianglePoints,
} from "./pinGeometry.js";

const NS = "http://www.w3.org/2000/svg";
const STROKE = "var(--node-stroke)";
const HOVER = "#38bdf8";

/** @type {{ nodeId: string, pin: string } | null} */
let hoveredInput = null;

/** @param {{ nodeId: string, pin: string } | null} pin */
export function setHoveredInputPin(pin) {
  hoveredInput = pin;
  renderPorts();
}

function el(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

const IN_PINS = new Set(["in_A", "in_B", "in_D", "in_CLK", "in"]);
const OUT_PINS = new Set(["out", "out_Q"]);

function inputConnected(nodeId, pin) {
  return !!findWireAtInput(nodeId, pin);
}

/** @type {SVGSVGElement | null} */
let layer = null;

function drawOpenChevron(apex, faceOut, stroke) {
  const { top, bot } = openChevronPaths(apex, faceOut);
  return el("path", {
    d: `M ${top.x} ${top.y} L ${apex.x} ${apex.y} L ${bot.x} ${bot.y}`,
    fill: "none",
    stroke,
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "miter",
  });
}

function drawSolidInput(apex, faceOut, fill) {
  const pts = solidInputTrianglePoints(apex, faceOut);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  return el("path", { d, fill, stroke: fill, "stroke-width": "1" });
}

function drawOutChevron(apex, faceOut, stroke) {
  const { top, tip, bot } = openOutputChevronPaths(apex, faceOut);
  return el("path", {
    d: `M ${top.x} ${top.y} L ${tip.x} ${tip.y} L ${bot.x} ${bot.y}`,
    fill: "none",
    stroke,
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "miter",
  });
}

function renderPorts() {
  if (!layer) return;
  layer.replaceChildren();
  for (const [nodeId, node] of Object.entries(projectState.nodes)) {
    for (const pin of Object.keys(node.inputStates)) {
      if (!IN_PINS.has(pin)) continue;
      const apex = getPinWorldPosition(nodeId, pin);
      const faceOut = getPinFaceOutward(nodeId, pin);
      const hover =
        hoveredInput?.nodeId === nodeId && hoveredInput?.pin === pin;
      const stroke = hover ? HOVER : STROKE;
      if (inputConnected(nodeId, pin)) {
        layer.appendChild(
          drawSolidInput(apex, faceOut, hover ? HOVER : "var(--node-stroke)")
        );
      } else {
        layer.appendChild(drawOpenChevron(apex, faceOut, stroke));
      }
    }
    for (const pin of Object.keys(node.outputStates)) {
      if (!OUT_PINS.has(pin)) continue;
      const apex = getPinWorldPosition(nodeId, pin);
      const faceOut = getPinFaceOutward(nodeId, pin);
      layer.appendChild(drawOutChevron(apex, faceOut, STROKE));
    }
  }
}

export function initPortRender() {
  const world = document.getElementById("world");
  if (!world) return;
  const svg = document.createElementNS(NS, "svg");
  svg.id = "port-layer";
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("pointer-events-none", "absolute", "inset-0", "overflow-visible");
  layer = svg;
  world.appendChild(svg);
  renderPorts();
  subscribe(renderPorts);
}