import { projectState, subscribe } from "../state/projectState.js";
import { nodeSizeFor } from "./nodeSizes.js";
import {
  isSelected,
  subscribeSelection,
} from "../interaction/selection.js";

const SELECTED_OUTLINE = "2px solid var(--selection)";

function worldTransformString(camera) {
  const { x, y, zoom } = camera;
  return `translate(${-x * zoom}px, ${-y * zoom}px) scale(${zoom})`;
}

function applyWorldTransform(world) {
  world.style.transformOrigin = "0 0";
  world.style.transform = worldTransformString(projectState.camera);
}

function styleNodeEl(el, id, node) {
  const { w, h } = nodeSizeFor(node.type);
  el.style.left = `${node.x}px`;
  el.style.top = `${node.y}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.style.transformOrigin = "center";
  el.style.transform = `rotate(${node.rotation}deg) scale(${node.scale})`;
  if (isSelected(id)) {
    el.style.outline = SELECTED_OUTLINE;
    el.style.outlineOffset = "1px";
  } else {
    el.style.outline = "";
    el.style.outlineOffset = "";
  }
}

function createNodeEl(id, node) {
  const { w, h } = nodeSizeFor(node.type);
  const el = document.createElement("div");
  el.dataset.nodeId = id;
  el.className = "ui-node absolute box-border text-[10px]";
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  const label = document.createElement("span");
  label.className = "block px-1 pt-0.5 font-medium";
  label.textContent = node.type;
  el.appendChild(label);
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
    if (el) styleNodeEl(el, id, node);
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