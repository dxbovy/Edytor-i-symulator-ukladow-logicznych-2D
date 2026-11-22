import { attachPointerReadout } from "./coordinates.js";
import { initGrid } from "./grid.js";
import { setWorldReadout } from "../ui/canvasShell.js";

export function initCanvas() {
  attachPointerReadout(setWorldReadout);
  initGrid();
}