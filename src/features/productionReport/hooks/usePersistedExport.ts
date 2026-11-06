'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { EXPORT_STORAGE_KEY } from '../constants';

export type PersistedExport = {
  exportId: string;
  /** Assinatura dos filtros usados no POST, para bloquear duplicatas. */
  filtersKey: string;
  startedAt: number;
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  globalThis.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    globalThis.removeEventListener('storage', listener);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

function readRaw(): string | null {
  try {
    return globalThis.localStorage.getItem(EXPORT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): PersistedExport | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedExport>;
    if (parsed.exportId && typeof parsed.startedAt === 'number') {
      return {
        exportId: parsed.exportId,
        filtersKey: parsed.filtersKey ?? '',
        startedAt: parsed.startedAt,
      };
    }
  } catch {
    // JSON inválido: segue sem retomar
  }
  return null;
}

export function usePersistedExport() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const current = useMemo(() => parse(raw), [raw]);

  const save = useCallback((value: PersistedExport) => {
    try {
      globalThis.localStorage.setItem(EXPORT_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // persistência é só conveniência
    }
    notify();
  }, []);

  const clear = useCallback(() => {
    try {
      globalThis.localStorage.removeItem(EXPORT_STORAGE_KEY);
    } catch {
      // ignora
    }
    notify();
  }, []);

  return { current, save, clear };
}
