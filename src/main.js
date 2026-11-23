import './styles/main.css';
import './styles/help.css';
import { mountCommandBar } from './ui/commandBar.js';
import { mountBrowserPanel } from './ui/browserPanel.js';
import { mountCanvasShell } from './ui/canvasShell.js';
import { initCanvas } from './canvas/index.js';
import { initInteraction } from './interaction/index.js';
import { initHistory } from './history/index.js';
import { initSimulation } from './simulation/index.js';
import { initTheme } from './theme/index.js';
import { initI18n, initLocaleFromStorage } from './i18n/index.js';

const app = document.getElementById('app');
if (!app) throw new Error('Brak elementu #app');

initLocaleFromStorage();
mountCommandBar(app);

const bodyRow = document.createElement('div');
bodyRow.className = 'flex min-h-0 flex-1';
app.appendChild(bodyRow);

mountBrowserPanel(bodyRow);

const rightCol = document.createElement('div');
rightCol.className = 'relative flex min-w-0 flex-1 flex-col';
bodyRow.appendChild(rightCol);

mountCanvasShell(rightCol, rightCol);

initCanvas();
initSimulation();
initInteraction();
initHistory();
initTheme();
initI18n();
