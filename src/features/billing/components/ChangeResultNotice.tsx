'use client';

import { CheckCircle2, ExternalLink, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type { SubscriptionChange } from '../types';
import { formatCents, formatDate } from '../utils/format';

function describe(change: SubscriptionChange): { text: string; payUrl?: string | null } | null {
  switch (change.kind) {
    case 'upgrade_immediate': {
      const p = change.proration;
      if (!p) return { text: 'Plano alterado. A mudança já está valendo.' };
      if (p.waived) return { text: 'Plano alterado. Não houve cobrança proporcional.' };
      const days = `${p.remainingDays} de ${p.totalDays} dias restantes`;
      return {
        text: `Plano alterado. Cobrança proporcional de ${formatCents(p.amountCents)} (${days}).`,
        payUrl: p.charge?.created ? (p.charge.paymentUrl ?? null) : null,
      };
    }
    case 'scheduled_downgrade':
    case 'scheduled_cycle_change':
      return { text: `Mudança agendada para ${formatDate(change.effectiveAt)}.` };
    case 'payment_method':
      return { text: 'Forma de pagamento alterada.' };
    case 'canceled_at_period_end':
      return { text: 'Cancelamento agendado para o fim do período.' };
    case 'scheduled_change_removed':
      return { text: 'A mudança agendada foi desfeita.' };
    case 'none':
      return { text: 'Nada foi alterado.' };
    default:
      return null;
  }
}

/** Resultado do PATCH conforme `change.kind` devolvido pela API. */
export function ChangeResultNotice({
  change,
  onDismiss,
}: Readonly<{ change: SubscriptionChange; onDismiss: () => void }>) {
  const info = describe(change);
  if (!info) return null;
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"
    >
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-2">
        <p>{info.text}</p>
        {info.payUrl ? (
          <a
            href={info.payUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 font-medium underline underline-offset-4"
          >
            Pagar valor proporcional
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        aria-label="Fechar aviso"
        className="size-7"
      >
        <X aria-hidden="true" />
      </Button>
    </div>
  );
}
