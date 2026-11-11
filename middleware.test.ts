import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { fakeJwt, inSeconds } from '@/test/jwt';
import { middleware } from './middleware';

function run(path: string, token?: string) {
  const request = new NextRequest(`http://localhost${path}`, {
    headers: token ? { cookie: `auth_token=${token}` } : {},
  });
  return middleware(request);
}

const location = (res: Response) => res.headers.get('location');
const valid = (role: string) => fakeJwt({ roles: [role], exp: inSeconds(600) });

describe('middleware', () => {
  it.each(['/dashboard', '/company/tanks', '/admin/companies', '/alerts'])(
    'redireciona %s ao login sem cookie',
    (path) => {
      const res = run(path);
      expect(res.status).toBe(307);
      expect(location(res)).toBe('http://localhost/login');
    },
  );

  it('redireciona e limpa o cookie quando o token expirou ou é inválido', () => {
    for (const token of [fakeJwt({ exp: inSeconds(-5) }), 'lixo']) {
      const res = run('/company/tanks', token);
      expect(location(res)).toBe('http://localhost/login');
      expect(res.headers.get('set-cookie')).toMatch(/auth_token=;/);
    }
  });

  it('permite usuário autenticado em rotas da empresa', () => {
    const res = run('/company/tanks', valid('operator'));
    expect(res.status).toBe(200);
    expect(location(res)).toBeNull();
  });

  it('bloqueia /admin para quem não é master e libera para master', () => {
    expect(location(run('/admin/companies', valid('operator')))).toBe('http://localhost/dashboard');
    expect(location(run('/admin/companies', valid('company_admin')))).toBe(
      'http://localhost/dashboard',
    );
    expect(location(run('/admin/companies', valid('master_admin')))).toBeNull();
    expect(location(run('/admin/companies', valid('master')))).toBeNull();
  });

  it('manda /login com sessão válida para o dashboard, mas não com token expirado', () => {
    expect(location(run('/login', valid('operator')))).toBe('http://localhost/dashboard');
    const res = run('/login', fakeJwt({ exp: inSeconds(-5) }));
    expect(location(res)).toBeNull();
    expect(res.headers.get('set-cookie')).toMatch(/auth_token=;/);
  });
});
