import { fitToNodes, zoomBy } from "../canvas/camera.js";
import { rotateSelection90 } from "../interaction/rotateScale.js";
import { getSelectionCount, subscribeSelection } from "../interaction/selection.js";

const LATER = "Funkcja dostępna w kolejnym kroku rozwoju.";

const BTN_CLASS =
  "rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

function disabledBtn(label, ariaLabel) {
  const b = document.createElement("button");
  b.type = "button";
  b.disabled = true;
  b.textContent = label;
  b.setAttribute("aria-label", ariaLabel);
  b.title = LATER;
  b.className = BTN_CLASS;
  return b;
}

function viewBtn(label, ariaLabel, title, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  b.setAttribute("aria-label", ariaLabel);
  b.title = title;
  b.className = BTN_CLASS;
  b.addEventListener("click", onClick);
  return b;
}

function canvasCenter() {
  const root = document.getElementById("canvas-root");
  if (!root) return { x: 0, y: 0, w: 0, h: 0 };
  return {
    x: root.clientWidth / 2,
    y: root.clientHeight / 2,
    w: root.clientWidth,
    h: root.clientHeight,
  };
}

export function mountCommandBar(container) {
  const bar = document.createElement("header");
  bar.className =
    "flex h-10 shrink-0 items-center gap-2 border-b border-gray-300 bg-[#e8e8e8] px-3";
  bar.setAttribute("role", "toolbar");
  bar.setAttribute("aria-label", "Pasek poleceń");

  const brand = document.createElement("span");
  brand.className = "mr-2 font-semibold text-gray-800";
  brand.textContent = "Układy 2D";

  const viewGroup = document.createElement("div");
  viewGroup.className = "flex gap-1";
  viewGroup.setAttribute("role", "group");
  viewGroup.setAttribute("aria-label", "Widok");
  viewGroup.append(
    viewBtn("Dopasuj", "Dopasuj widok do zawartości", "Dopasuj widok do zawartości", () => {
      const { w, h } = canvasCenter();
      fitToNodes(w, h);
    }),
    viewBtn("Zoom +", "Powiększenie o 10%", "Powiększenie o 10%", () => {
      const { x, y } = canvasCenter();
      zoomBy(x, y, 1.1);
    }),
    viewBtn("Zoom −", "Pomniejszenie o 10%", "Pomniejszenie o 10%", () => {
      const { x, y } = canvasCenter();
      zoomBy(x, y, 1 / 1.1);
    })
  );

  const editGroup = document.createElement("div");
  editGroup.className = "ml-2 flex gap-1";
  editGroup.setAttribute("role", "group");
  editGroup.setAttribute("aria-label", "Edycja");
  const rotateBtn = document.createElement("button");
  rotateBtn.type = "button";
  rotateBtn.id = "rotate-90-btn";
  rotateBtn.textContent = "Obrót 90°";
  rotateBtn.setAttribute("aria-label", "Obróć zaznaczenie o 90 stopni");
  rotateBtn.className = BTN_CLASS;
  rotateBtn.addEventListener("click", () => rotateSelection90());
  const syncRotate = () => {
    const n = getSelectionCount();
    rotateBtn.disabled = n === 0;
    rotateBtn.title =
      n === 0
        ? "Zaznacz obiekt, aby obrócić"
        : "Obróć zaznaczenie o 90 stopni";
  };
  syncRotate();
  subscribeSelection(syncRotate);
  editGroup.append(rotateBtn);

  const themeGroup = document.createElement("div");
  themeGroup.className = "ml-auto flex gap-1";
  themeGroup.setAttribute("role", "group");
  themeGroup.setAttribute("aria-label", "Motyw");
  themeGroup.append(
    disabledBtn("Jasny", "Motyw jasny"),
    disabledBtn("Ciemny", "Motyw ciemny"),
    disabledBtn("Wysoki kontrast", "Motyw wysokiego kontrastu")
  );

  const langGroup = document.createElement("div");
  langGroup.className = "flex gap-1";
  langGroup.setAttribute("role", "group");
  langGroup.setAttribute("aria-label", "Język");
  langGroup.append(
    disabledBtn("PL", "Język polski"),
    disabledBtn("EN", "Język angielski")
  );

  bar.append(brand, viewGroup, editGroup, themeGroup, langGroup);
  container.appendChild(bar);
}