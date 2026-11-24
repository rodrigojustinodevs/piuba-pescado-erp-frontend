export type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      code?: string;
      details?: Record<string, unknown>;
    };

export type FailureExtra = {
  code?: string;
  details?: Record<string, unknown>;
  retryAfterSeconds?: number;
};

export function successResponse<T>(data: T, status = 200): Response {
  const body: ApiEnvelope<T> = {
    success: true,
    data,
  };

  return Response.json(body, { status });
}

export function failureResponse(
  error: string,
  status = 500,
  fieldErrors?: Record<string, string[]>,
  extra: FailureExtra = {},
): Response {
  const body: ApiEnvelope<never> = {
    success: false,
    error,
    ...(fieldErrors ? { fieldErrors } : {}),
    ...(extra.code ? { code: extra.code } : {}),
    ...(extra.details ? { details: extra.details } : {}),
  };

  const headers =
    extra.retryAfterSeconds === undefined
      ? undefined
      : { 'Retry-After': String(extra.retryAfterSeconds) };
  return Response.json(body, { status, headers });
}
