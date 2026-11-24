import axios from 'axios';
import { ErrorMessages } from '@/shared/constants/errorMessages';

export type FieldErrors = Record<string, string[]>;

/** Dados extras de um erro de negócio (ex.: 403 de feature gating do billing). */
export type HttpErrorDetails = Record<string, unknown>;

export type HttpErrorExtra = {
  /** Código de negócio vindo da API (ex.: `PLAN_UPGRADE_REQUIRED`). */
  code?: string;
  details?: HttpErrorDetails;
  /** Segundos do header `Retry-After` (429/503). */
  retryAfterSeconds?: number;
};

export class HttpError extends Error {
  status: number;
  fieldErrors?: FieldErrors;
  code?: string;
  details?: HttpErrorDetails;
  retryAfterSeconds?: number;

  constructor(
    message: string,
    status: number,
    fieldErrors?: FieldErrors,
    extra: HttpErrorExtra = {},
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.code = extra.code;
    this.details = extra.details;
    this.retryAfterSeconds = extra.retryAfterSeconds;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/**
 * Código de negócio e detalhes. Aceita o formato do Laravel (`response`/`handleError`
 * com `code`) e o envelope do BFF (`code` + `details` na raiz).
 */
function pickCodeAndDetails(data: unknown): Pick<HttpErrorExtra, 'code' | 'details'> {
  const root = asRecord(data);
  if (!root) return {};
  if (typeof root.code === 'string') {
    return { code: root.code, details: asRecord(root.details) ?? undefined };
  }
  for (const key of ['response', 'handleError']) {
    const nested = asRecord(root[key]);
    if (nested && typeof nested.code === 'string') {
      const { code, ...details } = nested;
      return { code: code as string, details };
    }
  }
  return {};
}

/** `Retry-After` em segundos ou data HTTP; devolve segundos (>= 0) ou undefined. */
export function parseRetryAfter(value: string | null, now = Date.now()): number | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  const date = Date.parse(trimmed);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, Math.ceil((date - now) / 1000));
}

function pickFieldErrors(data: unknown): FieldErrors | undefined {
  if (typeof data !== 'object' || data === null) return undefined;
  const record = data as { fieldErrors?: unknown; response?: { errors?: unknown } };
  const candidate = record.fieldErrors ?? record.response?.errors;
  if (typeof candidate !== 'object' || candidate === null) return undefined;
  return candidate as FieldErrors;
}

/**
 * Extrai o status HTTP de um erro vindo tanto do browserHttpClient (HttpError)
 * quanto de chamadas axios (auth), para tratar respostas 401 de forma uniforme.
 */
export function extractHttpStatus(error: unknown): number | null {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? null;
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === 'number' ? status : null;
  }

  return null;
}

export type ErrorDetails = HttpErrorExtra & { message: string; fieldErrors?: FieldErrors };

export async function extractErrorDetails(
  response: Response,
  fallback: string = ErrorMessages.UNEXPECTED,
): Promise<ErrorDetails> {
  const retryAfterSeconds = parseRetryAfter(response.headers.get('Retry-After'));
  try {
    const data = await response.json();
    const message = data?.message || data?.error || data?.errorMessage || data?.detail || fallback;
    return {
      message,
      fieldErrors: pickFieldErrors(data),
      ...pickCodeAndDetails(data),
      retryAfterSeconds,
    };
  } catch {
    return { message: fallback, retryAfterSeconds };
  }
}

export async function extractErrorMessage(
  response: Response,
  fallback: string = ErrorMessages.UNEXPECTED,
): Promise<string> {
  return (await extractErrorDetails(response, fallback)).message;
}
