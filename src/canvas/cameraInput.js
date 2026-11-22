import { panByScreen, zoomBy } from "./camera.js";

function isEditableTarget(target) {
  if (!(target instanceof Element)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    target.isContentEditable
  );
}

export function attachCameraInput() {
  const root = document.getElementById("canvas-root");
  if (!root) return;

  root.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const rect = root.getBoundingClientRect();
      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;
      const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1;
      zoomBy(screenX, screenY, factor);
    },
    { passive: false }
  );

  let spaceArmed = false;
  let panning = false;

  window.addEventListener("keydown", (event) => {
    if (event.code !== "Space" || event.repeat) return;
    if (isEditableTarget(event.target)) return;
    event.preventDefault();
    spaceArmed = true;
    if (!panning) root.style.cursor = "grab";
  });

  window.addEventListener("keyup", (event) => {
    if (event.code !== "Space") return;
    spaceArmed = false;
    if (!panning) root.style.cursor = "";
  });

  root.addEventListener("pointerdown", (event) => {
    const middle = event.button === 1;
    const spaceLeft = event.button === 0 && spaceArmed;
    if (!middle && !spaceLeft) return;
    if (middle) event.preventDefault();
    panning = true;
    root.setPointerCapture(event.pointerId);
    root.style.cursor = "grabbing";
  });

  root.addEventListener("pointermove", (event) => {
    if (!panning) return;
    panByScreen(event.movementX, event.movementY);
  });

  const endPan = (event) => {
    if (!panning) return;
    panning = false;
    root.style.cursor = spaceArmed ? "grab" : "";
    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
  };

  root.addEventListener("pointerup", endPan);
  root.addEventListener("pointercancel", endPan);
}