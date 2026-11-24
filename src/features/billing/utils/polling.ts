import type { SubscriptionStatus } from '../types';

export const POLL_INTERVAL_MS = 5_000;
export const POLL_TIMEOUT_MS = 120_000;

export type PollState = {
  status: SubscriptionStatus | null | undefined;
  /** Instante (ms) em que o aguardo começou; `null` = não está aguardando. */
  startedAt: number | null;
  now: number;
};

export type PollPhase = 'idle' | 'waiting' | 'confirmed' | 'timed_out';

export function getPollPhase({ status, startedAt, now }: PollState): PollPhase {
  if (startedAt === null) return 'idle';
  if (status === 'active') return 'confirmed';
  if (now - startedAt >= POLL_TIMEOUT_MS) return 'timed_out';
  return 'waiting';
}

/** Valor para `refetchInterval` do React Query: 5 s enquanto aguarda, senão para. */
export function nextPollInterval(state: PollState): number | false {
  return getPollPhase(state) === 'waiting' ? POLL_INTERVAL_MS : false;
}
