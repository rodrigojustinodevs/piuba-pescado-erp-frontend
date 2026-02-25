import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
import { failureResponse } from './responseEnvelope';

type RouteHandler<TArgs extends unknown[]> = (...args: TArgs) => Promise<Response> | Response;

export function withErrorHandling<TArgs extends unknown[]>(
  handler: RouteHandler<TArgs>,
  context: string,
): RouteHandler<TArgs> {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof HttpError) {
        return failureResponse(error.message, error.status);
      }

      console.error(`[${context}]`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });

      return failureResponse(ErrorMessages.SERVER_CONNECTION, 500);
    }
  };
}
