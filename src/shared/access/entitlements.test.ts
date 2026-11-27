import { afterEach, describe, expect, it } from 'vitest';
import {
  __resetRequiredPlansForTests,
  canUse,
  mapAccessSnapshot,
  rememberRequiredPlan,
  remainingOf,
  requiredPlanFor,
  trialWarningDays,
  usageOf,
} from './entitlements';
import { limitMessage, planBlockReason } from './messages';

const api = (over: Record<string, unknown> = {}) =>
  mapAccessSnapshot({
    plan: { code: 'free', name: 'Free' },
    status: 'trialing',
    read_only: false,
    trial_ends_at: '2026-12-27T00:00:00-03:00',
    days_left_in_trial: 30,
    entitlements: [
      {
        key: 'ponds.included',
        type: 'limit',
        label: 'Tanques',
        enabled: true,
        limit: 3,
        used: 2,
        remaining: 1,
        reset_period: null,
      },
      {
        key: 'finance.full',
        type: 'boolean',
        label: 'Financeiro completo',
        enabled: false,
        limit: null,
        used: null,
        remaining: null,
      },
      {
        key: 'ai.management_plan',
        type: 'quota',
        label: 'IA',
        enabled: true,
        limit: 1,
        used: 1,
        remaining: 0,
        reset_period: 'never',
        resets_at: null,
      },
    ],
    ...over,
  });

describe('entitlements', () => {
  afterEach(() => __resetRequiredPlansForTests());

  it('mapeia o payload de GET /api/subscription', () => {
    const s = api();
    expect(s).toMatchObject({
      plan: { code: 'free' },
      status: 'trialing',
      readOnly: false,
      daysLeftInTrial: 30,
    });
    expect(s.entitlements).toHaveLength(3);
  });

  it('can: boolean desligado, limite com saldo e cota esgotada', () => {
    const s = api();
    expect(canUse(s, 'finance.full')).toBe(false);
    expect(canUse(s, 'ponds.included')).toBe(true);
    expect(canUse(s, 'ai.management_plan')).toBe(false);
    expect(remainingOf(s, 'ponds.included')).toBe(1);
    expect(usageOf(s, 'ponds.included')).toEqual({ used: 2, limit: 3, remaining: 1 });
  });

  it('sem snapshot ou feature desconhecida não bloqueia (a API decide)', () => {
    expect(canUse(null, 'finance.full')).toBe(true);
    expect(canUse(api(), 'algo.novo')).toBe(true);
  });

  it('aviso de teste só em D-7, D-3, D-1 e no último dia', () => {
    expect(trialWarningDays(api({ days_left_in_trial: 7 }))).toBe(7);
    expect(trialWarningDays(api({ days_left_in_trial: 3 }))).toBe(3);
    expect(trialWarningDays(api({ days_left_in_trial: 1 }))).toBe(1);
    expect(trialWarningDays(api({ days_left_in_trial: 0 }))).toBe(0);
    expect(trialWarningDays(api({ days_left_in_trial: 5 }))).toBeNull();
    expect(trialWarningDays(api({ status: 'active', days_left_in_trial: 7 }))).toBeNull();
  });

  it('requiredPlanFor só conhece o plano depois de um 402, por empresa', () => {
    expect(requiredPlanFor('c1', 'finance.full')).toBeNull();
    rememberRequiredPlan('c1', 'finance.full', 'starter');
    expect(requiredPlanFor('c1', 'finance.full')).toBe('starter');
    expect(requiredPlanFor('c2', 'finance.full')).toBeNull();
  });
});

describe('planBlockReason (motivo do botão desabilitado)', () => {
  afterEach(() => __resetRequiredPlansForTests());

  it('somente leitura bloqueia qualquer escrita', () => {
    const reason = planBlockReason(api({ status: 'expired', read_only: true }), null, 'c1');
    expect(reason).toMatch(/somente leitura/);
  });

  it('feature fora do plano: genérico até o primeiro 402, depois cita o plano', () => {
    expect(planBlockReason(api(), 'finance.full', 'c1')).toMatch(/Disponível em planos superiores/);
    rememberRequiredPlan('c1', 'finance.full', 'starter');
    expect(planBlockReason(api(), 'finance.full', 'c1')).toMatch(/upgrade para o Starter/);
  });

  it('limite com saldo libera; sem saldo explica', () => {
    expect(planBlockReason(api(), 'ponds.included', 'c1')).toBeNull();
    const full = api({
      entitlements: [
        { key: 'ponds.included', type: 'limit', enabled: true, limit: 3, used: 3, remaining: 0 },
      ],
    });
    expect(planBlockReason(full, 'ponds.included', 'c1')).toBe(
      'Seu plano Free permite 3 tanques ativos. Desative um tanque ou faça upgrade para um plano superior.',
    );
  });

  it('texto do exemplo do contrato', () => {
    expect(
      limitMessage({
        feature: 'ponds.included',
        limit: 3,
        currentPlan: 'free',
        requiredPlan: 'starter',
      }),
    ).toBe(
      'Seu plano Free permite 3 tanques ativos. Desative um tanque ou faça upgrade para o Starter.',
    );
  });
});
