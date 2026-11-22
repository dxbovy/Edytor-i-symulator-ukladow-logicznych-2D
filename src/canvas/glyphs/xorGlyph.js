import { el, filledPath, STROKE, SW, symbolLabel, wire } from "./glyphSvg.js";

const BACK_X_22 = 24.4;
const BACK_X_38 = 24.4;

/** @param {SVGElement} svg */
export function drawXor(svg) {
  svg.setAttribute("viewBox", "0 0 92 64");
  svg.appendChild(
    el("path", {
      d: "M 6 10 Q 18 30 6 50",
      fill: "none",
      stroke: STROKE,
      "stroke-width": String(SW),
      "stroke-linecap": "round",
    })
  );
  wire(svg, 0, 22, BACK_X_22, 22);
  wire(svg, 0, 38, BACK_X_38, 38);
  svg.appendChild(
    filledPath(
      "M 16 10 Q 36 30 16 50 Q 46 50 76 30 Q 46 10 16 10 Z"
    )
  );
  wire(svg, 76, 30, 86, 30);
  symbolLabel(svg, "XOR", 46, 52);
}