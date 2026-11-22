import { registerLocaleRefresh, t } from "../i18n/i18n.js";

const SHORTCUTS = [
  { labelKey: "undo", kbd: "Ctrl+Z" },
  { labelKey: "redo", kbd: "Ctrl+Shift+Z" },
  { labelKey: "copy", kbd: "Ctrl+C" },
  { labelKey: "paste", kbd: "Ctrl+V" },
  { labelKey: "delete", kbd: "Delete" },
  { labelKey: "pan", kbd: "Space" },
];

/** @param {HTMLElement} bar */
export function mountHelpPanel(bar) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "ui-btn ui-help-btn";
  btn.textContent = "?";
  btn.id = "help-toggle-btn";
  btn.setAttribute("data-i18n-aria", "helpAria");
  btn.setAttribute("aria-expanded", "false");

  const panel = document.createElement("section");
  panel.id = "help-shortcuts-panel";
  panel.className = "ui-help-panel";
  panel.setAttribute("role", "region");
  panel.hidden = true;
  panel.tabIndex = -1;
  btn.setAttribute("aria-controls", panel.id);

  const title = document.createElement("h2");
  title.setAttribute("data-i18n", "helpTitle");

  const list = document.createElement("ul");
  list.className = "ui-help-list";

  const rows = SHORTCUTS.map(() => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    const kbd = document.createElement("span");
    kbd.className = "ui-help-kbd";
    li.append(name, kbd);
    list.appendChild(li);
    return { name, kbd };
  });

  panel.append(title, list);
  bar.appendChild(panel);

  const refreshLabels = () => {
    for (let i = 0; i < SHORTCUTS.length; i++) {
      rows[i].name.textContent = t(SHORTCUTS[i].labelKey);
      rows[i].kbd.textContent = SHORTCUTS[i].kbd;
    }
  };
  refreshLabels();
  registerLocaleRefresh(refreshLabels);

  const isOpen = () => !panel.hidden;

  const close = () => {
    if (panel.hidden) return;
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  };

  const open = () => {
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    panel.focus();
  };

  const toggle = () => (isOpen() ? close() : open());

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      e.preventDefault();
      close();
    }
  });

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (!isOpen()) return;
      const target = /** @type {Node} */ (e.target);
      if (panel.contains(target) || btn.contains(target)) return;
      close();
    },
    true
  );

  return btn;
}