import { filledPath } from "./glyphSvg.js";

/** @param {SVGElement} svg */
export function drawOr(svg) {
  svg.setAttribute("viewBox", "0 0 88 64");
  svg.appendChild(
    filledPath(
      "M 14 10 Q 34 30 14 50 Q 44 50 74 30 Q 44 10 14 10 Z"
    )
  );
}