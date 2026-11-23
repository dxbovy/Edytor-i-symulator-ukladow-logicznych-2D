import { filledPath, hookIn, hookOut } from "./glyphSvg.js";

const LEFT = 18;
const OUT_X = 60;

/** @param {SVGElement} svg */
export function drawAnd(svg) {
  svg.setAttribute("viewBox", "0 0 88 64");
  svg.appendChild(
    filledPath("M 18 12 L 18 48 L 40 48 C 66 48 66 12 40 12 Z")
  );
  hookIn(svg, LEFT, 22);
  hookIn(svg, LEFT, 38);
  hookOut(svg, OUT_X, 30);
}