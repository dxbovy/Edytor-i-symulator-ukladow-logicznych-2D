import { projectState, subscribe } from "../state/projectState.js";
import { nodeSizeFor } from "./nodeSizes.js";
import { createGateGlyph } from "./gateGlyph.js";
import { createInputWidget } from "./widgets/inputWidget.js";
import { createOutputWidget } from "./widgets/outputWidget.js";
import {
  isSelected,
  subscribeSelection,
} from "../interaction/selection.js";

const SELECTED_OUTLINE = "2px solid var(--selection)";

/** @type {Record<string, string>} */
const NODE_LABELS = {
  INPUT: "Input",
  OUTPUT: "Output",
  AND: "AND",
  OR: "OR",
  NOT: "NOT",
  XOR: "XOR",
  DFF: "DFF",
  LED: "LED",
};

function worldTransformString(camera) {
  const { x, y, zoom } = camera;
  return `translate(${-x * zoom}px, ${-y * zoom}px) scale(${zoom})`;
}

function applyWorldTransform(world) {
  world.style.transformOrigin = "0 0";
  world.style.transform = worldTransformString(projectState.camera);
}

/** Etykieta pod osiowym bbox po obrocie — zawsze poziomo, wyśrodkowana. */
function layoutNodeLabel(el, node, w, h) {
  const label = el.querySelector("[data-node-label]");
  if (!label) return;
  const scale = node.scale ?? 1;
  const angle = ((node.rotation % 360) + 360) % 360;
  const rotatedHeight = angle % 180 === 0 ? h * scale : w * scale;
  const cx = w / 2;
  const cy = h / 2;
  label.style.left = `${cx}px`;
  label.style.top = `${cy + rotatedHeight / 2 + 8}px`;
  label.style.transform = "translateX(-50%)";
  label.textContent = NODE_LABELS[node.type] ?? node.type;
}

function styleNodeEl(el, id, node) {
  const { w, h } = nodeSizeFor(node.type);
  el.style.left = `${node.x}px`;
  el.style.top = `${node.y}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  const rotator = el.querySelector("[data-node-rotator]");
  if (rotator) {
    rotator.style.transformOrigin = "center center";
    rotator.style.transform = `rotate(${node.rotation}deg) scale(${node.scale})`;
    if (isSelected(id)) {
      rotator.style.outline = SELECTED_OUTLINE;
      rotator.style.outlineOffset = "1px";
    } else {
      rotator.style.outline = "";
      rotator.style.outlineOffset = "";
    }
  }
  el.style.outline = "";
  el.style.outlineOffset = "";
  layoutNodeLabel(el, node, w, h);
}

/** @param {HTMLElement} rotator */
function setGlyph(rotator, id, node) {
  const { type } = node;
  if (type === "INPUT") {
    createInputWidget(rotator, node, id);
    return;
  }
  if (type === "OUTPUT") {
    createOutputWidget(rotator, node);
    return;
  }
  let slot = rotator.querySelector("[data-gate-glyph]");
  if (!slot) {
    rotator.replaceChildren();
    slot = document.createElement("div");
    slot.dataset.gateGlyph = "1";
    slot.className = "h-full w-full overflow-visible";
    rotator.appendChild(slot);
  }
  if (type === "LED") {
    slot.dataset.powered = node.inputStates.in_A === 1 ? "1" : "0";
  }
  const ver = "ports5";
  if (slot.dataset.nodeType === type && slot.dataset.glyphVer === ver) return;
  slot.dataset.nodeType = type;
  slot.dataset.glyphVer = ver;
  slot.replaceChildren(createGateGlyph(type));
}

function createNodeEl(id, node) {
  const { w, h } = nodeSizeFor(node.type);
  const el = document.createElement("div");
  el.dataset.nodeId = id;
  el.className = "ui-node absolute box-border overflow-visible";
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;

  const rotator = document.createElement("div");
  rotator.dataset.nodeRotator = "1";
  rotator.className = "absolute inset-0 overflow-visible";

  const label = document.createElement("span");
  label.dataset.nodeLabel = "1";
  label.className = "ui-node-label";

  el.append(rotator, label);
  setGlyph(rotator, id, node);
  styleNodeEl(el, id, node);
  return el;
}

function syncNodeStructure(world) {
  const ids = new Set(Object.keys(projectState.nodes));
  for (const el of world.querySelectorAll("[data-node-id]")) {
    if (!ids.has(el.dataset.nodeId)) el.remove();
  }
  for (const [id, node] of Object.entries(projectState.nodes)) {
    let el = world.querySelector(`[data-node-id="${id}"]`);
    if (!el) {
      el = createNodeEl(id, node);
      world.appendChild(el);
    }
  }
}

function syncNodeLayout(world) {
  for (const [id, node] of Object.entries(projectState.nodes)) {
    const el = world.querySelector(`[data-node-id="${id}"]`);
    if (!el) continue;
    let rotator = el.querySelector("[data-node-rotator]");
    if (!rotator) {
      const fresh = createNodeEl(id, node);
      el.replaceWith(fresh);
      continue;
    }
    setGlyph(rotator, id, node);
    styleNodeEl(el, id, node);
  }
}

export function initWorldView() {
  const root = document.getElementById("canvas-root");
  const world = document.getElementById("world");
  if (!root || !world) return;

  let nodeKey = "";
  const syncStructureIfNeeded = () => {
    const key = Object.keys(projectState.nodes).sort().join("\0");
    if (key === nodeKey) return;
    nodeKey = key;
    syncNodeStructure(world);
  };

  syncStructureIfNeeded();
  syncNodeLayout(world);

  subscribe(() => {
    applyWorldTransform(world);
    syncStructureIfNeeded();
    syncNodeLayout(world);
  });
  subscribeSelection(() => syncNodeLayout(world));
  applyWorldTransform(world);

  const observer = new ResizeObserver(() => applyWorldTransform(world));
  observer.observe(root);
}