export type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
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
): Response {
  const body: ApiEnvelope<never> = {
    success: false,
    error,
    ...(fieldErrors ? { fieldErrors } : {}),
  };

  return Response.json(body, { status });
}
