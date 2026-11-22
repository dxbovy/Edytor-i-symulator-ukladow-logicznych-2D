import { projectState, subscribe } from "../state/projectState.js";

function formatZoom(z) {
  return Number(z).toFixed(2);
}

export function mountCanvasShell(container, statusMount) {
  const main = document.createElement("main");
  main.className = "relative flex min-w-0 flex-1 flex-col";
  main.setAttribute("aria-label", "Obszar roboczy");

  const canvasRoot = document.createElement("div");
  canvasRoot.id = "canvas-root";
  canvasRoot.className = "relative flex-1 overflow-hidden bg-[#f4f5f7]";

  const world = document.createElement("div");
  world.id = "world";
  world.className = "absolute inset-0";
  world.setAttribute("aria-hidden", "true");
  canvasRoot.appendChild(world);

  main.appendChild(canvasRoot);
  container.appendChild(main);

  const status = document.createElement("div");
  status.id = "status-region";
  status.className =
    "pointer-events-none absolute bottom-3 right-4 rounded border border-gray-300 bg-white/95 px-3 py-1.5 text-xs text-gray-800 shadow-sm";
  status.setAttribute("aria-live", "polite");
  status.setAttribute("role", "status");

  let worldRx = null;
  let worldRy = null;

  function updateStatus() {
    const zoom = formatZoom(projectState.camera.zoom);
    let line = `Powiększenie: ${zoom} · Zaznaczenie: 0`;
    if (worldRx !== null && worldRy !== null) {
      line += ` · Świat: ${worldRx}, ${worldRy}`;
    }
    if (status.textContent !== line) status.textContent = line;
  }

  /** @param {number} rx @param {number} ry */
  function setWorldReadout(rx, ry) {
    if (rx === worldRx && ry === worldRy) return;
    worldRx = rx;
    worldRy = ry;
    updateStatus();
  }

  updateStatus();
  subscribe(updateStatus);
  statusMount.appendChild(status);

  registerStatusWorldReadout(setWorldReadout);
}

let shellWorldReadout = null;

/** @param {number} rx @param {number} ry */
export function setWorldReadout(rx, ry) {
  shellWorldReadout?.(rx, ry);
}

export function registerStatusWorldReadout(fn) {
  shellWorldReadout = fn;
}