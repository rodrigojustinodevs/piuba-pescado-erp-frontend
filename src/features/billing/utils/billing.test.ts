import { describe, expect, it } from 'vitest';
import { HttpError } from '@/shared/lib/http/httpError';
import type { Subscription } from '../types';
import { mapSubscription } from './apiMapper';
import { previewCancel, previewChange } from './changePreview';
import { validateDocument, isValidCpf } from './document';
import { billingErrorMessage, isUncertainFailure } from './errors';
import { parseGateError } from './gating';
import { canManageBilling } from './permissions';
import { getPollPhase, nextPollInterval, POLL_INTERVAL_MS, POLL_TIMEOUT_MS } from './polling';
import { daysUntil, getSubscriptionView } from './statusView';

const fmt = (v: string | null) => v ?? '—';
const sub = (over: Partial<Subscription> = {}): Subscription =>
  mapSubscription({
    id: 1,
    planTier: 'professional',
    billingCycle: 'monthly',
    paymentMethod: 'pix',
    status: 'active',
    hasAccess: true,
    currentPeriodEnd: '2026-12-10',
    ...over,
  });

describe('getSubscriptionView', () => {
  it('sem assinatura: plano gratuito, oferece contratar', () => {
    const view = getSubscriptionView(
      mapSubscription({ planTier: 'free', id: null, status: null }),
      fmt,
    );
    expect(view).toMatchObject({
      isFree: true,
      banner: 'none',
      primaryAction: { kind: 'subscribe' },
    });
  });

  it('pending: botão para pagar com payment.url', () => {
    const view = getSubscriptionView(
      sub({
        status: 'pending',
        payment: { url: 'https://pay', pixQrCode: null, pixAuthorizationStatus: null },
      }),
      fmt,
    );
    expect(view.primaryAction).toEqual({ kind: 'pay', url: 'https://pay' });
    expect(view.label).toBe('Aguardando pagamento');
    expect(view.canChange).toBe(false);
  });

  it('active: permite trocar e cancelar', () => {
    const view = getSubscriptionView(sub(), fmt);
    expect(view).toMatchObject({
      tone: 'success',
      canChange: true,
      canCancel: true,
      banner: 'none',
    });
  });

  it('active com cancelAtPeriodEnd: mostra a data de fim e não permite trocar', () => {
    const view = getSubscriptionView(sub({ cancelAtPeriodEnd: true }), fmt);
    expect(view.headline).toBe('Cancelada: acesso até 2026-12-10');
    expect(view).toMatchObject({ canChange: false, canCancel: false });
  });

  it('overdue: banner de alerta com contagem e pagar a fatura mais antiga', () => {
    const view = getSubscriptionView(
      sub({ status: 'overdue', gracePeriodEndsAt: '2026-11-20' }),
      fmt,
      new Date('2026-11-15T12:00:00'),
    );
    expect(view.banner).toBe('overdue');
    expect(view.primaryAction).toEqual({ kind: 'pay_oldest_overdue' });
    expect(view.description).toContain('6 dias');
  });

  it('suspended: banner crítico levando às faturas', () => {
    const view = getSubscriptionView(sub({ status: 'suspended', hasAccess: false }), fmt);
    expect(view).toMatchObject({
      banner: 'suspended',
      tone: 'danger',
      primaryAction: { kind: 'invoices' },
    });
  });

  it('canceled: oferece novo plano', () => {
    const view = getSubscriptionView(sub({ status: 'canceled' }), fmt);
    expect(view).toMatchObject({ isFree: true, primaryAction: { kind: 'subscribe' } });
  });

  it('daysUntil não fica negativo', () => {
    expect(daysUntil('2026-11-01', new Date('2026-11-15T12:00:00'))).toBe(0);
    expect(daysUntil(null)).toBeNull();
  });
});

describe('parseGateError', () => {
  const gate = (code: string, status = 403) =>
    new HttpError('bloqueado', status, undefined, {
      code,
      details: { feature: 'ai_management_plan', currentTier: 'free', requiredTier: 'professional' },
    });

  it.each(['PLAN_UPGRADE_REQUIRED', 'SUBSCRIPTION_SUSPENDED', 'SUBSCRIPTION_PENDING'])(
    'reconhece %s com feature e tiers',
    (code) => {
      expect(parseGateError(gate(code))).toEqual({
        code,
        feature: 'ai_management_plan',
        currentTier: 'free',
        requiredTier: 'professional',
        message: 'bloqueado',
      });
    },
  );

  it('403 sem code (papel sem permissão) não é gating', () => {
    expect(parseGateError(new HttpError('proibido', 403))).toBeNull();
  });

  it('code desconhecido ou outro status não é gating', () => {
    expect(parseGateError(gate('OUTRA_COISA'))).toBeNull();
    expect(parseGateError(gate('PLAN_UPGRADE_REQUIRED', 409))).toBeNull();
    expect(parseGateError(new Error('x'))).toBeNull();
  });
});

describe('polling pós-contratação', () => {
  const t0 = 1_000_000;

  it('continua a cada 5 s enquanto pending', () => {
    expect(nextPollInterval({ status: 'pending', startedAt: t0, now: t0 + 10_000 })).toBe(
      POLL_INTERVAL_MS,
    );
  });

  it('para quando a assinatura fica active', () => {
    expect(nextPollInterval({ status: 'active', startedAt: t0, now: t0 + 10_000 })).toBe(false);
    expect(getPollPhase({ status: 'active', startedAt: t0, now: t0 })).toBe('confirmed');
  });

  it('para por tempo depois de ~2 min', () => {
    const state = { status: 'pending' as const, startedAt: t0, now: t0 + POLL_TIMEOUT_MS };
    expect(nextPollInterval(state)).toBe(false);
    expect(getPollPhase(state)).toBe('timed_out');
  });

  it('não faz polling se o aguardo não começou', () => {
    expect(nextPollInterval({ status: 'pending', startedAt: null, now: t0 })).toBe(false);
  });
});

describe('confirmação antes de trocar e cancelar', () => {
  it('upgrade pede confirmação avisando da cobrança proporcional', () => {
    const p = previewChange(sub({ planTier: 'starter' }), { planTier: 'enterprise' }, fmt);
    expect(p.kind).toBe('upgrade');
    expect(p.requiresConfirmation).toBe(true);
    expect(p.warnings.join(' ')).toMatch(/cobrança proporcional/);
  });

  it('downgrade avisa a data e que não há reembolso', () => {
    const p = previewChange(sub(), { planTier: 'starter' }, fmt);
    expect(p.kind).toBe('downgrade');
    expect(p.warnings.join(' ')).toMatch(/2026-12-10/);
    expect(p.warnings.join(' ')).toMatch(/reembolso/);
  });

  it('mudança de ciclo é agendada para o fim do período', () => {
    const p = previewChange(sub(), { billingCycle: 'yearly' }, fmt);
    expect(p.kind).toBe('cycle_change');
    expect(p.warnings.join(' ')).toMatch(/2026-12-10/);
  });

  it('trocar para free equivale a cancelar no fim do período', () => {
    expect(previewChange(sub(), { planTier: 'free' }, fmt).kind).toBe('cancel');
  });

  it('nada mudou não pede confirmação', () => {
    expect(previewChange(sub(), { planTier: 'professional' }, fmt)).toMatchObject({
      kind: 'none',
      requiresConfirmation: false,
    });
  });

  it('cancelamento é confirmado e mostra até quando há acesso', () => {
    const p = previewCancel(sub(), fmt);
    expect(p).toMatchObject({ requiresConfirmation: true, destructive: true });
    expect(p.warnings[0]).toBe('Você continua com acesso até 2026-12-10.');
  });

  it('assinatura nunca paga é cancelada na hora', () => {
    expect(previewCancel(sub({ status: 'pending' }), fmt).warnings[0]).toMatch(/imediatamente/);
  });
});

describe('erros, documento e permissão', () => {
  it('5xx vira mensagem genérica e 429 usa Retry-After', () => {
    expect(billingErrorMessage(new HttpError('stack trace', 502))).toBe(
      'Tente novamente em instantes.',
    );
    expect(
      billingErrorMessage(new HttpError('x', 429, undefined, { retryAfterSeconds: 20 })),
    ).toContain('20 s');
  });

  it('timeout é falha incerta (consultar antes de repetir)', () => {
    expect(isUncertainFailure(new HttpError('t', 504))).toBe(true);
    expect(isUncertainFailure(new HttpError('x', 422))).toBe(false);
  });

  it('valida CPF/CNPJ opcional', () => {
    expect(validateDocument('')).toBeNull();
    expect(isValidCpf('529.982.247-25')).toBe(true);
    expect(validateDocument('111.111.111-11')).toBe('CPF inválido.');
    expect(validateDocument('11.222.333/0001-81')).toBeNull();
    expect(validateDocument('123')).toMatch(/CPF/);
  });

  it('só admin, company_admin e master acessam billing', () => {
    expect(canManageBilling('company_admin')).toBe(true);
    expect(canManageBilling('admin')).toBe(true);
    expect(canManageBilling('master-admin')).toBe(true);
    expect(canManageBilling('manager')).toBe(false);
    expect(canManageBilling('operator')).toBe(false);
  });
});
