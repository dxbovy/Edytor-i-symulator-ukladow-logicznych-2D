import { filledPath, symbolLabel, wire } from "./glyphSvg.js";

/** @param {SVGElement} svg */
export function drawAnd(svg) {
  svg.setAttribute("viewBox", "0 0 88 64");
  wire(svg, 0, 22, 18, 22);
  wire(svg, 0, 38, 18, 38);
  svg.appendChild(
    filledPath("M 18 12 L 18 48 L 40 48 C 66 48 66 12 40 12 Z")
  );
  wire(svg, 59.5, 30, 84, 30);
  symbolLabel(svg, "AND", 44, 52);
}