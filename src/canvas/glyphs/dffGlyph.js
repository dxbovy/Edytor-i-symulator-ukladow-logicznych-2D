import { el, FILL, hookIn, hookOut, STROKE, SW, symbolLabel } from "./glyphSvg.js";

const BODY_LEFT = 22;
const CLK_Y = 38;

/** @param {SVGElement} svg */
export function drawDff(svg) {
  svg.setAttribute("viewBox", "0 0 96 68");
  const body = el("rect", {
    x: String(BODY_LEFT),
    y: "10",
    width: "52",
    height: "40",
    rx: "2",
    fill: FILL,
    stroke: STROKE,
    "stroke-width": String(SW),
  });
  svg.appendChild(body);
  hookIn(svg, 0, 22);
  hookIn(svg, 0, CLK_Y);
  const dPin = el("text", {
    x: "26",
    y: "20",
    fill: STROKE,
    "font-size": "9",
    "font-family": "system-ui, sans-serif",
    "pointer-events": "none",
    style: "user-select: none",
  });
  dPin.textContent = "D";
  svg.appendChild(dPin);
  hookOut(svg, 74, 30);
  svg.appendChild(
    el("path", {
      d: `M ${BODY_LEFT} 34 L 30 ${CLK_Y} L ${BODY_LEFT} 42 Z`,
      fill: STROKE,
      stroke: "none",
    })
  );
  symbolLabel(svg, "DFF", 48, 54);
}