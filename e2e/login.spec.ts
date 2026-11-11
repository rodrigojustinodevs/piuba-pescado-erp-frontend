import { expect, test } from '@playwright/test';
import { hasCredentials, login, loginAndWaitForDashboard } from './helpers';

test.describe('login (formulário)', () => {
  test('valida campos antes de chamar a API', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('E-mail é obrigatório')).toBeVisible();
    await expect(page.getByText('Senha é obrigatória')).toBeVisible();
  });
});

// Exigem backend no ar e um usuário de teste: E2E_EMAIL / E2E_PASSWORD.
test.describe('login (integrado ao backend)', () => {
  test.skip(!hasCredentials, 'defina E2E_EMAIL e E2E_PASSWORD para rodar');

  test('credenciais inválidas mostram erro em português', async ({ page }) => {
    await login(page, 'nao-existe@exemplo.com', 'senha-errada');
    await expect(page.getByRole('alert')).toContainText('Erro de credenciais');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('login válido abre o dashboard, sem expor o token', async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (r) => r.url().endsWith('/api/auth') && r.request().method() === 'POST',
    );
    await login(page);
    const body = JSON.stringify(await (await responsePromise).json());
    expect(body).not.toMatch(/token/i);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible();

    const cookie = (await page.context().cookies()).find((c) => c.name === 'auth_token');
    expect(cookie).toMatchObject({ httpOnly: true, sameSite: 'Lax' });
  });

  test('logout encerra a sessão e protege as rotas novamente', async ({ page }) => {
    await loginAndWaitForDashboard(page);
    await page.getByRole('button', { name: /sair/i }).first().click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});
