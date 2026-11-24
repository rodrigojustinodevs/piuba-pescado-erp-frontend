'use client';

import { AlertOctagon, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOldestOverdueInvoice, useSubscription } from '../hooks/queries';
import { formatDate } from '../utils/format';
import { daysUntil } from '../utils/statusView';

function countdown(days: number | null): string {
  if (days === null) return '';
  if (days === 0) return ' O acesso termina hoje.';
  return days === 1 ? ' Resta 1 dia.' : ` Restam ${days} dias.`;
}

/**
 * Banner de atraso/suspensão em todo o app, só para quem gerencia o billing
 * (`useSubscription` fica desabilitado para os demais papéis).
 */
export function BillingStatusBanner() {
  const { data: sub } = useSubscription();
  const status = sub?.status;
  const pathname = usePathname();
  const overdue = useOldestOverdueInvoice(status === 'overdue');

  if (status === 'overdue') {
    const payUrl = overdue.oldest?.invoiceUrl;
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 lg:px-8"
      >
        <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
        <p className="flex-1">
          <strong>Pagamento em atraso.</strong> Regularize até {formatDate(sub?.gracePeriodEndsAt)}{' '}
          para não perder o acesso.{countdown(daysUntil(sub?.gracePeriodEndsAt ?? null))}
        </p>
        {payUrl ? (
          <a
            href={payUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-amber-900 px-3 py-1.5 font-medium text-white hover:bg-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2"
          >
            Pagar agora
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        ) : (
          <Link
            href="/dashboard/assinatura/faturas?status=overdue"
            className="rounded-md bg-amber-900 px-3 py-1.5 font-medium text-white hover:bg-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2"
          >
            Ver faturas
          </Link>
        )}
      </div>
    );
  }

  if (status === 'suspended') {
    const onInvoices = pathname === '/dashboard/assinatura/faturas';
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center gap-3 border-b border-red-300 bg-red-600 px-4 py-3 text-sm text-white lg:px-8"
      >
        <AlertOctagon className="size-4 shrink-0" aria-hidden="true" />
        <p className="flex-1">
          <strong>Assinatura suspensa.</strong> As funcionalidades pagas estão bloqueadas até o
          pagamento das faturas em aberto.
        </p>
        {onInvoices ? null : (
          <Link
            href="/dashboard/assinatura/faturas"
            className="rounded-md bg-white px-3 py-1.5 font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-600"
          >
            Regularizar pagamento
          </Link>
        )}
      </div>
    );
  }

  return null;
}
