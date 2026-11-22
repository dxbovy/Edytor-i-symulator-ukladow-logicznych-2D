import { el, FILL, STROKE, SW, symbolLabel } from "./glyphSvg.js";

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
      rx: "6",
      ry: "6",
      fill: FILL,
      stroke: STROKE,
      "stroke-width": String(SW),
    })
  );
  const fs = type.length > 6 ? 8 : 10;
  symbolLabel(svg, type, w / 2, h / 2 - fs / 2, fs);
}