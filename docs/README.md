# Uruchomienie edytora (krok po kroku)

Instrukcja dotyczy lokalnego uruchomienia aplikacji **Edytor i symulator układów logicznych 2D** (Vite + vanilla JS).

## Wymagania

- **Node.js** w wersji **18** lub nowszej (zalecane **20 LTS**)
- **npm** (zwykle instalowany razem z Node.js)
- Dowolna nowoczesna przeglądarka (Chrome, Firefox, Edge)

Sprawdzenie w terminalu:

```bash
node -v
npm -v
```

## 1. Wejdź do katalogu projektu

Ścieżka zależy od tego, gdzie sklonowałeś repozytorium. Przykład:

```bash
cd /ścieżka/do/Edytor-i-symulator-ukladow-logicznych-2D
```

Upewnij się, że w folderze są pliki `package.json` i `index.html`.

## 2. Zainstaluj zależności (pierwszy raz lub po `git pull`)

```bash
npm install
```

Komenda pobiera m.in. Vite i Tailwind do katalogu `node_modules/`.

## 3. Uruchom serwer deweloperski

```bash
npm run dev
```

Domyślnie Vite nasłuchuje na **http://127.0.0.1:5173/** (lub **http://localhost:5173/**).

Jeśli port **5173** jest zajęty, Vite automatycznie wybierze następny wolny (np. **5174**). W terminalu zobaczysz dokładny adres, np.:

```text
  VITE v6.x.x  ready in … ms

  ➜  Local:   http://127.0.0.1:5174/
```

### Stały port (opcjonalnie)

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

## 4. Otwórz aplikację w przeglądarce

1. Skopiuj adres **Local** z terminala (np. `http://127.0.0.1:5174/`).
2. Wklej go w pasku adresu przeglądarki.
3. Powinieneś zobaczyć siatkę canvas, pasek poleceń u góry i panel biblioteki po lewej.

Serwer musi cały czas działać w terminalu. Zatrzymanie: **Ctrl+C**.

## 5. Szybki test UI

1. W zakładce **Biblioteka** dodaj komponent **INPUT** (przełącznik) i **OUTPUT** lub **LED**.
2. Kliknij żółty przełącznik INPUT — stan zmienia się między ON i OFF.
3. Przeciągnij kabel: **pointer down** na pinie wyjścia (kółko po prawej INPUT) → przeciągnij → puść na pinie wejścia docelowego bloku.

Skróty i pełna lista poleceń: przycisk **?** (pomoc) w pasku u góry.

## Tryb produkcyjny (opcjonalnie)

Zbuduj statyczne pliki i podglądaj je bez hot-reload:

```bash
npm run build
npm run preview
```

Adres podglądu Vite wypisze w terminalu (zwykle inny port niż `dev`).

## Typowe problemy

| Problem | Co zrobić |
|--------|-----------|
| `command not found: npm` | Zainstaluj Node.js z [nodejs.org](https://nodejs.org/) lub menedżera pakietów systemu. |
| `EADDRINUSE` (port zajęty) | Użyj innego portu: `npm run dev -- --port 5175` albo zamknij proces na 5173. |
| Pusta strona / błąd w konsoli | Uruchom ponownie `npm install`, potem `npm run dev`. Sprawdź konsolę przeglądarki (F12). |
| Brak `node_modules` | W katalogu projektu wykonaj `npm install`. |

## Skrypty npm (skrót)

| Polecenie | Opis |
|-----------|------|
| `npm install` | Instalacja zależności |
| `npm run dev` | Serwer deweloperski (HMR) |
| `npm run build` | Build do `dist/` |
| `npm run preview` | Podgląd buildu produkcyjnego |

Więcej o architekturze stanu i formatach JSON: główny plik [README.md](../README.md) w katalogu projektu.