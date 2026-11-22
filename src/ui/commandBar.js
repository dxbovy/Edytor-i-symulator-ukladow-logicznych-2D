const LATER = "Funkcja dostępna w kolejnym kroku rozwoju.";

function disabledBtn(label, ariaLabel) {
  const b = document.createElement("button");
  b.type = "button";
  b.disabled = true;
  b.textContent = label;
  b.setAttribute("aria-label", ariaLabel);
  b.title = LATER;
  b.className =
    "rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50";
  return b;
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
    disabledBtn("Dopasuj", "Dopasuj widok do zawartości"),
    disabledBtn("Zoom +", "Powiększ"),
    disabledBtn("Zoom −", "Pomniejsz")
  );

  const editGroup = document.createElement("div");
  editGroup.className = "ml-2 flex gap-1";
  editGroup.setAttribute("role", "group");
  editGroup.setAttribute("aria-label", "Edycja");
  editGroup.append(disabledBtn("Obrót 90°", "Obróć zaznaczenie o 90 stopni"));

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