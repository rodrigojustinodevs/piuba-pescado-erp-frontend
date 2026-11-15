import { HttpClient } from './httpClient';
import { getApiBaseUrl } from './apiUrl';
import { ServerTokenProvider } from './serverTokenProvider';

export const serverHttpClient = new HttpClient({
  baseUrl: getApiBaseUrl(),
  tokenProvider: new ServerTokenProvider(),
});
