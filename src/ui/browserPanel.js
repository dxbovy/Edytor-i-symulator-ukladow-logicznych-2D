import { projectState, subscribe } from "../state/projectState.js";
import {
  isSelected,
  selectOnly,
  subscribeSelection,
  toggle,
} from "../interaction/selection.js";

function nodeLabel(id, node) {
  return `${node.type} · ${id}`;
}

function rowClass(selected) {
  const base =
    "w-full rounded px-2 py-1.5 text-left text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700";
  if (selected) {
    return `${base} border-l-2 border-blue-700 bg-blue-50`;
  }
  return `${base} hover:bg-gray-100`;
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
    btn.setAttribute("aria-label", `Obiekt: ${nodeLabel(id, node)}`);
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
    li.className = "px-2 py-2 text-xs text-gray-500";
    li.textContent = "Brak pasujących obiektów.";
    ul.appendChild(li);
  }
}

export function mountBrowserPanel(container) {
  const aside = document.createElement("aside");
  aside.className =
    "flex w-60 shrink-0 flex-col border-r border-gray-300 bg-white";
  aside.setAttribute("aria-label", "Przeglądarka obiektów");

  const head = document.createElement("div");
  head.className = "border-b border-gray-200 px-3 py-2";
  const title = document.createElement("h2");
  title.className = "text-xs font-semibold text-gray-700";
  function updateTitle() {
    const n = Object.keys(projectState.nodes).length;
    title.textContent = `Obiekty (${n})`;
  }
  updateTitle();
  head.appendChild(title);

  const filterWrap = document.createElement("div");
  filterWrap.className = "border-b border-gray-200 px-3 py-2";
  const filter = document.createElement("input");
  filter.type = "search";
  filter.className =
    "w-full rounded border border-gray-300 px-2 py-1 text-xs";
  filter.placeholder = "Filtruj po nazwie lub typie";
  filter.setAttribute("aria-label", "Filtruj listę obiektów");
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
}