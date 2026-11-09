import axios from 'axios';
import { ErrorMessages } from '@/shared/constants/errorMessages';

export type FieldErrors = Record<string, string[]>;

export class HttpError extends Error {
  status: number;
  fieldErrors?: FieldErrors;

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
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

export async function extractErrorDetails(
  response: Response,
  fallback: string = ErrorMessages.UNEXPECTED,
): Promise<{ message: string; fieldErrors?: FieldErrors }> {
  try {
    const data = await response.json();
    const message = data?.message || data?.error || data?.errorMessage || data?.detail || fallback;
    return { message, fieldErrors: pickFieldErrors(data) };
  } catch {
    return { message: fallback };
  }
}

export async function extractErrorMessage(
  response: Response,
  fallback: string = ErrorMessages.UNEXPECTED,
): Promise<string> {
  return (await extractErrorDetails(response, fallback)).message;
}
