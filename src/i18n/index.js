import {
  applyI18nDom,
  initLocaleFromStorage,
  setLocale,
  subscribeLocale,
  syncLocaleButtons,
} from "./i18n.js";

export { getLocale, setLocale, subscribeLocale, t } from "./i18n.js";

export function initI18n() {
  initLocaleFromStorage();
  applyI18nDom();
  syncLocaleButtons();

  document.querySelectorAll("[data-locale-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.localeToggle;
      if (id === "pl" || id === "en") setLocale(id);
    });
  });

  subscribeLocale(() => syncLocaleButtons());
}