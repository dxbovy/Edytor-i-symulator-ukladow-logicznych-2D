import { filledPath, hookIn, hookOut } from "./glyphSvg.js";

const LEFT = 14;
const OUT_X = 74;

/** @param {SVGElement} svg */
export function drawOr(svg) {
  svg.setAttribute("viewBox", "0 0 88 64");
  svg.appendChild(
    filledPath(
      "M 14 10 Q 34 30 14 50 Q 44 50 74 30 Q 44 10 14 10 Z"
    )
  );
  hookIn(svg, LEFT, 22);
  hookIn(svg, LEFT, 38);
  hookOut(svg, OUT_X, 30);
}