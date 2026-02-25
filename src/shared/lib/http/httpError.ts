import { ErrorMessages } from '@/shared/constants/errorMessages';

export async function extractErrorMessage(
  response: Response,
  fallback: string = ErrorMessages.UNEXPECTED,
): Promise<string> {
  try {
    const data = await response.json();
    return data?.message || data?.error || data?.detail || fallback;
  } catch {
    return fallback;
  }
}
