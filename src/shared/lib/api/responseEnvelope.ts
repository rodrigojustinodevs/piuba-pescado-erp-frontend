export type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export function successResponse<T>(data: T, status = 200): Response {
  const body: ApiEnvelope<T> = {
    success: true,
    data,
  };

  return Response.json(body, { status });
}

export function failureResponse(error: string, status = 500): Response {
  const body: ApiEnvelope<never> = {
    success: false,
    error,
  };

  return Response.json(body, { status });
}
