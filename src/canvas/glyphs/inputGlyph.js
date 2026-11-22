import { el, FILL, STROKE, SW, symbolLabel, wire } from "./glyphSvg.js";

const OUT_CX = 26;
const OUT_CY = 16;
const OUT_R = 4;
const FIX_CX = 12;
const FIX_CY = 38;

/** @param {SVGElement} svg */
export function drawInput(svg) {
  svg.setAttribute("viewBox", "0 0 80 58");
  const post = (cx, cy) =>
    el("circle", {
      cx: String(cx),
      cy: String(cy),
      r: String(OUT_R),
      fill: FILL,
      stroke: STROKE,
      "stroke-width": String(SW),
    });
  svg.appendChild(post(FIX_CX, FIX_CY));
  svg.appendChild(post(OUT_CX, OUT_CY));
  svg.appendChild(
    el("line", {
      x1: String(FIX_CX),
      y1: String(FIX_CY),
      x2: "20",
      y2: "10",
      stroke: STROKE,
      "stroke-width": String(SW),
      "stroke-linecap": "round",
    })
  );
  wire(svg, OUT_CX + OUT_R, OUT_CY, 68, OUT_CY);
  symbolLabel(svg, "IN", 40, 46);
}