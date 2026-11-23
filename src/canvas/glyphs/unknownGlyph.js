import { SW } from "./glyphSvg.js";
import { el } from "./glyphSvg.js";

/** @param {SVGElement} svg @param {string} type */
export function drawUnknown(svg, type) {
  const w = 72;
  const h = 48;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.appendChild(
    el("rect", {
      x: "3",
      y: "3",
      width: String(w - 6),
      height: String(h - 6),
      rx: "2",
      ry: "2",
      fill: "var(--node-bg)",
      stroke: "var(--node-stroke)",
      "stroke-width": String(SW),
    })
  );
  const fs = type.length > 6 ? 8 : 10;
  const t = el("text", {
    x: String(w / 2),
    y: String(h / 2),
    fill: "var(--node-stroke)",
    "font-weight": "600",
    "font-family": "system-ui, sans-serif",
    "font-size": String(fs),
    "text-anchor": "middle",
    "dominant-baseline": "central",
    "pointer-events": "none",
    style: "user-select: none",
  });
  t.textContent = type;
  svg.appendChild(t);
}