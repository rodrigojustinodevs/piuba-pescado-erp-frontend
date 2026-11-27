import { afterEach, describe, expect, it, vi } from 'vitest';
import { fakeJwt, inSeconds } from '@/test/jwt';
import { decodeJWT } from '@/shared/utils/jwt';
import { __setRefreshImplForTests, refreshSessionToken, shouldRefresh } from './sessionRefresh';

describe('refreshSessionToken', () => {
  afterEach(() => __setRefreshImplForTests(null));

  it('3 requests concorrentes com o mesmo token fazem 1 refresh (fila)', async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const impl = vi.fn(async () => {
      await gate;
      return { token: 'novo' };
    });
    __setRefreshImplForTests(impl);

    const pending = [
      refreshSessionToken('velho'),
      refreshSessionToken('velho'),
      refreshSessionToken('velho'),
    ];
    release();
    const results = await Promise.all(pending);

    expect(impl).toHaveBeenCalledTimes(1);
    expect(results).toEqual([{ token: 'novo' }, { token: 'novo' }, { token: 'novo' }]);
  });

  it('request atrasado com o token antigo recebe o token novo sem refazer o refresh', async () => {
    const impl = vi.fn(async () => ({ token: 'novo' }));
    __setRefreshImplForTests(impl);
    await refreshSessionToken('velho');
    expect(await refreshSessionToken('velho')).toEqual({ token: 'novo' });
    expect(impl).toHaveBeenCalledTimes(1);
  });

  it('não guarda falha: a próxima tentativa chama a API de novo', async () => {
    const impl = vi.fn(async () => 'unavailable' as const);
    __setRefreshImplForTests(impl);
    expect(await refreshSessionToken('t')).toBe('unavailable');
    await refreshSessionToken('t');
    expect(impl).toHaveBeenCalledTimes(2);
  });
});

describe('shouldRefresh', () => {
  it('renova token vencido ou a menos de 30 s de vencer', () => {
    expect(shouldRefresh(decodeJWT(fakeJwt({ exp: inSeconds(-1) })))).toBe(true);
    expect(shouldRefresh(decodeJWT(fakeJwt({ exp: inSeconds(10) })))).toBe(true);
    expect(shouldRefresh(decodeJWT(fakeJwt({ exp: inSeconds(600) })))).toBe(false);
  });

  it('não renova token sem exp', () => {
    expect(shouldRefresh({})).toBe(false);
  });
});
