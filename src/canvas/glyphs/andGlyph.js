import { filledPath, hookIn, hookOut } from "./glyphSvg.js";

/** @param {SVGElement} svg */
export function drawAnd(svg) {
  svg.setAttribute("viewBox", "0 0 88 64");
  hookIn(svg, 0, 22);
  hookIn(svg, 0, 38);
  svg.appendChild(
    filledPath("M 18 12 L 18 48 L 40 48 C 66 48 66 12 40 12 Z")
  );
  hookOut(svg, 60, 30);
}