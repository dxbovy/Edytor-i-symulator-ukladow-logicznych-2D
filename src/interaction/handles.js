import { subscribe } from "../state/projectState.js";
import { isViewPan } from "../canvas/cameraInput.js";
import { getSelectedIds, subscribeSelection } from "./selection.js";
import { selectionWorldBounds, boundsScreenRect } from "./geometry.js";
import { captureTransforms, transformsDiffer } from "../history/snapshots.js";
import { pushTransformCommand, rotateSelection90WithHistory } from "./editCommands.js";
import {
  beginScaleGesture,
  nudgeSelectionScale,
  updateScaleGesture,
} from "./rotateScale.js";
import { applyI18nDom, registerLocaleRefresh, t } from "../i18n/i18n.js";

const HANDLE_BTN =
  "ui-handle absolute z-20 flex items-center justify-center rounded text-sm font-semibold";

export function isSelectionHandleTarget(target) {
  return target instanceof Element && Boolean(target.closest("[data-handle]"));
}

export function initSelectionHandles() {
  const root = document.getElementById("canvas-root");
  if (!root) return;

  const rotateBtn = document.createElement("button");
  rotateBtn.type = "button";
  rotateBtn.dataset.handle = "rotate";
  rotateBtn.setAttribute("data-i18n-aria", "rotateHandleAria");
  rotateBtn.setAttribute("data-i18n-title", "rotateSelectionTitle");
  rotateBtn.textContent = "↻";
  rotateBtn.className = `${HANDLE_BTN} h-7 w-7`;

  const scaleHandle = document.createElement("div");
  scaleHandle.dataset.handle = "scale";
  scaleHandle.setAttribute("role", "button");
  scaleHandle.tabIndex = 0;
  scaleHandle.setAttribute("data-i18n-aria", "scaleHandleAria");
  scaleHandle.setAttribute("data-i18n-title", "scaleHandleTitle");
  scaleHandle.className =
    `${HANDLE_BTN} ui-handle-scale h-2.5 w-2.5 cursor-se-resize`;

  root.append(rotateBtn, scaleHandle);

  let scaleGesture = null;
  let scalePointerId = null;
  /** @type {Record<string, { x: number, y: number, rotation: number, scale: number }> | null} */
  let scaleBefore = null;

  const layout = () => {
    const ids = getSelectedIds();
    if (ids.length === 0) {
      rotateBtn.style.display = "none";
      scaleHandle.style.display = "none";
      return;
    }
    const bounds = selectionWorldBounds(ids);
    if (!bounds) {
      rotateBtn.style.display = "none";
      scaleHandle.style.display = "none";
      return;
    }
    const rect = boundsScreenRect(bounds);
    rotateBtn.style.display = "flex";
    scaleHandle.style.display = "block";
    rotateBtn.style.left = `${rect.left + rect.width / 2 - 14}px`;
    rotateBtn.style.top = `${rect.top - 32}px`;
    scaleHandle.style.left = `${rect.right - 5}px`;
    scaleHandle.style.top = `${rect.bottom - 5}px`;
  };

  rotateBtn.addEventListener("click", () => rotateSelection90WithHistory());
  rotateBtn.addEventListener("pointerdown", (e) => {
    if (isViewPan(e)) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
  });

  const onScaleDown = (event) => {
    if (isViewPan(event) || event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    scaleGesture = beginScaleGesture(event.clientX, event.clientY);
    if (!scaleGesture) return;
    scaleBefore = captureTransforms(getSelectedIds());
    scalePointerId = event.pointerId;
    scaleHandle.setPointerCapture(event.pointerId);
  };

  const onScaleMove = (event) => {
    if (scalePointerId === null || event.pointerId !== scalePointerId) return;
    if (isViewPan(event)) return;
    if (!scaleGesture) return;
    updateScaleGesture(scaleGesture, event.clientX, event.clientY);
  };

  const onScaleEnd = (event) => {
    if (scalePointerId === null || event.pointerId !== scalePointerId) return;
    const ids = getSelectedIds();
    if (scaleBefore && ids.length) {
      const after = captureTransforms(ids);
      if (transformsDiffer(scaleBefore, after)) {
        pushTransformCommand(scaleBefore, after, ids);
      }
    }
    scaleBefore = null;
    scaleGesture = null;
    scalePointerId = null;
    if (scaleHandle.hasPointerCapture(event.pointerId)) {
      scaleHandle.releasePointerCapture(event.pointerId);
    }
  };

  scaleHandle.addEventListener("pointerdown", onScaleDown);
  scaleHandle.addEventListener("pointermove", onScaleMove);
  scaleHandle.addEventListener("pointerup", onScaleEnd);
  scaleHandle.addEventListener("pointercancel", onScaleEnd);
  const nudgeWithHistory = (delta) => {
    const ids = getSelectedIds();
    if (ids.length === 0) return;
    const before = captureTransforms(ids);
    nudgeSelectionScale(delta);
    const after = captureTransforms(ids);
    if (transformsDiffer(before, after)) {
      pushTransformCommand(before, after, ids);
    }
  };

  scaleHandle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      nudgeWithHistory(0.1);
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      nudgeWithHistory(-0.1);
    }
  });

  const applyHandleLabels = () => applyI18nDom(root);
  applyHandleLabels();
  registerLocaleRefresh(applyHandleLabels);

  layout();
  subscribe(layout);
  subscribeSelection(layout);
  new ResizeObserver(layout).observe(root);
}