import { projectState, subscribe } from "../state/projectState.js";
import { subscribeSelection } from "../interaction/selection.js";
import { applyI18nDom, registerLocaleRefresh, t } from "../i18n/i18n.js";
import { renderObjectList } from "./browserObjectList.js";
import { mountLibraryPanel } from "./browserLibrary.js";

const TAB_BTN =
  "ui-btn flex-1 rounded-t px-2 py-1.5 text-xs font-medium";

function setTab(active, objectsBtn, libraryBtn, objectsPanel, libraryPanel) {
  const objectsOn = active === "objects";
  objectsBtn.setAttribute("aria-selected", objectsOn ? "true" : "false");
  libraryBtn.setAttribute("aria-selected", objectsOn ? "false" : "true");
  objectsPanel.hidden = !objectsOn;
  libraryPanel.hidden = objectsOn;
}

export function mountBrowserPanel(container) {
  const aside = document.createElement("aside");
  aside.className = "ui-panel flex w-60 shrink-0 flex-col border-r";
  aside.setAttribute("data-i18n-aria", "browserPanel");

  const tabBar = document.createElement("div");
  tabBar.className = "flex border-b border-[var(--line)] px-2 pt-2";
  tabBar.setAttribute("role", "tablist");
  tabBar.setAttribute("aria-label", t("browserPanel"));

  const objectsBtn = document.createElement("button");
  objectsBtn.type = "button";
  objectsBtn.id = "browser-tab-objects-btn";
  objectsBtn.className = TAB_BTN;
  objectsBtn.setAttribute("role", "tab");
  objectsBtn.setAttribute("aria-controls", "browser-tab-objects");
  objectsBtn.setAttribute("data-i18n", "tabObjects");

  const libraryBtn = document.createElement("button");
  libraryBtn.type = "button";
  libraryBtn.id = "browser-tab-library-btn";
  libraryBtn.className = TAB_BTN;
  libraryBtn.setAttribute("role", "tab");
  libraryBtn.setAttribute("aria-controls", "browser-tab-library");
  libraryBtn.setAttribute("data-i18n", "tabLibrary");

  tabBar.append(objectsBtn, libraryBtn);

  const objectsPanel = document.createElement("div");
  objectsPanel.id = "browser-tab-objects";
  objectsPanel.className = "flex min-h-0 flex-1 flex-col";
  objectsPanel.setAttribute("role", "tabpanel");
  objectsPanel.setAttribute("aria-labelledby", "browser-tab-objects-btn");

  const head = document.createElement("div");
  head.className = "border-b border-[var(--line)] px-3 py-2";
  const title = document.createElement("h2");
  title.className = "text-xs font-semibold";
  function updateTitle() {
    title.textContent = t("objectsTitle", { n: Object.keys(projectState.nodes).length });
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

  objectsPanel.append(head, filterWrap, ul);

  const libraryPanel = document.createElement("div");
  const library = mountLibraryPanel(libraryPanel);

  aside.append(tabBar, objectsPanel, libraryPanel);
  container.appendChild(aside);

  setTab("objects", objectsBtn, libraryBtn, objectsPanel, libraryPanel);

  const activateObjects = () =>
    setTab("objects", objectsBtn, libraryBtn, objectsPanel, libraryPanel);
  const activateLibrary = () =>
    setTab("library", objectsBtn, libraryBtn, objectsPanel, libraryPanel);

  objectsBtn.addEventListener("click", activateObjects);
  libraryBtn.addEventListener("click", activateLibrary);

  const onTabKey = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      activateLibrary();
      libraryBtn.focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      activateObjects();
      objectsBtn.focus();
    }
  };
  objectsBtn.addEventListener("keydown", onTabKey);
  libraryBtn.addEventListener("keydown", onTabKey);

  let lastFilter = "";
  const refreshList = () => renderObjectList(ul, lastFilter);
  renderObjectList(ul, "");
  filter.addEventListener("input", () => {
    lastFilter = filter.value;
    refreshList();
  });

  const refreshChrome = () => {
    updateTitle();
    refreshList();
    library.refreshLabels();
    applyI18nDom(aside);
    objectsBtn.textContent = t("tabObjects");
    libraryBtn.textContent = t("tabLibrary");
  };

  subscribe(() => {
    updateTitle();
    refreshList();
  });
  subscribeSelection(refreshList);
  registerLocaleRefresh(refreshChrome);
  refreshChrome();
}