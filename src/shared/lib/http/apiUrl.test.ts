import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApiBaseUrl } from './apiUrl';

describe('getApiBaseUrl', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('prefere API_URL e remove barras finais', () => {
    vi.stubEnv('API_URL', 'https://api.exemplo.com//');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://legado.com');
    expect(getApiBaseUrl()).toBe('https://api.exemplo.com');
  });

  it('aceita NEXT_PUBLIC_API_URL como legado', () => {
    vi.stubEnv('API_URL', '');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://legado.com');
    expect(getApiBaseUrl()).toBe('https://legado.com');
  });

  it('cai em localhost só fora de produção', () => {
    vi.stubEnv('API_URL', '');
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    vi.stubEnv('NODE_ENV', 'development');
    expect(getApiBaseUrl()).toBe('http://localhost:8005');
  });

  it('falha em produção sem variável configurada', () => {
    vi.stubEnv('API_URL', '');
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
    vi.stubEnv('NODE_ENV', 'production');
    expect(() => getApiBaseUrl()).toThrow(/API_URL/);
  });
});
