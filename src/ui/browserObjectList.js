import { projectState } from "../state/projectState.js";
import {
  isSelected,
  selectOnly,
  toggle,
} from "../interaction/selection.js";
import { t } from "../i18n/i18n.js";

function nodeLabel(id, node) {
  return `${node.type} · ${id}`;
}

function rowClass(selected) {
  const base = "ui-list-row w-full rounded px-2 py-1.5 text-left text-xs";
  return selected ? `${base} ui-list-row--selected` : base;
}

/** @param {HTMLUListElement} ul @param {string} filter */
export function renderObjectList(ul, filter) {
  ul.replaceChildren();
  const q = filter.trim().toLowerCase();
  const entries = Object.entries(projectState.nodes).filter(([id, node]) => {
    if (!q) return true;
    const hay = `${node.type} ${id}`.toLowerCase();
    return hay.includes(q);
  });

  for (const [id, node] of entries) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = rowClass(isSelected(id));
    btn.textContent = nodeLabel(id, node);
    btn.setAttribute("aria-label", t("objectAria", { label: nodeLabel(id, node) }));
    btn.setAttribute("aria-selected", isSelected(id) ? "true" : "false");
    btn.addEventListener("click", (event) => {
      if (event.shiftKey) toggle(id);
      else selectOnly(id);
    });
    li.appendChild(btn);
    ul.appendChild(li);
  }

  if (entries.length === 0) {
    const li = document.createElement("li");
    li.className = "ui-muted px-2 py-2 text-xs";
    li.textContent = t("emptyList");
    ul.appendChild(li);
  }
}