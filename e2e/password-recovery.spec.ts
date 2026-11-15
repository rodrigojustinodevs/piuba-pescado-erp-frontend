import { expect, test, type Page } from '@playwright/test';

async function fillAndSubmitReset(page: Page, password: string, confirmation: string) {
  await page.getByLabel('Nova senha', { exact: true }).fill(password);
  await page.getByLabel('Confirmar nova senha').fill(confirmation);
  await page.getByRole('button', { name: 'Redefinir senha' }).click();
}

async function submitForgot(page: Page, email: string) {
  await page.goto('/forgot-password');
  await page.getByLabel('E-mail').fill(email);
  await page.getByRole('button', { name: 'Enviar instruções' }).click();
}

test.describe('recuperação de senha (sem backend)', () => {
  test('login leva para /forgot-password', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Esqueceu a senha?' }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test('e-mail inválido mostra erro de validação', async ({ page }) => {
    await submitForgot(page, 'invalido');
    await expect(page.getByText('E-mail inválido')).toBeVisible();
  });

  test('reset sem token/e-mail mostra link inválido', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.getByText('Link de redefinição inválido')).toBeVisible();
  });

  test('senhas diferentes são barradas no formulário', async ({ page }) => {
    await page.goto('/reset-password?token=abc&email=a@b.com');
    await fillAndSubmitReset(page, 'Abcdef123', 'Outra1234');
    await expect(page.getByText('As senhas não conferem')).toBeVisible();
  });
});

// Exigem o Laravel no ar (E2E_BACKEND=1).
if (process.env.E2E_BACKEND) {
  test.describe('recuperação de senha (com backend)', () => {
    test('forgot-password sempre devolve mensagem genérica', async ({ page }) => {
      await submitForgot(page, 'nao-existe@exemplo.com');
      // O backend limita tentativas (429): nesse caso a mensagem deve estar em português.
      await expect(
        page.getByText(/Se o e-mail estiver cadastrado|Muitas tentativas/).first(),
      ).toBeVisible();
    });

    test('token inválido mostra erro em português', async ({ page }) => {
      await page.goto('/reset-password?token=invalido&email=nao-existe@exemplo.com');
      await fillAndSubmitReset(page, 'Abcdef123', 'Abcdef123');
      await expect(page.getByText('Token inválido ou expirado')).toBeVisible();
    });
  });
}

test.describe('layout em 360px', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  for (const path of ['/login', '/forgot-password', '/reset-password?token=t&email=a@b.com']) {
    test(`${path} não gera rolagem horizontal`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
