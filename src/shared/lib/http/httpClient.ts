import { extractErrorMessage } from './httpError';
import { HttpError } from './httpError';
import { HttpRequestOptions } from './httpTypes';
import { TokenProvider } from './httpAuth';
import { ErrorMessages } from '@/shared/constants/errorMessages';

export interface HttpClientConfig {
  baseUrl: string;
  tokenProvider?: TokenProvider;
}

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export class HttpClient {
  private readonly baseUrl: string;
  private readonly tokenProvider?: TokenProvider;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenProvider = config.tokenProvider;
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

    const response = await fetch(url, {
      ...fetchInit,
      headers,
    });

    if (!response.ok) {
      const message = await extractErrorMessage(response);
      throw new HttpError(message, response.status);
    }

    if (!expectJson || response.status === 204) {
      return null as T;
    }

    const payload = (await response.json()) as ApiEnvelope<T> | T;

    if (typeof payload === 'object' && payload !== null && 'success' in payload) {
      const envelope = payload as ApiEnvelope<T>;

      if (envelope.success === false) {
        throw new HttpError(envelope.error || ErrorMessages.UNEXPECTED, response.status);
      }

      return envelope.data as T;
    }

    return payload as T;
  }

  get<T>(endpoint: string, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options: HttpRequestOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
