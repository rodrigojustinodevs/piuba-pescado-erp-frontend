'use client';

import { useEffect, useState } from 'react';
import { retryAfterSeconds } from '../utils/errors';

/**
 * Segundos restantes do `Retry-After` do último erro 429. O botão fica
 * desabilitado enquanto for > 0.
 */
export function useRetryCooldown(error: unknown): number {
  const seconds = retryAfterSeconds(error) ?? 0;
  const [state, setState] = useState({ error, left: seconds });

  if (state.error !== error) setState({ error, left: seconds });

  const left = state.error === error ? state.left : seconds;
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setState((s) => ({ ...s, left: s.left - 1 })), 1000);
    return () => clearTimeout(id);
  }, [left]);

  return left;
}
