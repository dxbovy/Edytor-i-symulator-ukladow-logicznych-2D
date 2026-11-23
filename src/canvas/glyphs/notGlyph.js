import { el, filledPath, FILL, hookIn, hookOut, STROKE, SW, symbolLabel } from "./glyphSvg.js";

const TIP_X = 40;
const TIP_Y = 26;
const BUBBLE_R = 4.5;
const BUBBLE_CX = TIP_X + BUBBLE_R;
const BUBBLE_OUT_X = BUBBLE_CX + BUBBLE_R;

/** @param {SVGElement} svg */
export function drawNot(svg) {
  svg.setAttribute("viewBox", "0 0 72 58");
  hookIn(svg, 0, TIP_Y);
  svg.appendChild(filledPath(`M 8 10 L 8 42 L ${TIP_X} ${TIP_Y} Z`));
  svg.appendChild(
    el("circle", {
      cx: String(BUBBLE_CX),
      cy: String(TIP_Y),
      r: String(BUBBLE_R),
      fill: FILL,
      stroke: STROKE,
      "stroke-width": String(SW),
    })
  );
  hookOut(svg, BUBBLE_OUT_X, TIP_Y);
  symbolLabel(svg, "NOT", 36, 46);
}