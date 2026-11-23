import { addComponent, PLACEABLE_TYPES } from "../interaction/addComponent.js";
import { t } from "../i18n/i18n.js";

/** @param {string} type */
function libraryLabel(type) {
  if (type === "INPUT") return t("addSwitch");
  if (type === "LED") return t("addLed");
  if (type === "OUTPUT") return t("addOutput");
  return type;
}

/** @param {HTMLElement} panel */
export function mountLibraryPanel(panel) {
  panel.className = "flex flex-1 flex-col gap-2 overflow-y-auto p-3";
  panel.setAttribute("role", "tabpanel");
  panel.id = "browser-tab-library";
  panel.setAttribute("aria-labelledby", "browser-tab-library-btn");

  const title = document.createElement("h3");
  title.className = "text-xs font-semibold";
  title.setAttribute("data-i18n", "libraryTitle");
  panel.appendChild(title);

  const list = document.createElement("div");
  list.className = "flex flex-col gap-1.5";

  for (const type of PLACEABLE_TYPES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ui-btn w-full rounded px-2 py-1.5 text-left text-xs";
    btn.textContent = libraryLabel(type);
    btn.setAttribute("aria-label", t("addComponentAria", { type: libraryLabel(type) }));
    btn.addEventListener("click", () => addComponent(type));
    list.appendChild(btn);
  }
  panel.appendChild(list);

  return {
    refreshLabels() {
      title.textContent = t("libraryTitle");
      let i = 0;
      for (const btn of list.querySelectorAll("button")) {
        const type = PLACEABLE_TYPES[i++];
        const label = libraryLabel(type);
        btn.textContent = label;
        btn.setAttribute("aria-label", t("addComponentAria", { type: label }));
      }
    },
  };
}