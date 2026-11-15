import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from './httpClient';
import { HttpError } from './httpError';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('HttpClient', () => {
  afterEach(() => vi.restoreAllMocks());

  it('desembrulha o envelope { success, data }', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({ success: true, data: { id: 1 } }));
    await expect(new HttpClient({ baseUrl: 'http://x' }).get('/a')).resolves.toEqual({ id: 1 });
  });

  it('lança HttpError com o status em respostas não-ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({ message: 'ruim' }, 422));
    await expect(new HttpClient({ baseUrl: 'http://x' }).get('/a')).rejects.toMatchObject({
      name: 'HttpError',
      status: 422,
    });
  });

  it('envia Bearer quando há tokenProvider e falha com 401 sem token', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({ success: true, data: 1 }));
    await new HttpClient({ baseUrl: 'http://x', tokenProvider: { getToken: async () => 't' } }).get(
      '/a',
    );
    expect((spy.mock.calls[0][1]!.headers as Headers).get('Authorization')).toBe('Bearer t');

    const semToken = new HttpClient({
      baseUrl: 'http://x',
      tokenProvider: { getToken: async () => null },
    });
    await expect(semToken.get('/a')).rejects.toMatchObject({ status: 401 });
  });

  it('converte timeout em HttpError 504', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal!.reason));
        }),
    );
    const client = new HttpClient({ baseUrl: 'http://x', timeoutMs: 20 });
    const error = await client.get('/a').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 504 });
  });
});
