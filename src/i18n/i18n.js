import { pl } from "./locales/pl.js";
import { en } from "./locales/en.js";

const STORAGE_KEY = "ui-preferences";
const LOCALES = { pl, en };
const VALID = new Set(["pl", "en"]);

/** @type {"pl" | "en"} */
let locale = "pl";
const listeners = new Set();
/** @type {Set<() => void>} */
const refreshers = new Set();

function readPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

function normalizeLocale(id) {
  return VALID.has(id) ? /** @type {"pl" | "en"} */ (id) : "pl";
}

function readSavedLocale() {
  return normalizeLocale(readPrefs().locale);
}

function persistLocale(id) {
  try {
    const next = { ...readPrefs(), locale: id };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

function applyLangAttr() {
  document.documentElement.lang = locale;
}

function notify() {
  applyI18nDom();
  for (const fn of refreshers) fn();
  for (const fn of listeners) fn(locale);
}

/**
 * @param {string} key
 * @param {Record<string, string | number>} [vars]
 */
export function t(key, vars) {
  const dict = LOCALES[locale] || pl;
  let out = dict[key];
  if (out == null) return key;
  if (!vars) return out;
  for (const [name, val] of Object.entries(vars)) {
    out = out.replaceAll(`{${name}}`, String(val));
  }
  return out;
}

/** @returns {"pl" | "en"} */
export function getLocale() {
  return locale;
}

/** @param {"pl" | "en"} id */
export function setLocale(id) {
  const next = normalizeLocale(id);
  if (next === locale) {
    syncLocaleButtons();
    return;
  }
  locale = next;
  persistLocale(locale);
  applyLangAttr();
  notify();
}

/** @param {(loc: "pl" | "en") => void} fn */
export function subscribeLocale(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** @param {() => void} fn */
export function registerLocaleRefresh(fn) {
  refreshers.add(fn);
  return () => refreshers.delete(fn);
}

export function applyI18nDom(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key) el.setAttribute("aria-label", t(key));
  });
  root.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) el.title = t(key);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && el instanceof HTMLInputElement) el.placeholder = t(key);
  });
  root.querySelectorAll("[data-i18n-aria][data-i18n-suffix]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    const suffix = el.getAttribute("data-i18n-suffix") || "";
    if (key) el.setAttribute("aria-label", t(key) + suffix);
  });
  root.querySelectorAll("[data-i18n][data-i18n-suffix]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const suffix = el.getAttribute("data-i18n-suffix") || "";
    if (key) el.textContent = t(key) + suffix;
  });
}

export function syncLocaleButtons() {
  const active = getLocale();
  document.querySelectorAll("[data-locale-toggle]").forEach((btn) => {
    const on = btn.dataset.localeToggle === active;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

export function initLocaleFromStorage() {
  locale = readSavedLocale();
  applyLangAttr();
}