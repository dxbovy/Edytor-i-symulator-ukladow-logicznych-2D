import { projectState } from "../state/projectState.js";

/** @param {{ x: number, y: number, zoom: number }} camera */
export function screenToWorld(screenX, screenY, camera) {
  return {
    x: screenX / camera.zoom + camera.x,
    y: screenY / camera.zoom + camera.y,
  };
}

/** @param {{ x: number, y: number, zoom: number }} camera */
export function worldToScreen(worldX, worldY, camera) {
  return {
    x: (worldX - camera.x) * camera.zoom,
    y: (worldY - camera.y) * camera.zoom,
  };
}

/** @param {{ x: number, y: number, zoom: number }} camera */
export function getVisibleWorldBounds(camera, width, height) {
  const { x, y, zoom } = camera;
  return {
    minX: x,
    minY: y,
    maxX: x + width / zoom,
    maxY: y + height / zoom,
  };
}

export function clientToWorld(clientX, clientY) {
  const root = document.getElementById("canvas-root");
  const camera = projectState.camera;
  if (!root) return screenToWorld(0, 0, camera);
  const rect = root.getBoundingClientRect();
  const screenX = clientX - rect.left;
  const screenY = clientY - rect.top;
  return screenToWorld(screenX, screenY, camera);
}

export function attachPointerReadout(setWorldReadout) {
  const root = document.getElementById("canvas-root");
  if (!root || !setWorldReadout) return;

  let lastRx = null;
  let lastRy = null;

  root.addEventListener("pointermove", (event) => {
    const { x, y } = clientToWorld(event.clientX, event.clientY);
    const rx = Math.round(x);
    const ry = Math.round(y);
    if (rx === lastRx && ry === lastRy) return;
    lastRx = rx;
    lastRy = ry;
    setWorldReadout(rx, ry);
  });
}