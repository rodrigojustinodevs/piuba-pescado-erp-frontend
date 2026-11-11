import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeJwt, inSeconds } from '@/test/jwt';

let cookieValue: string | undefined;
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => (cookieValue ? { value: cookieValue } : undefined) }),
}));

import { withAuthGuard } from './withAuthGuard';

const ok = async () => Response.json({ ok: true });
const call = async (options?: Parameters<typeof withAuthGuard>[1]) => withAuthGuard(ok, options)();

describe('withAuthGuard', () => {
  beforeEach(() => {
    cookieValue = undefined;
  });

  it('401 sem cookie', async () => {
    expect((await call()).status).toBe(401);
  });

  it('401 para token malformado e para token expirado', async () => {
    cookieValue = 'lixo';
    expect((await call()).status).toBe(401);
    cookieValue = fakeJwt({ exp: inSeconds(-10) });
    expect((await call()).status).toBe(401);
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
