import { undo, redo, canUndo, canRedo } from "../history/history.js";
import {
  copySelection,
  pasteSelection,
  deleteSelection,
} from "./editCommands.js";

let started = false;

function editableTarget(target) {
  if (!(target instanceof Element)) return false;
  if (target.closest("input, textarea")) return true;
  const ce = target.closest("[contenteditable]");
  return Boolean(ce && ce.getAttribute("contenteditable") !== "false");
}

function isKeyZ(event) {
  return event.key.toLowerCase() === "z" || event.code === "KeyZ";
}

function onKeyDown(event) {
  if (editableTarget(event.target)) return;
  if (event.ctrlKey && isKeyZ(event) && !event.shiftKey) {
    event.preventDefault();
    if (canUndo()) undo();
    return;
  }
  if (event.ctrlKey && isKeyZ(event) && event.shiftKey) {
    event.preventDefault();
    if (canRedo()) redo();
    return;
  }
  if (event.ctrlKey && (event.key === "c" || event.key === "C")) {
    event.preventDefault();
    copySelection();
    return;
  }
  if (event.ctrlKey && (event.key === "v" || event.key === "V")) {
    event.preventDefault();
    pasteSelection();
    return;
  }
  if (event.key === "Delete") {
    event.preventDefault();
    deleteSelection();
  }
}

export function initShortcuts() {
  if (started) return;
  started = true;
  window.addEventListener("keydown", onKeyDown);
}