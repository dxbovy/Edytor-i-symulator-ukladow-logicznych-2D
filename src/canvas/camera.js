import { projectState, notify } from "../state/projectState.js";
import { screenToWorld } from "./coordinates.js";
import { nodeSizeFor } from "./nodeSizes.js";

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 3;

function clampZoom(z) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

export function getCamera() {
  return projectState.camera;
}

export function panByScreen(dx, dy) {
  const camera = projectState.camera;
  camera.x -= dx / camera.zoom;
  camera.y -= dy / camera.zoom;
  notify();
}

export function zoomAtScreen(screenX, screenY, nextZoom) {
  const camera = projectState.camera;
  const world = screenToWorld(screenX, screenY, camera);
  const clamped = clampZoom(nextZoom);
  camera.zoom = clamped;
  camera.x = world.x - screenX / camera.zoom;
  camera.y = world.y - screenY / camera.zoom;
  notify();
}

export function zoomBy(screenX, screenY, factor) {
  zoomAtScreen(screenX, screenY, projectState.camera.zoom * factor);
}

export function fitToNodes(canvasWidth, canvasHeight) {
  const entries = Object.entries(projectState.nodes);
  const camera = projectState.camera;
  if (entries.length === 0) {
    camera.x = 0;
    camera.y = 0;
    camera.zoom = 1;
    notify();
    return;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [, node] of entries) {
    const { w, h } = nodeSizeFor(node.type);
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + w);
    maxY = Math.max(maxY, node.y + h);
  }

  const contentW = maxX - minX || 1;
  const contentH = maxY - minY || 1;
  const centerWorldX = (minX + maxX) / 2;
  const centerWorldY = (minY + maxY) / 2;
  const zoom = clampZoom(
    Math.min(canvasWidth / contentW, canvasHeight / contentH) * 0.85
  );
  camera.zoom = zoom;
  camera.x = centerWorldX - canvasWidth / 2 / zoom;
  camera.y = centerWorldY - canvasHeight / 2 / zoom;
  notify();
}