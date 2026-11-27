import { extractHttpStatus, type FieldErrors } from './httpError';

/**
 * Classificação única dos erros da API (via BFF). É a tabela "status / code → o que a
 * interface faz": as telas não olham status, quem decide é `handleApiError`.
 */

export type BillingBlock = {
  code:
    | 'TRIAL_EXPIRED'
    | 'SUBSCRIPTION_SUSPENDED'
    | 'PLAN_FEATURE_REQUIRED'
    | 'PLAN_LIMIT_REACHED'
    | 'QUOTA_EXHAUSTED';
  message: string;
  feature: string | null;
  limit: number | null;
  used: number | null;
  currentPlan: string | null;
  requiredPlan: string | null;
  resetsAt: string | null;
};

export type ApiErrorKind =
  | { kind: 'session'; message: string }
  | { kind: 'noCompany'; message: string }
  | { kind: 'companyDenied'; message: string }
  | { kind: 'forbidden'; message: string; permission: string | null }
  | { kind: 'readOnly'; block: BillingBlock }
  | { kind: 'featureRequired'; block: BillingBlock }
  | { kind: 'limitReached'; block: BillingBlock }
  | { kind: 'quotaExhausted'; block: BillingBlock }
  | { kind: 'conflict'; message: string }
  | { kind: 'validation'; message: string; fieldErrors: FieldErrors }
  | { kind: 'domain'; message: string }
  | { kind: 'rateLimited'; message: string; retryAfterSeconds: number | null }
  | { kind: 'other'; message: string; status: number | null };

type ErrorLike = {
  message?: unknown;
  code?: unknown;
  details?: Record<string, unknown>;
  fieldErrors?: FieldErrors;
  retryAfterSeconds?: unknown;
};

const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function toBlock(code: BillingBlock['code'], e: ErrorLike, message: string): BillingBlock {
  const d = e.details ?? {};
  return {
    code,
    message,
    feature: str(d.feature),
    limit: num(d.limit),
    used: num(d.used),
    currentPlan: str(d.current_plan),
    requiredPlan: str(d.required_plan),
    resetsAt: str(d.resets_at),
  };
}

export function classifyApiError(error: unknown): ApiErrorKind {
  const status = extractHttpStatus(error);
  const e = (typeof error === 'object' && error !== null ? error : {}) as ErrorLike;
  const code = str(e.code);
  const message = str(e.message) ?? '';

  switch (status) {
    case 401:
      return { kind: 'session', message };
    case 402: {
      switch (code) {
        case 'TRIAL_EXPIRED':
        case 'SUBSCRIPTION_SUSPENDED':
          return { kind: 'readOnly', block: toBlock(code, e, message) };
        case 'PLAN_LIMIT_REACHED':
          return { kind: 'limitReached', block: toBlock(code, e, message) };
        case 'QUOTA_EXHAUSTED':
          return { kind: 'quotaExhausted', block: toBlock(code, e, message) };
        default:
          // PLAN_FEATURE_REQUIRED ou 402 sem código conhecido: trata como recurso fora do plano.
          return { kind: 'featureRequired', block: toBlock('PLAN_FEATURE_REQUIRED', e, message) };
      }
    }
    case 403:
      if (code === 'NO_COMPANY_CONTEXT') return { kind: 'noCompany', message };
      if (code === 'COMPANY_ACCESS_DENIED') return { kind: 'companyDenied', message };
      return { kind: 'forbidden', message, permission: str(e.details?.permission) };
    case 409:
      return { kind: 'conflict', message };
    case 422: {
      const fieldErrors = e.fieldErrors ?? {};
      return Object.keys(fieldErrors).length
        ? { kind: 'validation', message, fieldErrors }
        : { kind: 'domain', message };
    }
    case 429:
      return { kind: 'rateLimited', message, retryAfterSeconds: num(e.retryAfterSeconds) };
    default:
      return { kind: 'other', message, status };
  }
}

/** 4xx não muda tentando de novo (exceto 408). */
export function isRetryable(error: unknown): boolean {
  const status = extractHttpStatus(error);
  if (status === null) return true;
  if (status === 408) return true;
  return status < 400 || status >= 500;
}

const GLOBAL_KINDS: ReadonlySet<ApiErrorKind['kind']> = new Set([
  'session',
  'noCompany',
  'companyDenied',
  'forbidden',
  'readOnly',
  'featureRequired',
  'limitReached',
  'quotaExhausted',
  'conflict',
]);

/**
 * O tratamento central (`handleApiError`) já mostrou toast, modal ou redirecionou.
 * Os `onError` das telas devem sair cedo para não duplicar a mensagem.
 */
export function isHandledGlobally(error: unknown): boolean {
  return GLOBAL_KINDS.has(classifyApiError(error).kind);
}
