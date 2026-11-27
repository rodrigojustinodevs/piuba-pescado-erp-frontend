import { describe, expect, it } from 'vitest';
import { classifyApiError, isHandledGlobally, isRetryable } from './apiError';
import { extractErrorDetails, HttpError } from './httpError';

const err = (
  status: number,
  extra: ConstructorParameters<typeof HttpError>[3] = {},
  fieldErrors?: Record<string, string[]>,
) => new HttpError('mensagem da API', status, fieldErrors, extra);

describe('classifyApiError: tabela do contrato', () => {
  it('401 é sessão encerrada', () => {
    expect(classifyApiError(err(401, { code: 'SESSION_ENDED' })).kind).toBe('session');
  });

  it('403 NO_COMPANY_CONTEXT / COMPANY_ACCESS_DENIED / sem code', () => {
    expect(classifyApiError(err(403, { code: 'NO_COMPANY_CONTEXT' })).kind).toBe('noCompany');
    expect(classifyApiError(err(403, { code: 'COMPANY_ACCESS_DENIED' })).kind).toBe(
      'companyDenied',
    );
    expect(classifyApiError(err(403, { details: { permission: 'create-tank' } }))).toEqual({
      kind: 'forbidden',
      message: 'mensagem da API',
      permission: 'create-tank',
    });
  });

  it.each([
    ['TRIAL_EXPIRED', 'readOnly'],
    ['SUBSCRIPTION_SUSPENDED', 'readOnly'],
    ['PLAN_FEATURE_REQUIRED', 'featureRequired'],
    ['PLAN_LIMIT_REACHED', 'limitReached'],
    ['QUOTA_EXHAUSTED', 'quotaExhausted'],
  ])('402 %s → %s', (code, kind) => {
    expect(classifyApiError(err(402, { code })).kind).toBe(kind);
  });

  it('402 de limite carrega used/limit e o plano que resolve', () => {
    const result = classifyApiError(
      err(402, {
        code: 'PLAN_LIMIT_REACHED',
        details: {
          feature: 'ponds.included',
          limit: 3,
          used: 3,
          current_plan: 'free',
          required_plan: 'starter',
        },
      }),
    );
    expect(result).toMatchObject({
      kind: 'limitReached',
      block: {
        feature: 'ponds.included',
        limit: 3,
        used: 3,
        currentPlan: 'free',
        requiredPlan: 'starter',
      },
    });
  });

  it('409 é conflito; 422 com campos é validação, sem campos é regra de domínio', () => {
    expect(classifyApiError(err(409)).kind).toBe('conflict');
    expect(classifyApiError(err(422, {}, { name: ['obrigatório'] })).kind).toBe('validation');
    expect(classifyApiError(err(422))).toEqual({ kind: 'domain', message: 'mensagem da API' });
  });

  it('422 de domínio e 5xx não são tratados globalmente; 402/403/409 são', () => {
    expect(isHandledGlobally(err(422))).toBe(false);
    expect(isHandledGlobally(err(500))).toBe(false);
    expect(isHandledGlobally(err(402, { code: 'TRIAL_EXPIRED' }))).toBe(true);
    expect(isHandledGlobally(err(403))).toBe(true);
    expect(isHandledGlobally(err(409))).toBe(true);
  });

  it('não repete 4xx; repete rede e 5xx', () => {
    expect(isRetryable(err(402))).toBe(false);
    expect(isRetryable(err(422))).toBe(false);
    expect(isRetryable(err(503))).toBe(true);
    expect(isRetryable(new TypeError('fetch failed'))).toBe(true);
  });
});

describe('extractErrorDetails: formatos reais da API', () => {
  const res = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  it('402 no envelope (response.code + contexto)', async () => {
    const d = await extractErrorDetails(
      res(
        {
          status: false,
          message: 'Você atingiu o limite do seu plano (3 de 3).',
          response: {
            code: 'PLAN_LIMIT_REACHED',
            feature: 'ponds.included',
            limit: 3,
            used: 3,
            current_plan: 'free',
            required_plan: 'starter',
          },
          paramError: false,
        },
        402,
      ),
    );
    expect(d.code).toBe('PLAN_LIMIT_REACHED');
    expect(d.details).toMatchObject({ limit: 3, required_plan: 'starter' });
  });

  it('403 de contexto vem fora do envelope, com code na raiz', async () => {
    const d = await extractErrorDetails(res({ error: 'x', code: 'COMPANY_ACCESS_DENIED' }, 403));
    expect(d.code).toBe('COMPANY_ACCESS_DENIED');
  });

  it('403 de papel/permissão: sem code, guarda o que faltou', async () => {
    const d = await extractErrorDetails(
      res({ message: 'Acesso negado.', permission: 'create-tank' }, 403),
    );
    expect(d.code).toBeUndefined();
    expect(d.details).toEqual({ permission: 'create-tank' });
  });

  it('422 com paramError: erros por campo em response.errors', async () => {
    const d = await extractErrorDetails(
      res(
        {
          status: false,
          message: 'The email is required.',
          response: { errors: { email: ['The email is required.'] } },
          paramError: true,
        },
        422,
      ),
    );
    expect(d.fieldErrors).toEqual({ email: ['The email is required.'] });
  });

  it('debug do Laravel em response (sem code) não vira detalhe de negócio', async () => {
    const d = await extractErrorDetails(
      res(
        {
          status: false,
          message: 'Biomassa insuficiente.',
          response: { exception: 'X', file: '/var/www/x.php', line: 1 },
          paramError: false,
        },
        422,
      ),
    );
    expect(d.code).toBeUndefined();
    expect(d.details).toBeUndefined();
    expect(d.message).toBe('Biomassa insuficiente.');
  });
});
