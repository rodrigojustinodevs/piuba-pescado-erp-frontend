'use client';

import { useCallback, useState } from 'react';
import { getPollPhase, nextPollInterval, type PollPhase } from '../utils/polling';
import { useSubscription } from './queries';

/**
 * Aguardo da confirmação do pagamento (webhook): polling de `GET /billing/subscription`
 * a cada 5 s até `active` ou ~2 min. `start()` é chamado ao abrir/voltar da página
 * de pagamento; `start()` de novo reinicia a janela.
 */
export function usePaymentConfirmation() {
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const query = useSubscription({
    refetchInterval: (data) =>
      nextPollInterval({ status: data?.status, startedAt, now: Date.now() }),
  });

  // `dataUpdatedAt` mantém o render puro: a fase só muda quando chega resposta nova.
  const phase: PollPhase = getPollPhase({
    status: query.data?.status,
    startedAt,
    now: Math.max(query.dataUpdatedAt, startedAt ?? 0),
  });

  const { refetch } = query;
  const start = useCallback(() => {
    setStartedAt(Date.now());
    void refetch();
  }, [refetch]);

  const stop = useCallback(() => setStartedAt(null), []);

  return { ...query, phase, start, stop };
}
