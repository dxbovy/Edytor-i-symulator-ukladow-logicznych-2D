import { notify, setPreNotifyHook } from '../state/projectState.js';
import { runSimulation } from './simulate.js';

export { runSimulation };

/**
 * Podpina symulację pod notify(): przed każdym odświeżeniem widoku stan
 * sygnałów jest przeliczany więc renderery zawsze widzą aktualne wartości
 * (i nie ma pętli notify -> symulacja -> notify)
 */

export function initSimulation() {
	setPreNotifyHook(runSimulation);
	notify();
}
