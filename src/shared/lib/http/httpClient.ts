import { HttpError, extractErrorDetails } from './httpError';
import { HttpRequestOptions } from './httpTypes';
import { TokenProvider } from './httpAuth';
import { ErrorMessages } from '@/shared/constants/errorMessages';

export interface HttpClientConfig {
  baseUrl: string;
  tokenProvider?: TokenProvider;
  /** Tempo máximo por requisição, em ms (padrão 30s). */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class HttpClient {
  private readonly baseUrl: string;
  private readonly tokenProvider?: TokenProvider;
  private readonly timeoutMs: number;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenProvider = config.tokenProvider;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async request<T>(endpoint: string, options: HttpRequestOptions = {}): Promise<T> {
    const { expectJson = true, headers: customHeaders, ...fetchInit } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const headers = new Headers(customHeaders);

    if (expectJson && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.tokenProvider) {
      const token = await this.tokenProvider.getToken();
      if (!token) {
        throw new HttpError(ErrorMessages.UNAUTHORIZED, 401);
      }

      headers.set('Authorization', `Bearer ${token}`);
    }

    const timeoutSignal = AbortSignal.timeout(this.timeoutMs);
    const signal = fetchInit.signal ? AbortSignal.any([fetchInit.signal, timeoutSignal]) : timeoutSignal;

    let response: Response;
    try {
      response = await fetch(url, { ...fetchInit, headers, signal });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new HttpError(ErrorMessages.TIMEOUT, 504);
      }
      throw error;
    }

    if (!response.ok) {
      const { message, fieldErrors } = await extractErrorDetails(response);
      throw new HttpError(message, response.status, fieldErrors);
    }

    if (!expectJson || response.status === 204) {
      return null as T;
    }

    const payload = (await response.json()) as ApiEnvelope<T> | T;

    if (typeof payload === 'object' && payload !== null && 'success' in payload) {
      if (payload.success === false) {
        throw new HttpError(payload.error || ErrorMessages.UNEXPECTED, response.status);
      }

      return payload.data as T;
    }

    return payload;
  }

  get<T>(endpoint: string, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body?: unknown, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
