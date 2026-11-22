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

function onKeyDown(event) {
  if (editableTarget(event.target)) return;
  if (event.ctrlKey && event.key === "z" && !event.shiftKey) {
    if (!canUndo()) return;
    event.preventDefault();
    undo();
    return;
  }
  if (event.ctrlKey && event.key === "z" && event.shiftKey) {
    if (!canRedo()) return;
    event.preventDefault();
    redo();
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