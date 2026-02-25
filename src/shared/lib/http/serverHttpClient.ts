import { HttpClient } from './httpClient';
import { ServerTokenProvider } from './serverTokenProvider';

export const serverHttpClient = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005',
  tokenProvider: new ServerTokenProvider(),
});
