import { el, filledPath, SW } from "./glyphSvg.js";

/** @param {SVGElement} svg */
export function drawXor(svg) {
  svg.setAttribute("viewBox", "0 0 92 64");
  svg.appendChild(
    el("path", {
      d: "M 6 10 Q 18 30 6 50",
      fill: "none",
      stroke: "var(--node-stroke)",
      "stroke-width": String(SW),
      "stroke-linecap": "round",
    })
  );
  svg.appendChild(
    filledPath(
      "M 16 10 Q 36 30 16 50 Q 46 50 76 30 Q 46 10 16 10 Z"
    )
  );
}