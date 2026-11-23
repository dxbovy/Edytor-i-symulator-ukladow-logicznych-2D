# Pull request — Edytor i symulator układów logicznych 2D

Opis zmian względem wymagań projektu (`docs/ez2.pdf`).

## Co zrobiono

Zgodnie z wymaganiami projektu **Edytor i symulator układów logicznych 2D** (`docs/ez2.pdf`):

- **Szkielet aplikacji (Onshape-like):** pasek poleceń, panel po lewej (obiekty / biblioteka), canvas z siatką kropkową, kamera (pan, zoom), zaznaczanie, przeciąganie ze snappem, obrót i skala.
- **Biblioteka komponentów:** `Input`, `Output` na górze listy oraz bramki `AND`, `OR`, `NOT`, `XOR`, `DFF`, `LED`; dodawanie do widoku w centrum z unikaniem nakładania.
- **Blok INPUT:** żółty przełącznik ON/OFF (klik), sygnał na wyjściu, przesuwanie bloczka; **OUTPUT** — podświetlenie przy sygnale `1`.
- **Wizual MATLAB/Simulink:** białe klocki (`--node-bg`), obrys (`--node-stroke`), cień; etykiety typów poziomo pod AABB (bez obrotu z symbolem).
- **Porty w warstwie świata:** chevron `>` na zewnątrz konturu (wejścia do środka, wyjścia na zewnątrz); po podłączeniu wejścia — **wypełniony trójkąt**; hover wejść przy przeciąganiu: `#38BDF8`.
- **Połączenia (kable):** przeciąganie z wyjścia, odpinanie z wejścia, podmiana na zajętym pinie, undo/redo; routing **Manhattan** ze stubem 18 px; **start przewodu z czubka** chevrona wyjścia.
- **Motywy i i18n:** jasny / ciemny / wysoki kontrast (localStorage); PL/EN; pasek: ikony widoku i edycji, teksty motywów i języków.
- **Stan projektu:** `projectState` (węzły, `wires`, kamera) — pod dalszy silnik symulacji (MVP podłączeń, bez pełnej ewaluacji bramek).

## Jak sprawdzić

1. W katalogu projektu: `npm install`, potem `npm run dev` (adres z terminala, np. `http://127.0.0.1:5173/`).
2. **Biblioteka:** dodaj `Input` i `Output`, potem `AND` i `NOT`; sprawdź, że wszystkie da się przesuwać (INPUT — przeciąganie poza toggle).
3. **INPUT:** kliknij przełącznik ON/OFF; bloczek żółty tylko przy ON.
4. **Kable:** z wyjścia INPUT przeciągnij na wejście `NOT` / `OUTPUT` — ortogonalna trasa, start z **czubka** `>` wyjścia; na wejściu po podłączeniu trójkąt zamiast otwartego `>`.
5. **Odpinanie:** przeciągnij z **podłączonego wejścia** w pusto — rozłączenie; Ctrl+Z cofa.
6. **Podmiana:** podłącz drugi kabel na ten sam pin wejścia — stary znika, undo przywraca poprzedni stan.
7. **Hover:** przy przeciąganiu najedź na wolne wejście — niebieski port.
8. **Obrót:** zaznacz bramkę, obróć 90° (ikona / uchwyt); etykieta (`AND`, itd.) pozostaje pozioma pod bloczkiem.
9. **Motyw/język:** przełącz motywy i PL/EN; glify i widżety respektują `--node-bg` / `--node-stroke`.
10. Pomoc `?` — skróty; build: `npm run build` (bez błędów).

## Lista kontrolna

- [ ] Aplikacja uruchamia się (`npm run dev`) i ładuje canvas z siatką
- [ ] Z biblioteki dodają się `Input`, `Output` i bramki logiczne
- [ ] INPUT przełącza ON/OFF i da się go przesuwać
- [ ] OUTPUT reaguje wizualnie na sygnał z kabla
- [ ] Połączenie wyjście → wejście działa; kabel ortogonalny; start od czubka wyjścia
- [ ] Odpinanie z wejścia i undo/redo kabli działają
- [ ] Podłączone wejście: trójkąt; wolne: chevron `>`
- [ ] Hover wejścia przy przeciąganiu (`#38BDF8`)
- [ ] Porty nie wchodzą w wnętrze symbolu przy obrocie 0° / 90° / 180° / 270°
- [ ] Etykiety typów poziome pod bloczkiem po obrocie
- [ ] Motywy i PL/EN działają; `npm run build` przechodzi