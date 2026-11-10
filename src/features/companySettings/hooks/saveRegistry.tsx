'use client';

import {
  createContext,
  use,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

type Entry = { isDirty: boolean; isSaving: boolean; submit: () => Promise<void> };
type Snapshot = { dirtyCount: number; isSaving: boolean };

/**
 * Registro dos formulários da aba aberta. O botão "Salvar alterações" do cabeçalho
 * envia todos os formulários alterados (cada um no seu endpoint).
 */
class SaveRegistry {
  private readonly entries = new Map<string, Entry>();
  private readonly listeners = new Set<() => void>();
  private snapshot: Snapshot = { dirtyCount: 0, isSaving: false };

  set(id: string, entry: Entry) {
    this.entries.set(id, entry);
    this.emit();
  }

  remove(id: string) {
    this.entries.delete(id);
    this.emit();
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.snapshot;

  async submitDirty() {
    const dirty = [...this.entries.values()].filter((entry) => entry.isDirty);
    await Promise.allSettled(dirty.map((entry) => entry.submit()));
  }

  private emit() {
    let dirtyCount = 0;
    let isSaving = false;
    for (const entry of this.entries.values()) {
      if (entry.isDirty) dirtyCount += 1;
      if (entry.isSaving) isSaving = true;
    }
    if (dirtyCount === this.snapshot.dirtyCount && isSaving === this.snapshot.isSaving) return;
    this.snapshot = { dirtyCount, isSaving };
    for (const listener of this.listeners) listener();
  }
}

const SaveRegistryContext = createContext<SaveRegistry | null>(null);

export function SaveRegistryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [registry] = useState(() => new SaveRegistry());
  return <SaveRegistryContext value={registry}>{children}</SaveRegistryContext>;
}

function useRegistry(): SaveRegistry {
  const registry = use(SaveRegistryContext);
  if (!registry) throw new Error('SaveRegistryProvider ausente');
  return registry;
}

export function useSaveRegistryState() {
  const registry = useRegistry();
  const snapshot = useSyncExternalStore(
    registry.subscribe,
    registry.getSnapshot,
    registry.getSnapshot,
  );
  return { ...snapshot, submitDirty: () => registry.submitDirty() };
}

/** Registra um formulário editável enquanto ele estiver montado. */
export function useRegisterForm(
  id: string,
  state: { isDirty: boolean; isSaving: boolean; submit: () => Promise<void> },
) {
  const registry = useRegistry();
  const submitRef = useRef(state.submit);
  useLayoutEffect(() => {
    submitRef.current = state.submit;
  });

  useEffect(() => {
    registry.set(id, {
      isDirty: state.isDirty,
      isSaving: state.isSaving,
      submit: () => submitRef.current(),
    });
  }, [registry, id, state.isDirty, state.isSaving]);

  useEffect(() => () => registry.remove(id), [registry, id]);
}
