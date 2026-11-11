import { expect, test } from '@playwright/test';
import { hasCredentials, loginAndWaitForDashboard } from './helpers';

// Smoke autenticado: cada módulo principal carrega sem cair no erro ou no 404.
// Exige backend no ar e usuário de teste (E2E_EMAIL / E2E_PASSWORD).
const ROUTES = [
  '/company/tanks',
  '/company/batches',
  '/company/species',
  '/company/stockings',
  '/company/feedings',
  '/company/biometries',
  '/company/mortalities',
  '/company/transfers',
  '/company/disposals',
  '/company/water-qualities',
  '/company/sensors',
  '/company/sensor-readings',
  '/company/supplies',
  '/company/purchases',
  '/company/suppliers',
  '/company/stocks',
  '/company/clients',
  '/company/sales',
  '/company/financial-categories',
  '/company/financial-transactions',
  '/dashboard/usuarios',
  '/dashboard/configuracoes',
  '/dashboard/relatorios/producao',
];

test.describe('navegação autenticada', () => {
  test.skip(!hasCredentials, 'defina E2E_EMAIL e E2E_PASSWORD para rodar');

  test('módulos principais carregam sem erro', async ({ page }) => {
    test.setTimeout(180_000);
    await loginAndWaitForDashboard(page);

    for (const route of ROUTES) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBeLessThan(400);
      await expect(page, route).not.toHaveURL(/\/login$/);
      await expect(page.getByRole('heading', { name: 'Algo deu errado' }), route).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Página não encontrada' }), route).toHaveCount(
        0,
      );
      await expect(page.getByRole('heading').first(), route).toBeVisible();
    }
  });
});
