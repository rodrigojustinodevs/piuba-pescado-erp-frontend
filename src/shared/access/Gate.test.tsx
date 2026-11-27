import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AccessSnapshot } from './types';

let role = 'operator';
vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuthContext: () => ({ user: { role, companyId: 'c1' }, isAuthenticated: true }),
}));

import { Gate } from './Gate';
import { accessKeys } from './handleApiError';

function snapshot(over: Partial<AccessSnapshot> = {}): AccessSnapshot {
  return {
    plan: { code: 'free', name: 'Free' },
    status: 'trialing',
    readOnly: false,
    trialEndsAt: null,
    daysLeftInTrial: 20,
    entitlements: [
      {
        key: 'ponds.included',
        type: 'limit',
        label: 'Tanques',
        enabled: true,
        limit: 3,
        used: 3,
        remaining: 0,
        resetPeriod: null,
        resetsAt: null,
      },
    ],
    ...over,
  };
}

function renderWith(ui: ReactNode, snap: AccessSnapshot | null) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  if (snap) client.setQueryData(accessKeys.subscription('c1'), snap);
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('<Gate>', () => {
  afterEach(() => {
    cleanup();
    role = 'operator';
  });

  it('papel insuficiente esconde (ou mostra o fallback)', () => {
    renderWith(
      <Gate role="manager" fallback={<span>sem acesso</span>}>
        <button type="button">Revisar</button>
      </Gate>,
      snapshot(),
    );
    expect(screen.queryByRole('button', { name: 'Revisar' })).toBeNull();
    expect(screen.getByText('sem acesso')).toBeTruthy();
  });

  it('permissão da matriz: operator gera plano de IA', () => {
    renderWith(
      <Gate permission="generate-management-plan">
        <button type="button">Gerar</button>
      </Gate>,
      snapshot(),
    );
    expect(screen.getByRole('button', { name: 'Gerar' })).toBeTruthy();
  });

  it('limite do plano atingido: desabilita e explica', () => {
    role = 'manager';
    renderWith(
      <Gate permission="create-tank" feature="ponds.included">
        <button type="button">Novo tanque</button>
      </Gate>,
      snapshot(),
    );
    const button = screen.getByRole('button', { name: 'Novo tanque' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(screen.getByLabelText(/Seu plano Free permite 3 tanques ativos/)).toBeTruthy();
  });

  it('somente leitura desabilita qualquer escrita', () => {
    renderWith(
      <Gate write>
        <button type="button">Registrar</button>
      </Gate>,
      snapshot({ status: 'expired', readOnly: true }),
    );
    expect((screen.getByRole('button', { name: 'Registrar' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('sem snapshot (carregando) não bloqueia', () => {
    renderWith(
      <Gate write feature="ponds.included">
        <button type="button">Registrar</button>
      </Gate>,
      null,
    );
    expect((screen.getByRole('button', { name: 'Registrar' }) as HTMLButtonElement).disabled).toBe(
      false,
    );
  });
});
