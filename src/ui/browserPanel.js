import { projectState, subscribe } from "../state/projectState.js";
import {
  isSelected,
  selectOnly,
  subscribeSelection,
  toggle,
} from "../interaction/selection.js";
import { registerLocaleRefresh, t } from "../i18n/i18n.js";

function nodeLabel(id, node) {
  return `${node.type} · ${id}`;
}

function rowClass(selected) {
  const base = "ui-list-row w-full rounded px-2 py-1.5 text-left text-xs";
  return selected ? `${base} ui-list-row--selected` : base;
}

function renderList(ul, filter) {
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

export function mountBrowserPanel(container) {
  const aside = document.createElement("aside");
  aside.className = "ui-panel flex w-60 shrink-0 flex-col border-r";
  aside.setAttribute("data-i18n-aria", "browserPanel");

  const head = document.createElement("div");
  head.className = "border-b border-[var(--line)] px-3 py-2";
  const title = document.createElement("h2");
  title.className = "text-xs font-semibold";
  function updateTitle() {
    const n = Object.keys(projectState.nodes).length;
    title.textContent = t("objectsTitle", { n });
  }
  updateTitle();
  head.appendChild(title);

  const filterWrap = document.createElement("div");
  filterWrap.className = "border-b border-[var(--line)] px-3 py-2";
  const filter = document.createElement("input");
  filter.type = "search";
  filter.className = "ui-field w-full rounded px-2 py-1 text-xs";
  filter.setAttribute("data-i18n-placeholder", "filterPlaceholder");
  filter.setAttribute("data-i18n-aria", "filterAria");
  filterWrap.appendChild(filter);

  const ul = document.createElement("ul");
  ul.className = "flex-1 overflow-y-auto p-2";
  ul.setAttribute("role", "list");

  aside.append(head, filterWrap, ul);
  container.appendChild(aside);

  let lastFilter = "";
  const refresh = () => renderList(ul, lastFilter);

  renderList(ul, "");
  filter.addEventListener("input", () => {
    lastFilter = filter.value;
    refresh();
  });
  subscribe(() => {
    updateTitle();
    refresh();
  });
  subscribeSelection(refresh);
  registerLocaleRefresh(() => {
    updateTitle();
    refresh();
  });
}