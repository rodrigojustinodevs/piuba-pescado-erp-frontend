import { QueryClient } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from '@/shared/lib/http/httpError';
import { accessEvents, type AccessNotice } from './accessEvents';
import { __resetRequiredPlansForTests, requiredPlanFor } from './entitlements';
import { handleApiError } from './handleApiError';

function setup() {
  const client = new QueryClient();
  client.setQueryData(['auth', 'check'], { user: { companyId: 'c1' } });
  const invalidate = vi.spyOn(client, 'invalidateQueries');
  const notices: AccessNotice[] = [];
  const off = accessEvents.onNotice((n) => notices.push(n));
  return { client, invalidate, notices, off };
}

const mutation = { isMutation: true, queryKey: ['tanks', 'create'] };

describe('handleApiError', () => {
  afterEach(() => {
    accessEvents.reset();
    __resetRequiredPlansForTests();
  });

  it('401 → sessão encerrada', () => {
    const { client, notices, off } = setup();
    handleApiError(client, new HttpError('x', 401), mutation);
    expect(notices).toEqual([{ type: 'sessionEnded' }]);
    off();
  });

  it('402 PLAN_LIMIT_REACHED → modal, guarda required_plan e recarrega o plano', () => {
    const { client, invalidate, off } = setup();
    handleApiError(
      client,
      new HttpError('limite', 402, undefined, {
        code: 'PLAN_LIMIT_REACHED',
        details: {
          feature: 'ponds.included',
          limit: 3,
          used: 3,
          current_plan: 'free',
          required_plan: 'starter',
        },
      }),
      mutation,
    );
    expect(accessEvents.getState().planDialog).toMatchObject({
      kind: 'limitReached',
      block: { used: 3, limit: 3 },
    });
    expect(requiredPlanFor('c1', 'ponds.included')).toBe('starter');
    expect(invalidate).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['access'] }));
    off();
  });

  it('402 TRIAL_EXPIRED → sem modal; aviso de somente leitura e recarga do plano', () => {
    const { client, invalidate, notices, off } = setup();
    handleApiError(client, new HttpError('x', 402, undefined, { code: 'TRIAL_EXPIRED' }), mutation);
    expect(accessEvents.getState().planDialog).toBeNull();
    expect(notices[0]).toMatchObject({ type: 'readOnly' });
    expect(invalidate).toHaveBeenCalled();
    off();
  });

  it('403 COMPANY_ACCESS_DENIED → tela sem acesso (sem logout); NO_COMPANY_CONTEXT → seletor', () => {
    const { client, notices, off } = setup();
    handleApiError(
      client,
      new HttpError('x', 403, undefined, { code: 'COMPANY_ACCESS_DENIED' }),
      mutation,
    );
    expect(accessEvents.getState().companyDenied).toBe(true);
    handleApiError(
      client,
      new HttpError('x', 403, undefined, { code: 'NO_COMPANY_CONTEXT' }),
      mutation,
    );
    expect(accessEvents.getState().companySelectorOpen).toBe(true);
    expect(notices.some((n) => n.type === 'sessionEnded')).toBe(false);
    off();
  });

  it('403 sem code: toast só em mutação', () => {
    const { client, notices, off } = setup();
    handleApiError(client, new HttpError('x', 403), { isMutation: false, queryKey: ['tanks'] });
    expect(notices).toEqual([]);
    handleApiError(client, new HttpError('x', 403), mutation);
    expect(notices[0]).toMatchObject({ type: 'forbidden' });
    off();
  });

  it('409 → mensagem e recarga da assinatura', () => {
    const { client, invalidate, notices, off } = setup();
    handleApiError(client, new HttpError('Troca concorrente.', 409), mutation);
    expect(notices[0]).toEqual({ type: 'conflict', message: 'Troca concorrente.' });
    expect(invalidate).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['billing'] }));
    off();
  });

  it('422 fica com a tela', () => {
    const { client, invalidate, notices, off } = setup();
    handleApiError(client, new HttpError('Biomassa insuficiente.', 422), mutation);
    expect(notices).toEqual([]);
    expect(invalidate).not.toHaveBeenCalled();
    off();
  });
});
