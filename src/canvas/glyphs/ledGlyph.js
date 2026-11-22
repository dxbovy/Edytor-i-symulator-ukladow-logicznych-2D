import { el, filledPath, STROKE, SW, symbolLabel, wire } from "./glyphSvg.js";

const TIP_X = 44;
const MID_Y = 26;
const BAR_X = TIP_X;

/** @param {SVGElement} svg */
export function drawLed(svg) {
  svg.setAttribute("viewBox", "0 0 92 58");
  wire(svg, 0, MID_Y, 14, MID_Y);
  svg.appendChild(
    filledPath(`M 14 12 L 14 40 L ${TIP_X} ${MID_Y} Z`)
  );
  svg.appendChild(
    el("line", {
      x1: String(BAR_X),
      y1: "14",
      x2: String(BAR_X),
      y2: "38",
      stroke: STROKE,
      "stroke-width": String(SW),
      "stroke-linecap": "round",
    })
  );
  wire(svg, BAR_X + SW, MID_Y, 68, MID_Y);
  const ray = (d) =>
    el("path", {
      d,
      fill: "none",
      stroke: STROKE,
      "stroke-width": "1.5",
      "stroke-linecap": "round",
    });
  svg.appendChild(ray("M 56 10 L 64 4"));
  svg.appendChild(ray("M 62 22 L 72 22"));
  symbolLabel(svg, "LED", 46, 46);
}