import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export interface RequestOptions extends RequestInit {
  errorFallback?: string;
  expectJson?: boolean;
  withAuth?: boolean;
}

export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number };

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
}

export const HttpResponses = {
  unauthorized: () => NextResponse.json({ error: "Não autenticado" }, { status: 401 }),

  serverError: () =>
    NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    ),

  fromApiError: (error: string, status: number) => NextResponse.json({ error }, { status }),
} as const;

export function backendRequest(
  endpoint: string,
  options: RequestOptions & { expectJson: false }
): Promise<ApiResult<null>>;
export function backendRequest<T = unknown>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResult<T>>;
export async function backendRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResult<T | null>> {
  const {
    errorFallback = "Ocorreu um erro inesperado",
    expectJson = true,
    withAuth = false,
    ...fetchInit
  } = options;

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(fetchInit.headers);
  if (expectJson && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (withAuth) {
    const token = await getAuthToken();
    if (!token) {
      return { ok: false, error: "Não autenticado", status: 401 };
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, { ...fetchInit, headers });

    if (!response.ok) {
      let errorMessage = errorFallback;
      try {
        const errorData = (await response.json()) as {
          message?: string;
          error?: string;
          detail?: string;
        };
        errorMessage = errorData.message || errorData.error || errorData.detail || errorFallback;
      } catch {
        // Se não for JSON (HTML/text), mantém fallback
      }

      return { ok: false, error: errorMessage, status: response.status };
    }

    if (!expectJson || response.status === 204) {
      return { ok: true, data: null, status: response.status };
    }

    const data = (await response.json()) as T;
    return { ok: true, data, status: response.status };
  } catch (error) {
    console.error("[BACKEND_REQUEST_ERROR]", error);
    return { ok: false, error: "Falha na comunicação com o servidor.", status: 500 };
  }
}

