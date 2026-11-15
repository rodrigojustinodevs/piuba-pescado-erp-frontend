import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApiBaseUrl } from './apiUrl';

type Env = { API_URL: string; NEXT_PUBLIC_API_URL: string; NODE_ENV?: string };

function stubEnv({ NODE_ENV, ...vars }: Env) {
  for (const [key, value] of Object.entries(vars)) vi.stubEnv(key, value);
  if (NODE_ENV) vi.stubEnv('NODE_ENV', NODE_ENV);
}

describe('getApiBaseUrl', () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each([
    [
      'prefere API_URL e remove barras finais',
      { API_URL: 'https://api.exemplo.com//', NEXT_PUBLIC_API_URL: 'https://legado.com' },
      'https://api.exemplo.com',
    ],
    [
      'aceita NEXT_PUBLIC_API_URL como legado',
      { API_URL: '', NEXT_PUBLIC_API_URL: 'https://legado.com' },
      'https://legado.com',
    ],
    [
      'cai em localhost só fora de produção',
      { API_URL: '', NEXT_PUBLIC_API_URL: '', NODE_ENV: 'development' },
      'http://localhost:8005',
    ],
  ] satisfies [string, Env, string][])('%s', (_name, env, expected) => {
    stubEnv(env);
    expect(getApiBaseUrl()).toBe(expected);
  });

  it('falha em produção sem variável configurada', () => {
    stubEnv({ API_URL: '', NEXT_PUBLIC_API_URL: '', NODE_ENV: 'production' });
    expect(() => getApiBaseUrl()).toThrow(/API_URL/);
  });
});
