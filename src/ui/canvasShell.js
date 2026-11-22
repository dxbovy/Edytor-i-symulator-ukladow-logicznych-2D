import { projectState, subscribe } from "../state/projectState.js";
import { getSelectionCount, subscribeSelection } from "../interaction/selection.js";

function formatZoom(z) {
  return Number(z).toFixed(2);
}

export function mountCanvasShell(container, statusMount) {
  const main = document.createElement("main");
  main.className = "relative flex min-w-0 flex-1 flex-col";
  main.setAttribute("aria-label", "Obszar roboczy");

  const canvasRoot = document.createElement("div");
  canvasRoot.id = "canvas-root";
  canvasRoot.className = "relative flex-1 overflow-hidden";

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
    "ui-status pointer-events-none absolute bottom-3 right-4 rounded px-3 py-1.5 text-xs shadow-sm";

  const statusMain = document.createElement("span");
  statusMain.setAttribute("role", "status");
  statusMain.setAttribute("aria-live", "polite");

  const statusWorld = document.createElement("span");
  statusWorld.setAttribute("aria-live", "off");

  status.appendChild(statusMain);
  status.appendChild(statusWorld);

  let worldRx = null;
  let worldRy = null;

  function updateStatus() {
    const zoom = formatZoom(projectState.camera.zoom);
    const n = getSelectionCount();
    const line = `Powiększenie: ${zoom} · Zaznaczenie: ${n}`;
    if (statusMain.textContent !== line) statusMain.textContent = line;
  }

  /** @param {number} rx @param {number} ry */
  function setWorldReadout(rx, ry) {
    if (rx === worldRx && ry === worldRy) return;
    worldRx = rx;
    worldRy = ry;
    const worldLine = ` · Świat: ${rx}, ${ry}`;
    if (statusWorld.textContent !== worldLine) statusWorld.textContent = worldLine;
  }

  updateStatus();
  subscribe(updateStatus);
  subscribeSelection(updateStatus);
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