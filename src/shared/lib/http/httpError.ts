import axios from 'axios';
import { ErrorMessages } from '@/shared/constants/errorMessages';

export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
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

export async function extractErrorMessage(
  response: Response,
  fallback: string = ErrorMessages.UNEXPECTED,
): Promise<string> {
  try {
    const data = await response.json();
    return data?.message || data?.error || data?.errorMessage || data?.detail || fallback;
  } catch {
    return fallback;
  }
}
