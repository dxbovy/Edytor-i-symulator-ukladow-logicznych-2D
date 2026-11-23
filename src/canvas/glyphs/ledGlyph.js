import { el, filledPath, SW } from "./glyphSvg.js";

const TIP_X = 44;
const MID_Y = 26;
const BAR_X = TIP_X;

/** Strzałka emisji: równoległe promienie w górę-lewo (jak w symbolu IEC). */
function emissionArrow(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const back = 3.5;
  const wing = 2;
  const bx = x2 - ux * back;
  const by = y2 - uy * back;
  const px = -uy;
  const py = ux;
  return (
    `M ${x1} ${y1} L ${x2} ${y2} ` +
    `M ${bx + px * wing} ${by + py * wing} L ${x2} ${y2} L ${bx - px * wing} ${by - py * wing}`
  );
}

/** @param {SVGElement} svg */
export function drawLed(svg) {
  svg.setAttribute("viewBox", "0 0 92 58");
  svg.appendChild(
    filledPath(`M 14 12 L 14 40 L ${TIP_X} ${MID_Y} Z`)
  );
  svg.appendChild(
    el("line", {
      x1: String(BAR_X),
      y1: "14",
      x2: String(BAR_X),
      y2: "38",
      stroke: "var(--node-stroke)",
      "stroke-width": String(SW),
      "stroke-linecap": "round",
    })
  );
  const ray = (d) =>
    el("path", {
      d,
      fill: "none",
      stroke: "var(--node-stroke)",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });

  const edgeX = TIP_X - 14;
  const edgeY = MID_Y - 12;
  const edgeLen = Math.hypot(edgeX, edgeY);
  const ex = edgeX / edgeLen;
  const ey = edgeY / edgeLen;
  const nx = ey;
  const ny = -ex;
  const rayGap = 4;
  const rayLen = 9;

  const onSlant = (t) => ({
    x: 14 + t * edgeX,
    y: 12 + t * edgeY,
  });

  const rayFrom = (s) => {
    const x0 = s.x + nx * rayGap;
    const y0 = s.y + ny * rayGap;
    return emissionArrow(x0, y0, x0 + nx * rayLen, y0 + ny * rayLen);
  };

  svg.appendChild(ray(rayFrom(onSlant(0.36))));
  svg.appendChild(ray(rayFrom(onSlant(0.58))));
}