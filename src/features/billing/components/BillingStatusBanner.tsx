'use client';

import { AlertOctagon, AlertTriangle, Clock, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { trialWarningDays } from '@/shared/access/entitlements';
import { readOnlyReason } from '@/shared/access/messages';
import { useAccessSnapshot } from '@/shared/access/useEntitlements';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useOldestOverdueInvoice, useSubscription } from '../hooks/queries';
import { formatDate } from '../utils/format';
import { canManageBilling } from '../utils/permissions';
import { daysUntil } from '../utils/statusView';

const BANNER = 'flex flex-wrap items-center gap-3 border-b px-4 py-3 text-sm lg:px-8';
const CTA_DARK =
  'inline-flex items-center gap-1 rounded-md px-3 py-1.5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const TRIAL_DISMISS_KEY = 'piuba:trial-banner-dismissed';

function readDismissed(days: number): boolean {
  try {
    return globalThis.sessionStorage?.getItem(TRIAL_DISMISS_KEY) === String(days);
  } catch {
    return false;
  }
}

function writeDismissed(days: number) {
  try {
    globalThis.sessionStorage?.setItem(TRIAL_DISMISS_KEY, String(days));
  } catch {
    // Storage bloqueado: o aviso volta na próxima página, sem prejuízo.
  }
}

function countdown(days: number | null): string {
  if (days === null) return '';
  if (days === 0) return ' O prazo termina hoje.';
  return days === 1 ? ' Resta 1 dia.' : ` Restam ${days} dias.`;
}

function trialText(days: number): string {
  if (days === 0) return 'O teste gratuito termina hoje.';
  return days === 1
    ? 'O teste gratuito termina amanhã.'
    : `O teste gratuito termina em ${days} dias.`;
}

/**
 * Banners globais, para todos os papéis (fonte: `GET /api/subscription`):
 *  - somente leitura (teste expirado ou assinatura suspensa): persistente;
 *  - pagamento em atraso: a escrita continua liberada; a suspensão vem em D+7;
 *  - fim do teste em D-7, D-3, D-1 (a API não avisa por e-mail nem notificação).
 * O CTA de billing só aparece para admin ou acima (as rotas de billing exigem isso).
 */
export function BillingStatusBanner() {
  const { user } = useAuthContext();
  const canManage = canManageBilling(user?.role);
  const pathname = usePathname();
  const { data: snapshot } = useAccessSnapshot();
  const status = snapshot?.status;

  // Detalhes de cobrança (prazo e link de pagamento) só existem para quem gerencia o billing.
  const { data: sub } = useSubscription({ enabled: status === 'overdue' });
  const overdue = useOldestOverdueInvoice(status === 'overdue' && canManage);

  const trialDays = trialWarningDays(snapshot);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  if (!snapshot) return null;

  if (snapshot.readOnly) {
    const suspended = status === 'suspended';
    const target = suspended ? '/dashboard/assinatura/faturas' : '/dashboard/assinatura/planos';
    return (
      <div role="alert" className={`${BANNER} border-red-300 bg-red-600 text-white`}>
        <AlertOctagon className="size-4 shrink-0" aria-hidden="true" />
        <p className="flex-1">
          <strong>Somente leitura.</strong>{' '}
          {readOnlyReason(suspended ? 'SUBSCRIPTION_SUSPENDED' : 'TRIAL_EXPIRED')}
          {canManage ? null : ' Peça a um administrador da empresa.'}
        </p>
        {canManage && pathname !== target ? (
          <Link
            href={target}
            className={`${CTA_DARK} bg-white text-red-700 hover:bg-red-50 focus-visible:ring-white focus-visible:ring-offset-red-600`}
          >
            {suspended ? 'Regularizar pagamento' : 'Ver planos'}
          </Link>
        ) : null}
      </div>
    );
  }

  if (status === 'overdue') {
    const payUrl = overdue.oldest?.invoiceUrl;
    const deadline = sub?.gracePeriodEndsAt ?? null;
    return (
      <div role="alert" className={`${BANNER} border-amber-200 bg-amber-50 text-amber-950`}>
        <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
        <p className="flex-1">
          <strong>Pagamento em atraso.</strong> Os registros continuam liberados.{' '}
          {deadline
            ? `Regularize até ${formatDate(deadline)} para a empresa não entrar em modo somente leitura.${countdown(daysUntil(deadline))}`
            : 'Sem pagamento em até 7 dias do vencimento, a empresa entra em modo somente leitura.'}
          {canManage ? null : ' Avise um administrador da empresa.'}
        </p>
        {canManage && payUrl ? (
          <a
            href={payUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${CTA_DARK} bg-amber-900 text-white hover:bg-amber-950 focus-visible:ring-amber-900`}
          >
            Pagar agora
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        ) : null}
        {canManage && !payUrl ? (
          <Link
            href="/dashboard/assinatura/faturas?status=overdue"
            className={`${CTA_DARK} bg-amber-900 text-white hover:bg-amber-950 focus-visible:ring-amber-900`}
          >
            Ver faturas
          </Link>
        ) : null}
      </div>
    );
  }

  if (trialDays !== null && dismissedAt !== trialDays && !readDismissed(trialDays)) {
    return (
      <div role="status" className={`${BANNER} border-sky-200 bg-sky-50 text-sky-950`}>
        <Clock className="size-4 shrink-0" aria-hidden="true" />
        <p className="flex-1">
          <strong>{trialText(trialDays)}</strong> Depois disso a empresa fica em modo somente
          leitura até a assinatura de um plano.
          {canManage ? null : ' Avise um administrador da empresa.'}
        </p>
        {canManage ? (
          <Link
            href="/dashboard/assinatura/planos"
            className={`${CTA_DARK} bg-sky-900 text-white hover:bg-sky-950 focus-visible:ring-sky-900`}
          >
            Ver planos
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => {
            writeDismissed(trialDays);
            setDismissedAt(trialDays);
          }}
          aria-label="Dispensar aviso do teste"
          className="rounded-md p-1 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-900"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return null;
}
