import { undo, redo, canUndo, canRedo, subscribeHistory } from "../history/history.js";
import {
  copySelection,
  pasteSelection,
  deleteSelection,
  isClipboardEmpty,
  rotateSelection90WithHistory,
} from "../interaction/editCommands.js";
import { getSelectionCount, subscribeSelection } from "../interaction/selection.js";
import { subscribeClipboard } from "../clipboard/clipboard.js";

const BTN_CLASS = "ui-btn disabled:cursor-not-allowed disabled:opacity-50";

function cmdBtn(label) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  b.setAttribute("aria-label", label);
  b.className = BTN_CLASS;
  return b;
}

/** @returns {HTMLElement} */
export function mountEditToolbar() {
  const editGroup = document.createElement("div");
  editGroup.className = "ml-2 flex flex-wrap gap-1";
  editGroup.setAttribute("role", "group");
  editGroup.setAttribute("aria-label", "Edycja");

  const undoBtn = cmdBtn("Cofnij Ctrl+Z");
  const redoBtn = cmdBtn("Ponów Ctrl+Shift+Z");
  const copyBtn = cmdBtn("Kopiuj Ctrl+C");
  const pasteBtn = cmdBtn("Wklej Ctrl+V");
  const delBtn = cmdBtn("Usuń Delete");
  const rotateBtn = cmdBtn("Obrót 90°");
  rotateBtn.id = "rotate-90-btn";
  rotateBtn.setAttribute("aria-label", "Obróć zaznaczenie o 90 stopni");

  undoBtn.addEventListener("click", () => undo());
  redoBtn.addEventListener("click", () => redo());
  copyBtn.addEventListener("click", () => copySelection());
  pasteBtn.addEventListener("click", () => pasteSelection());
  delBtn.addEventListener("click", () => deleteSelection());
  rotateBtn.addEventListener("click", () => rotateSelection90WithHistory());

  const sync = () => {
    const n = getSelectionCount();
    undoBtn.disabled = !canUndo();
    redoBtn.disabled = !canRedo();
    copyBtn.disabled = n === 0;
    pasteBtn.disabled = isClipboardEmpty();
    delBtn.disabled = n === 0;
    rotateBtn.disabled = n === 0;
    rotateBtn.title =
      n === 0 ? "Zaznacz obiekt, aby obrócić" : "Obróć zaznaczenie o 90 stopni";
  };
  sync();
  subscribeSelection(sync);
  subscribeHistory(sync);
  subscribeClipboard(sync);

  editGroup.append(undoBtn, redoBtn, copyBtn, pasteBtn, delBtn, rotateBtn);
  return editGroup;
}