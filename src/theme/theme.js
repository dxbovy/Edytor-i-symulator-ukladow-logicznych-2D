const STORAGE_KEY = "ui-preferences";
const VALID = new Set(["light", "dark", "high-contrast"]);

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

function normalizeTheme(name) {
  return VALID.has(name) ? name : "light";
}

export function readSavedTheme() {
  return normalizeTheme(readPrefs().theme);
}

function persistTheme(name) {
  try {
    const next = { ...readPrefs(), theme: name };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

function syncThemeButtons() {
  const active = document.documentElement.dataset.theme || "light";
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    const on = btn.dataset.themeToggle === active;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

export function setTheme(name) {
  const theme = normalizeTheme(name);
  document.documentElement.dataset.theme = theme;
  persistTheme(theme);
  syncThemeButtons();
}

export function initTheme() {
  setTheme(readSavedTheme());
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => setTheme(btn.dataset.themeToggle));
  });
}