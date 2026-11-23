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
import { registerLocaleRefresh, t } from "../i18n/i18n.js";
import { iconSvg } from "./toolbarIcons.js";

const BTN_CLASS = "ui-btn ui-icon-btn disabled:cursor-not-allowed disabled:opacity-50";

/** @param {string} iconName @param {string} labelKey */
function cmdIconBtn(iconName, labelKey) {
  const b = document.createElement("button");
  b.type = "button";
  b.innerHTML = iconSvg(iconName);
  b.setAttribute("data-i18n-aria", labelKey);
  b.setAttribute("data-i18n-title", labelKey);
  b.className = BTN_CLASS;
  return b;
}

/** @returns {HTMLElement} */
export function mountEditToolbar() {
  const editGroup = document.createElement("div");
  editGroup.className = "ml-2 flex flex-wrap gap-1";
  editGroup.setAttribute("role", "group");
  editGroup.setAttribute("data-i18n-aria", "groupEdit");

  const undoBtn = cmdIconBtn("undo", "undo");
  const redoBtn = cmdIconBtn("redo", "redo");
  const copyBtn = cmdIconBtn("copy", "copy");
  const pasteBtn = cmdIconBtn("paste", "paste");
  const delBtn = cmdIconBtn("delete", "delete");
  const rotateBtn = cmdIconBtn("rotate", "rotateLabel");
  rotateBtn.id = "rotate-90-btn";
  rotateBtn.setAttribute("data-i18n-aria", "rotateSelectionAria");

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
      n === 0 ? t("rotateSelectObject") : t("rotateSelectionTitle");
  };
  sync();
  registerLocaleRefresh(sync);
  subscribeSelection(sync);
  subscribeHistory(sync);
  subscribeClipboard(sync);

  editGroup.append(undoBtn, redoBtn, copyBtn, pasteBtn, delBtn, rotateBtn);
  return editGroup;
}