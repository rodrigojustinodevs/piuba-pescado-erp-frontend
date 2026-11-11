import { expect, type Page } from '@playwright/test';

export const E2E_EMAIL = process.env.E2E_EMAIL;
export const E2E_PASSWORD = process.env.E2E_PASSWORD;
export const hasCredentials = !!E2E_EMAIL && !!E2E_PASSWORD;

export async function login(page: Page, email = E2E_EMAIL!, password = E2E_PASSWORD!) {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

export async function loginAndWaitForDashboard(page: Page) {
  await login(page);
  await expect(page).toHaveURL(/\/dashboard$/);
}
