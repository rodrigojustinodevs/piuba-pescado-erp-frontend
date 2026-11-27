import { HttpClient } from './httpClient';
import { getApiBaseUrl } from './apiUrl';
import { ServerTokenProvider } from './serverTokenProvider';
import { renewSession } from './serverSession';

/**
 * Cliente do BFF para a API Laravel. Um 401 da API (token vencido ou revogado)
 * dispara um refresh compartilhado e o request é repetido uma vez.
 */
export const serverHttpClient = new HttpClient({
  baseUrl: getApiBaseUrl(),
  tokenProvider: new ServerTokenProvider(),
  onUnauthorized: async () => (await renewSession()) !== null,
});
