import { ErrorMessages } from '@/shared/constants/errorMessages';

export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
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
