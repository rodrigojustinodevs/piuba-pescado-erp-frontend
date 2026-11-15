import { expect, test } from '@playwright/test';

test.describe('recuperação de senha (sem backend)', () => {
  test('login leva para /forgot-password', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Esqueceu a senha?' }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test('e-mail inválido mostra erro de validação', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel('E-mail').fill('invalido');
    await page.getByRole('button', { name: 'Enviar instruções' }).click();
    await expect(page.getByText('E-mail inválido')).toBeVisible();
  });

  test('reset sem token/e-mail mostra link inválido', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.getByText('Link de redefinição inválido')).toBeVisible();
  });

  test('senhas diferentes são barradas no formulário', async ({ page }) => {
    await page.goto('/reset-password?token=abc&email=a@b.com');
    await page.getByLabel('Nova senha', { exact: true }).fill('Abcdef123');
    await page.getByLabel('Confirmar nova senha').fill('Outra1234');
    await page.getByRole('button', { name: 'Redefinir senha' }).click();
    await expect(page.getByText('As senhas não conferem')).toBeVisible();
  });
});

// Exigem o Laravel no ar (E2E_BACKEND=1).
test.describe('recuperação de senha (com backend)', () => {
  test.skip(!process.env.E2E_BACKEND, 'defina E2E_BACKEND=1 com o Laravel rodando');

  test('forgot-password sempre devolve mensagem genérica', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel('E-mail').fill('nao-existe@exemplo.com');
    await page.getByRole('button', { name: 'Enviar instruções' }).click();
    await expect(page.getByRole('status')).toContainText('Se o e-mail estiver cadastrado');
  });

  test('token inválido mostra erro em português', async ({ page }) => {
    await page.goto('/reset-password?token=invalido&email=nao-existe@exemplo.com');
    await page.getByLabel('Nova senha', { exact: true }).fill('Abcdef123');
    await page.getByLabel('Confirmar nova senha').fill('Abcdef123');
    await page.getByRole('button', { name: 'Redefinir senha' }).click();
    await expect(page.getByText('Token inválido ou expirado')).toBeVisible();
  });
});
