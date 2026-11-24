import type { GateError } from '../utils/gating';

type Listener = () => void;

let current: GateError | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

/** Store mínimo do 403 de gating (alimentado pelo QueryCache/MutationCache). */
export const gateStore = {
  show(gate: GateError) {
    current = gate;
    emit();
  },
  dismiss() {
    current = null;
    emit();
  },
  get: () => current,
  getServer: () => null,
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
