'use client';

import { AlertTriangle, Loader2, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { extractHttpStatus } from '@/shared/lib/http/httpError';
import { billingErrorMessage, FORBIDDEN_BILLING_MESSAGE } from '../utils/errors';

export function BillingLoading({ label = 'Carregando…' }: Readonly<{ label?: string }>) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"
    >
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function BillingNoAccess() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-12 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <Lock className="size-5" aria-hidden="true" />
      </span>
      <h2 className="text-base font-semibold text-foreground">Sem acesso à assinatura</h2>
      <p className="max-w-md text-sm text-muted-foreground">{FORBIDDEN_BILLING_MESSAGE}</p>
    </div>
  );
}

type ErrorProps = Readonly<{ error: unknown; onRetry?: () => void; title?: string }>;

/** Erro de carregamento. 403 vira a tela de "sem acesso". */
export function BillingError({ error, onRetry, title = 'Não foi possível carregar' }: ErrorProps) {
  if (extractHttpStatus(error) === 403) return <BillingNoAccess />;
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
    >
      <AlertTriangle className="size-5 text-red-700" aria-hidden="true" />
      <div>
        <p className="font-medium text-red-900">{title}</p>
        <p className="mt-1 text-sm text-red-800">{billingErrorMessage(error)}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Tentar de novo
        </Button>
      ) : null}
    </div>
  );
}

export function BillingEmpty({
  title,
  children,
}: Readonly<{ title: string; children?: ReactNode }>) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {children ? <div className="text-sm text-muted-foreground">{children}</div> : null}
    </div>
  );
}

/** Mensagem de erro de uma ação (409/422/429/5xx), anunciada a leitores de tela. */
export function ActionError({ error }: Readonly<{ error: unknown }>) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
    >
      {billingErrorMessage(error)}
    </p>
  );
}
