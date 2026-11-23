/** @param {string} name */
export function iconSvg(name) {
  const common = 'class="h-4 w-4" aria-hidden="true" focusable="false"';
  const icons = {
    fit: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>`,
    zoomIn: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M11 8v6M8 11h6"/></svg>`,
    zoomOut: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M8 11h6"/></svg>`,
    undo: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 7H5v4"/><path d="M5 11a7 7 0 1 1 2 5"/></svg>`,
    redo: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 7h4v4"/><path d="M19 11a7 7 0 1 0-2 5"/></svg>`,
    copy: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="1"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`,
    paste: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>`,
    delete: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M9 7V5h6v2M10 11v5M14 11v5M6 7l1 12h10l1-12"/></svg>`,
    rotate: `<svg ${common} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-7.5 4"/><path d="M3 4v5h5"/><path d="M12 7v5l3-2"/></svg>`,
  };
  return icons[name] ?? "";
}