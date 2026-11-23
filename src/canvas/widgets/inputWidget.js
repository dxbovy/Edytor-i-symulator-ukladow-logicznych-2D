import { projectState, notify } from "../../state/projectState.js";
import { syncWiresFromNode } from "../wireStore.js";
import { HOOK_OUT_SVG } from "../pinHookSvg.js";

/** @param {HTMLElement} box @param {boolean} on */
function paintToggle(box, on) {
  const track = box.querySelector("[data-input-track]");
  const knob = box.querySelector("[data-input-knob]");
  const label = box.querySelector("[data-input-label]");
  if (!track || !knob || !label) return;
  track.dataset.on = on ? "1" : "0";
  label.textContent = on ? "ON" : "OFF";
  knob.style.transform = on ? "translateX(22px)" : "translateX(0)";
  box.dataset.powered = on ? "1" : "0";
}

/**
 * @param {HTMLElement} el
 * @param {import("../../state/projectState.js").projectState["nodes"][string]} node
 * @param {string} id
 */
export function createInputWidget(el, node, id) {
  let slot = el.querySelector("[data-input-widget]");
  if (!slot) {
    slot = document.createElement("div");
    slot.dataset.inputWidget = "1";
    slot.className = "flex h-full w-full items-center justify-center";
    slot.innerHTML = `
      <div class="input-switch-box" data-input-box>
        <button type="button" class="input-switch-toggle" data-input-toggle aria-hidden="true">
          <span class="input-switch-track" data-input-track data-on="0">
            <span class="input-switch-label" data-input-label>OFF</span>
            <span class="input-switch-knob" data-input-knob></span>
          </span>
        </button>
        <span class="pin-hook pin-hook--out" data-pin-out aria-hidden="true">${HOOK_OUT_SVG}</span>
      </div>`;
    el.replaceChildren(slot);
    const toggle = slot.querySelector("[data-input-toggle]");
    toggle?.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    toggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      const n = projectState.nodes[id];
      if (!n) return;
      const next = n.outputStates.out === 1 ? 0 : 1;
      n.outputStates.out = next;
      syncWiresFromNode(id);
      const box = slot.querySelector("[data-input-box]");
      if (box) paintToggle(box, next === 1);
      notify();
    });
  }
  slot.dataset.nodeType = "INPUT";
  const on = node.outputStates.out === 1;
  const box = slot.querySelector("[data-input-box]");
  if (box) paintToggle(box, on);
}