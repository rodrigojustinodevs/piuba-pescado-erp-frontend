import { expect, test, type Page, type Route } from '@playwright/test';

/**
 * Fluxos da Fase 1 com o BFF mockado (`page.route`): banners de plano, sessão
 * encerrada, sem acesso à empresa e modal de plano. Não dependem da API real.
 *
 * O refresh com fila acontece no servidor (BFF/proxy) e não passa pelo browser;
 * está coberto nos testes unitários (sessionRefresh, withAuthGuard, proxy, httpClient).
 */

function fakeJwt(payload: Record<string, unknown>) {
  const enc = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64url');
  return `${enc({ alg: 'none', typ: 'JWT' })}.${enc(payload)}.sig`;
}

const ok = (route: Route, data: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, data }),
  });

const fail = (route: Route, status: number, error: string, extra: Record<string, unknown> = {}) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify({ success: false, error, ...extra }),
  });

type Snapshot = {
  status: string;
  readOnly: boolean;
  daysLeftInTrial: number | null;
};

const snapshot = ({ status, readOnly, daysLeftInTrial }: Snapshot) => ({
  plan: { code: 'free', name: 'Free' },
  status,
  readOnly,
  trialEndsAt: null,
  daysLeftInTrial,
  entitlements: [
    {
      key: 'ponds.included',
      type: 'limit',
      label: 'Tanques',
      enabled: true,
      limit: 3,
      used: 2,
      remaining: 1,
      resetPeriod: null,
      resetsAt: null,
    },
  ],
});

async function signIn(
  page: Page,
  baseURL: string,
  role = 'operator',
  sub: Snapshot = { status: 'active', readOnly: false, daysLeftInTrial: null },
) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  await page.context().addCookies([
    {
      name: 'auth_token',
      value: fakeJwt({ role, cid: 'c1', exp, iat: exp - 3600 }),
      url: baseURL,
    },
  ]);

  // Qualquer outra rota do BFF: 404 (registrada antes = menor prioridade). As telas
  // caem no estado de erro próprio, que não é o que estes testes verificam.
  await page.route('**/api/**', (route) => fail(route, 404, 'Não encontrado.'));
  await page.route(/\/api\/auth\/?(\?.*)?$/, (route) =>
    route.request().method() === 'GET'
      ? ok(route, {
          isAuthenticated: true,
          user: {
            id: 'u1',
            email: 'op@piuba.test',
            name: 'Operador',
            role,
            companyId: 'c1',
            companies: [
              { id: 'c1', name: 'Fazenda Um', role },
              { id: 'c2', name: 'Fazenda Dois', role },
            ],
          },
        })
      : route.fallback(),
  );
  await page.route('**/api/subscription', (route) => ok(route, snapshot(sub)));
  // Configurações: sem dados (o provider cai no fallback sem quebrar a tela).
  await page.route('**/api/company/settings', (route) => fail(route, 404, 'Sem configurações.'));
}

test.describe('acesso e plano', () => {
  test('Free expirado: banner persistente de somente leitura', async ({ page, baseURL }) => {
    await signIn(page, baseURL!, 'operator', {
      status: 'expired',
      readOnly: true,
      daysLeftInTrial: 0,
    });
    await page.goto('/dashboard');
    const banner = page.getByRole('alert').filter({ hasText: 'Somente leitura.' });
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Peça a um administrador');
    // Operador não vê o CTA de billing.
    await expect(banner.getByRole('link')).toHaveCount(0);
  });

  test('teste em D-3: aviso com CTA para admin, dispensável', async ({ page, baseURL }) => {
    await signIn(page, baseURL!, 'admin', {
      status: 'trialing',
      readOnly: false,
      daysLeftInTrial: 3,
    });
    await page.goto('/dashboard');
    const banner = page
      .getByRole('status')
      .filter({ hasText: 'O teste gratuito termina em 3 dias.' });
    await expect(banner).toBeVisible();
    await expect(banner.getByRole('link', { name: 'Ver planos' })).toBeVisible();
    await banner.getByRole('button', { name: 'Dispensar aviso do teste' }).click();
    await expect(banner).toBeHidden();
  });

  test('teste em D-5: sem aviso', async ({ page, baseURL }) => {
    await signIn(page, baseURL!, 'admin', {
      status: 'trialing',
      readOnly: false,
      daysLeftInTrial: 5,
    });
    await page.goto('/dashboard');
    await expect(page.getByText(/O teste gratuito termina/)).toHaveCount(0);
  });

  test('pagamento em atraso: escrita liberada, aviso para todos', async ({ page, baseURL }) => {
    await signIn(page, baseURL!, 'operator', {
      status: 'overdue',
      readOnly: false,
      daysLeftInTrial: null,
    });
    await page.goto('/dashboard');
    await expect(page.getByRole('alert').filter({ hasText: 'Pagamento em atraso.' })).toContainText(
      'Os registros continuam liberados.',
    );
  });

  test('401 do BFF: vai ao login com "sessão encerrada"', async ({ page, baseURL }) => {
    await signIn(page, baseURL!);
    // Como o BFF real: refresh recusado → 401 SESSION_ENDED + cookie apagado.
    await page.route('**/api/company/tanks**', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        headers: { 'set-cookie': 'auth_token=; Path=/; Max-Age=0' },
        body: JSON.stringify({
          success: false,
          error: 'Sua sessão foi encerrada.',
          code: 'SESSION_ENDED',
        }),
      }),
    );
    await page.goto('/company/tanks');
    await expect(page).toHaveURL(/\/login\?reason=session_ended$/);
    await expect(
      page.getByText('Sua sessão foi encerrada. Entre novamente para continuar.'),
    ).toBeVisible();
  });

  test('403 COMPANY_ACCESS_DENIED: tela sem acesso, sem logout', async ({ page, baseURL }) => {
    await signIn(page, baseURL!);
    await page.route('**/api/company/tanks**', (route) =>
      fail(route, 403, 'x', { code: 'COMPANY_ACCESS_DENIED' }),
    );
    await page.goto('/company/tanks');
    await expect(page.getByRole('heading', { name: 'Sem acesso a esta empresa' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Fazenda Dois/ })).toBeVisible();
    await expect(page).toHaveURL(/\/company\/tanks$/);
  });

  test('402 PLAN_FEATURE_REQUIRED: modal com o plano exigido', async ({ page, baseURL }) => {
    await signIn(page, baseURL!, 'admin');
    await page.route('**/api/company/tanks**', (route) =>
      fail(route, 402, 'Recurso fora do plano.', {
        code: 'PLAN_FEATURE_REQUIRED',
        details: { feature: 'inventory.basic', current_plan: 'free', required_plan: 'starter' },
      }),
    );
    await page.goto('/company/tanks');
    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('heading', { name: 'Disponível no plano Starter' }),
    ).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Ver plano Starter' })).toHaveAttribute(
      'href',
      '/dashboard/assinatura/planos?destaque=starter',
    );
  });
});
