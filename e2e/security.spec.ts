import { expect, test } from '@playwright/test';

// Não dependem do backend: validam middleware, headers e páginas de erro.
test.describe('proteção de rotas', () => {
  for (const path of ['/dashboard', '/company/tanks', '/admin/companies', '/alerts']) {
    test(`${path} sem sessão redireciona para /login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    });
  }

  test('cookie expirado/inválido é descartado e não gera loop', async ({
    page,
    context,
    baseURL,
  }) => {
    await context.addCookies([{ name: 'auth_token', value: 'lixo', url: baseURL! }]);
    await page.goto('/company/tanks');
    await expect(page).toHaveURL(/\/login$/);
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === 'auth_token')).toBeUndefined();
  });

  test('API protegida responde 401 sem cookie', async ({ request }) => {
    const res = await request.get('/api/company/tanks');
    expect(res.status()).toBe(401);
    expect(await res.json()).toMatchObject({ success: false });
  });
});

test.describe('headers e páginas de erro', () => {
  test('envia headers de segurança', async ({ request }) => {
    const headers = (await request.get('/login')).headers();
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('exibe a página 404 customizada', async ({ page }) => {
    const res = await page.goto('/rota-que-nao-existe');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  });
});
