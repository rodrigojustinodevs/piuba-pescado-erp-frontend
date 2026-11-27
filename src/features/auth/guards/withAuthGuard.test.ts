import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeJwt, inSeconds } from '@/test/jwt';
import { __setRefreshImplForTests } from '@/shared/lib/http/sessionRefresh';

let cookieValue: string | undefined;
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: () => (cookieValue ? { value: cookieValue } : undefined),
    set: (cookie: { value: string }) => {
      cookieValue = cookie.value || undefined;
    },
  }),
}));

import { withAuthGuard } from './withAuthGuard';

const ok = async () => Response.json({ ok: true });
const call = async (options?: Parameters<typeof withAuthGuard>[1]) => withAuthGuard(ok, options)();

describe('withAuthGuard', () => {
  beforeEach(() => {
    cookieValue = undefined;
  });
  afterEach(() => __setRefreshImplForTests(null));

  it('401 SESSION_ENDED sem cookie', async () => {
    const res = await call();
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ code: 'SESSION_ENDED' });
  });

  it('401 para token malformado', async () => {
    cookieValue = 'lixo';
    expect((await call()).status).toBe(401);
  });

  it('renova o token vencido e segue com o token novo', async () => {
    const fresh = fakeJwt({ role: 'manager', cid: 'c1', exp: inSeconds(3600) });
    __setRefreshImplForTests(async () => ({ token: fresh }));
    cookieValue = fakeJwt({ role: 'manager', exp: inSeconds(-10) });

    const handler = vi.fn(async () => Response.json({}));
    const res = await withAuthGuard(handler)();

    expect(res.status).toBe(200);
    expect(cookieValue).toBe(fresh);
    expect(handler.mock.calls[0]).toMatchObject([{ token: fresh }]);
  });

  it('encerra a sessão quando a API recusa o refresh', async () => {
    __setRefreshImplForTests(async () => 'rejected');
    cookieValue = fakeJwt({ role: 'manager', exp: inSeconds(-10) });
    const res = await call();
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ code: 'SESSION_ENDED' });
    expect(cookieValue).toBeUndefined();
  });

  it('403 (não 401) quando o papel não é permitido', async () => {
    cookieValue = fakeJwt({ roles: ['operator'], exp: inSeconds(600) });
    const res = await call({ roles: ['master'] });
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ success: false });
  });

  it('403 quando exige empresa e o token não tem', async () => {
    cookieValue = fakeJwt({ roles: ['manager'], exp: inSeconds(600) });
    expect((await call({ requireCompany: true })).status).toBe(403);
  });

  it('executa o handler com o contexto de autenticação', async () => {
    cookieValue = fakeJwt({ roles: ['manager'], company_id: 'c1', exp: inSeconds(600) });
    const handler = vi.fn(async () => Response.json({}));
    const res = await withAuthGuard(handler, { roles: ['manager'], requireCompany: true })();
    expect(res.status).toBe(200);
    expect(handler.mock.calls[0]).toMatchObject([{ role: 'manager', companyId: 'c1' }]);
  });
});
