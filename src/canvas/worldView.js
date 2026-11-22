import { projectState, subscribe } from "../state/projectState.js";
import { nodeSizeFor } from "./nodeSizes.js";

function worldTransformString(camera) {
  const { x, y, zoom } = camera;
  return `translate(${-x * zoom}px, ${-y * zoom}px) scale(${zoom})`;
}

function applyWorldTransform(world) {
  world.style.transformOrigin = "0 0";
  world.style.transform = worldTransformString(projectState.camera);
}

function renderNodes(world) {
  world.replaceChildren();
  for (const [id, node] of Object.entries(projectState.nodes)) {
    const { w, h } = nodeSizeFor(node.type);
    const el = document.createElement("div");
    el.dataset.nodeId = id;
    el.className =
      "absolute box-border border border-gray-400 bg-white text-[10px] text-gray-700";
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.transformOrigin = "center";
    el.style.transform = `rotate(${node.rotation}deg) scale(${node.scale})`;

    const label = document.createElement("span");
    label.className = "block px-1 pt-0.5 font-medium";
    label.textContent = node.type;
    el.appendChild(label);
    world.appendChild(el);
  }
}

export function initWorldView() {
  const root = document.getElementById("canvas-root");
  const world = document.getElementById("world");
  if (!root || !world) return;

  let nodeKey = "";
  const syncNodes = () => {
    const key = Object.keys(projectState.nodes).sort().join("\0");
    if (key === nodeKey) return;
    nodeKey = key;
    renderNodes(world);
  };

  syncNodes();
  subscribe(() => {
    applyWorldTransform(world);
    syncNodes();
  });
  applyWorldTransform(world);

  const observer = new ResizeObserver(() => applyWorldTransform(world));
  observer.observe(root);
}