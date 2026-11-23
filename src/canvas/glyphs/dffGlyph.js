import { el, SW } from "./glyphSvg.js";

const BODY_LEFT = 22;
const BODY_W = 52;
const OUT_X = BODY_LEFT + BODY_W;
const CLK_Y = 38;

/** @param {SVGElement} svg */
export function drawDff(svg) {
  svg.setAttribute("viewBox", "0 0 96 68");
  svg.appendChild(
    el("rect", {
      x: String(BODY_LEFT),
      y: "10",
      width: String(BODY_W),
      height: "40",
      rx: "2",
      fill: "var(--node-bg)",
      stroke: "var(--node-stroke)",
      "stroke-width": String(SW),
    })
  );
  const dPin = el("text", {
    x: "26",
    y: "20",
    fill: "var(--node-stroke)",
    "font-size": "9",
    "font-weight": "600",
    "font-family": "system-ui, sans-serif",
    "pointer-events": "none",
    style: "user-select: none",
  });
  dPin.textContent = "D";
  svg.appendChild(dPin);
  svg.appendChild(
    el("path", {
      d: `M ${BODY_LEFT} 34 L 30 ${CLK_Y} L ${BODY_LEFT} 42 Z`,
      fill: "var(--node-stroke)",
      stroke: "none",
    })
  );
}