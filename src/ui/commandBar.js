import { fitToNodes, zoomBy } from "../canvas/camera.js";
import { mountEditToolbar } from "./editToolbar.js";
import { mountHelpPanel } from "./helpPanel.js";
import { iconSvg } from "./toolbarIcons.js";

const BTN_CLASS = "ui-btn";
const ICON_BTN_CLASS = "ui-btn ui-icon-btn";

function langBtn(labelKey, ariaKey, localeId) {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.localeToggle = localeId;
  b.setAttribute("data-i18n", labelKey);
  b.setAttribute("data-i18n-aria", ariaKey);
  b.setAttribute("data-i18n-title", ariaKey);
  b.className = BTN_CLASS;
  return b;
}

function themeBtn(labelKey, ariaKey, themeId) {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.themeToggle = themeId;
  b.setAttribute("data-i18n", labelKey);
  b.setAttribute("data-i18n-aria", ariaKey);
  b.setAttribute("data-i18n-title", ariaKey);
  b.className = "ui-btn ui-theme-btn";
  return b;
}

function viewIconBtn(iconName, ariaKey, titleKey, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.innerHTML = iconSvg(iconName);
  b.setAttribute("data-i18n-aria", ariaKey);
  b.setAttribute("data-i18n-title", titleKey);
  b.className = ICON_BTN_CLASS;
  b.addEventListener("click", onClick);
  return b;
}

function canvasCenter() {
  const root = document.getElementById("canvas-root");
  if (!root) return { x: 0, y: 0, w: 0, h: 0 };
  return {
    x: root.clientWidth / 2,
    y: root.clientHeight / 2,
    w: root.clientWidth,
    h: root.clientHeight,
  };
}

export function mountCommandBar(container) {
  const bar = document.createElement("header");
  bar.className =
    "ui-chrome-bar relative flex h-10 shrink-0 items-center gap-2 border-b px-3";
  bar.setAttribute("role", "toolbar");
  bar.setAttribute("data-i18n-aria", "commandBar");

  const brand = document.createElement("span");
  brand.className = "mr-2 font-semibold";
  brand.setAttribute("data-i18n", "brand");

  const viewGroup = document.createElement("div");
  viewGroup.className = "flex gap-1";
  viewGroup.setAttribute("role", "group");
  viewGroup.setAttribute("data-i18n-aria", "groupView");
  viewGroup.append(
    viewIconBtn("fit", "fitView", "fitView", () => {
      const { w, h } = canvasCenter();
      fitToNodes(w, h);
    }),
    viewIconBtn("zoomIn", "zoomInAria", "zoomInAria", () => {
      const { x, y } = canvasCenter();
      zoomBy(x, y, 1.1);
    }),
    viewIconBtn("zoomOut", "zoomOutAria", "zoomOutAria", () => {
      const { x, y } = canvasCenter();
      zoomBy(x, y, 1 / 1.1);
    })
  );

  const themeGroup = document.createElement("div");
  themeGroup.className = "ml-auto flex gap-1";
  themeGroup.setAttribute("role", "group");
  themeGroup.setAttribute("data-i18n-aria", "groupTheme");
  themeGroup.append(
    themeBtn("themeLight", "themeLightAria", "light"),
    themeBtn("themeDark", "themeDarkAria", "dark"),
    themeBtn("themeHighContrast", "themeHighContrastAria", "high-contrast")
  );

  const langGroup = document.createElement("div");
  langGroup.className = "flex gap-1";
  langGroup.setAttribute("role", "group");
  langGroup.setAttribute("data-i18n-aria", "groupLanguage");
  langGroup.append(
    langBtn("langPl", "langPlAria", "pl"),
    langBtn("langEn", "langEnAria", "en")
  );

  const helpBtn = mountHelpPanel(bar);
  langGroup.appendChild(helpBtn);

  bar.append(brand, viewGroup, mountEditToolbar(), themeGroup, langGroup);
  container.appendChild(bar);
}