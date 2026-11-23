import { filledPath, hookIn, hookOut, symbolLabel } from "./glyphSvg.js";

const BACK_X_22 = 22.4;
const BACK_X_38 = 22.4;

/** @param {SVGElement} svg */
export function drawOr(svg) {
  svg.setAttribute("viewBox", "0 0 88 64");
  hookIn(svg, 0, 22);
  hookIn(svg, 0, 38);
  svg.appendChild(
    filledPath(
      "M 14 10 Q 34 30 14 50 Q 44 50 74 30 Q 44 10 14 10 Z"
    )
  );
  hookOut(svg, 74, 30);
  symbolLabel(svg, "OR", 44, 52);
}