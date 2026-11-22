import { attachPointerReadout } from "./coordinates.js";
import { initGrid } from "./grid.js";
import { initWorldView } from "./worldView.js";
import { attachCameraInput } from "./cameraInput.js";
import { getCamera } from "./camera.js";
import { setWorldReadout } from "../ui/canvasShell.js";

export { getCamera };

export function initCanvas() {
  attachPointerReadout(setWorldReadout);
  initGrid();
  initWorldView();
  attachCameraInput();
}