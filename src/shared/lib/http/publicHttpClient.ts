import { HttpClient } from './httpClient';
import { getApiBaseUrl } from './apiUrl';

/** Cliente server-side para endpoints públicos: nunca envia o token da sessão. */
export const publicHttpClient = new HttpClient({ baseUrl: getApiBaseUrl() });
