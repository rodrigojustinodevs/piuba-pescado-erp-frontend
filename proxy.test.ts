import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';
import { fakeJwt, inSeconds } from '@/test/jwt';
import { __setRefreshImplForTests } from '@/shared/lib/http/sessionRefresh';
import { proxy } from './proxy';

function run(path: string, token?: string) {
  const request = new NextRequest(`http://localhost${path}`, {
    headers: token ? { cookie: `auth_token=${token}` } : {},
  });
  return proxy(request);
}

const location = (res: Response) => res.headers.get('location');
const valid = (role: string) => fakeJwt({ roles: [role], exp: inSeconds(600) });

describe('proxy', () => {
  afterEach(() => __setRefreshImplForTests(null));

  it.each(['/dashboard', '/company/tanks', '/admin/companies', '/alerts'])(
    'redireciona %s ao login sem cookie',
    async (path) => {
      const res = await run(path);
      expect(res.status).toBe(307);
      expect(location(res)).toBe('http://localhost/login');
    },
  );

  it('limpa o cookie quando o token é malformado', async () => {
    const res = await run('/company/tanks', 'lixo');
    expect(location(res)).toBe('http://localhost/login');
    expect(res.headers.get('set-cookie')).toMatch(/auth_token=;/);
  });

  it('token expirado: renova e segue na página, regravando o cookie', async () => {
    const fresh = fakeJwt({ role: 'operator', exp: inSeconds(3600) });
    __setRefreshImplForTests(async () => ({ token: fresh }));
    const res = await run('/company/tanks', fakeJwt({ exp: inSeconds(-5) }));
    expect(location(res)).toBeNull();
    expect(res.headers.get('set-cookie')).toContain(`auth_token=${fresh}`);
  });

  it('token expirado e refresh recusado: login com "sessão encerrada" e cookie limpo', async () => {
    __setRefreshImplForTests(async () => 'rejected');
    const res = await run('/company/tanks', fakeJwt({ exp: inSeconds(-5) }));
    expect(location(res)).toBe('http://localhost/login?reason=session_ended');
    expect(res.headers.get('set-cookie')).toMatch(/auth_token=;/);
  });

  it('permite usuário autenticado em rotas da empresa', async () => {
    const res = await run('/company/tanks', valid('operator'));
    expect(res.status).toBe(200);
    expect(location(res)).toBeNull();
  });

  it('bloqueia /admin para quem não é master e libera para master', async () => {
    expect(location(await run('/admin/companies', valid('operator')))).toBe(
      'http://localhost/dashboard',
    );
    expect(location(await run('/admin/companies', valid('company_admin')))).toBe(
      'http://localhost/dashboard',
    );
    expect(location(await run('/admin/companies', valid('master_admin')))).toBeNull();
    expect(location(await run('/admin/companies', valid('master')))).toBeNull();
  });

  it('manda /login com sessão válida para o dashboard; token expirado sem refresh limpa o cookie', async () => {
    expect(location(await run('/login', valid('operator')))).toBe('http://localhost/dashboard');
    __setRefreshImplForTests(async () => 'rejected');
    const res = await run('/login', fakeJwt({ exp: inSeconds(-5) }));
    expect(location(res)).toBeNull();
    expect(res.headers.get('set-cookie')).toMatch(/auth_token=;/);
  });
});
