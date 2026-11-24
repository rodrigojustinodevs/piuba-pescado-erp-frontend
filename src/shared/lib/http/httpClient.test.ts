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

  it('extrai code e detalhes do 403 de gating no formato do Laravel', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      json(
        {
          status: false,
          message: 'Plano não inclui',
          response: {
            code: 'PLAN_UPGRADE_REQUIRED',
            feature: 'ai_management_plan',
            currentTier: 'free',
            requiredTier: 'professional',
          },
        },
        403,
      ),
    );
    const error = await new HttpClient({ baseUrl: 'http://x' }).get('/a').catch((e: unknown) => e);
    expect(error).toMatchObject({
      status: 403,
      code: 'PLAN_UPGRADE_REQUIRED',
      details: { feature: 'ai_management_plan', currentTier: 'free', requiredTier: 'professional' },
    });
  });

  it('extrai code e details do envelope do BFF e lê Retry-After', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: 'x',
          code: 'SUBSCRIPTION_PENDING',
          details: { feature: 'f' },
        }),
        { status: 429, headers: { 'Retry-After': '30' } },
      ),
    );
    const error = await new HttpClient({ baseUrl: 'http://x' }).get('/a').catch((e: unknown) => e);
    expect(error).toMatchObject({
      status: 429,
      code: 'SUBSCRIPTION_PENDING',
      details: { feature: 'f' },
      retryAfterSeconds: 30,
    });
  });
});
