import { extractErrorMessage } from './httpError';
import { HttpRequestOptions, HttpResult } from './httpTypes';
import { TokenProvider } from './httpAuth';
import { ErrorMessages } from '@/shared/constants/errorMessages';

export interface HttpClientConfig {
  baseUrl: string;
  tokenProvider?: TokenProvider;
}

export class HttpClient {
  private baseUrl: string;
  private tokenProvider?: TokenProvider;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenProvider = config.tokenProvider;
  }

  async request<T>(endpoint: string, options: HttpRequestOptions = {}): Promise<HttpResult<T>> {
    const { expectJson = true, headers: customHeaders, ...fetchInit } = options;

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const headers = new Headers(customHeaders);

    if (expectJson && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.tokenProvider) {
      const token = await this.tokenProvider.getToken();
      if (!token) {
        return {
          ok: false,
          error: ErrorMessages.UNAUTHORIZED,
          status: 401,
        };
      }

      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        ...fetchInit,
        headers,
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        return { ok: false, error: message, status: response.status };
      }

      if (!expectJson || response.status === 204) {
        return { ok: true, data: null as T, status: response.status };
      }

      const data = (await response.json()) as T;

      return {
        ok: true,
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('[HTTP_CLIENT_ERROR]', error);

      return {
        ok: false,
        error: ErrorMessages.SERVER_FAILURE,
        status: 500,
      };
    }
  }
}
