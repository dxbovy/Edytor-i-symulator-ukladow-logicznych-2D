import { projectState, subscribe } from "../state/projectState.js";

const GRID_MINOR = 20;
const GRID_MAJOR = 100;

function gridBackgrounds(camera) {
  const { x, y, zoom } = camera;
  const minorPx = GRID_MINOR * zoom;
  const majorPx = GRID_MAJOR * zoom;
  const posX = -x * zoom;
  const posY = -y * zoom;
  const position = `${posX}px ${posY}px`;

  return {
    backgroundColor: "var(--canvas-bg)",
    backgroundImage: [
      "radial-gradient(circle at 0 0, var(--grid-major) 1.5px, transparent 1.6px)",
      "radial-gradient(circle at 0 0, var(--grid) 1px, transparent 1px)",
    ].join(", "),
    backgroundSize: `${majorPx}px ${majorPx}px, ${minorPx}px ${minorPx}px`,
    backgroundPosition: `${position}, ${position}`,
  };
}

function paintGrid(root) {
  const styles = gridBackgrounds(projectState.camera);
  root.style.backgroundColor = styles.backgroundColor;
  root.style.backgroundImage = styles.backgroundImage;
  root.style.backgroundSize = styles.backgroundSize;
  root.style.backgroundPosition = styles.backgroundPosition;
}

/** @param {HTMLElement} root */
function attachGrid(root) {
  const refresh = () => paintGrid(root);
  refresh();
  subscribe(refresh);
  const observer = new ResizeObserver(refresh);
  observer.observe(root);
}

export function initGrid() {
  const root = document.getElementById("canvas-root");
  if (!root) return;
  attachGrid(root);
}