import { getApiBaseUrl } from './apiUrl';

/**
 * Refresh do JWT no servidor (BFF e proxy). O token mora num cookie httpOnly,
 * então o browser nunca chama a API de refresh diretamente.
 *
 * A API invalida o token antigo no refresh e não tem tolerância
 * (`JWT_BLACKLIST_GRACE_PERIOD = 0`): dois refreshes com o mesmo token fazem o
 * segundo falhar. Por isso:
 *  - single-flight: requests concorrentes com o mesmo token compartilham a mesma promise (a "fila");
 *  - o resultado fica guardado por um tempo curto, para requests atrasados que
 *    ainda chegaram com o cookie antigo receberem o token novo.
 *
 * Limitação: o cache é por processo. Com várias instâncias do Next, vale ligar um
 * grace period curto na API (ver entrega da Fase 1).
 */

/** `rejected`: a API recusou (sessão encerrada). `unavailable`: rede ou 5xx, a sessão continua. */
export type RefreshResult = { token: string } | 'rejected' | 'unavailable';

type RefreshFn = (token: string) => Promise<RefreshResult>;

const RESULT_TTL_MS = 60_000;

const inFlight = new Map<string, Promise<RefreshResult>>();
const recent = new Map<string, { token: string; expiresAt: number }>();

async function callApiRefresh(token: string): Promise<RefreshResult> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 401 || response.status === 403) return 'rejected';
    if (!response.ok) return 'unavailable';
    const body = (await response.json()) as { response?: { token?: unknown } };
    const next = body.response?.token;
    return typeof next === 'string' && next ? { token: next } : 'rejected';
  } catch {
    return 'unavailable';
  }
}

let refreshImpl: RefreshFn = callApiRefresh;

/** Só para testes: troca a chamada HTTP e limpa o estado. */
export function __setRefreshImplForTests(fn: RefreshFn | null) {
  refreshImpl = fn ?? callApiRefresh;
  inFlight.clear();
  recent.clear();
}

function pruneRecent(now: number) {
  for (const [key, value] of recent) {
    if (value.expiresAt <= now) recent.delete(key);
  }
}

/** Renova o token, compartilhando a chamada entre requests concorrentes com o mesmo token. */
export function refreshSessionToken(token: string, now = Date.now()): Promise<RefreshResult> {
  pruneRecent(now);
  const cached = recent.get(token);
  if (cached) return Promise.resolve({ token: cached.token });

  const pending = inFlight.get(token);
  if (pending) return pending;

  const promise = refreshImpl(token)
    .then((result) => {
      if (typeof result === 'object') {
        recent.set(token, { token: result.token, expiresAt: Date.now() + RESULT_TTL_MS });
      }
      return result;
    })
    .finally(() => inFlight.delete(token));
  inFlight.set(token, promise);
  return promise;
}

/** `exp` do JWT em ms, ou null. */
export function tokenExpiresAtMs(payload: Record<string, unknown> | null): number | null {
  const exp = Number(payload?.exp);
  return Number.isFinite(exp) && exp > 0 ? exp * 1000 : null;
}

/** Renova um pouco antes do vencimento para não perder o request em voo. */
export const REFRESH_SKEW_MS = 30_000;

export function shouldRefresh(payload: Record<string, unknown> | null, now = Date.now()): boolean {
  const expiresAt = tokenExpiresAtMs(payload);
  return expiresAt !== null && expiresAt - REFRESH_SKEW_MS <= now;
}
