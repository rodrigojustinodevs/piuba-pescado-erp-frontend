'use client';

import { ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Button, buttonVariants } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/utils';
import {
  useCancelSubscription,
  useChangeSubscription,
  useOldestOverdueInvoice,
  usePlans,
  useSubscription,
} from '../hooks/queries';
import { useRetryCooldown } from '../hooks/useRetryCooldown';
import type { BillingCycle, Plan, PlanTier, Subscription, SubscriptionChange } from '../types';
import { previewCancel } from '../utils/changePreview';
import { formatBRL, formatDate, planPrice } from '../utils/format';
import {
  CYCLE_LABELS,
  CYCLE_UNIT,
  PAYMENT_METHOD_LABELS,
  TIER_ORDER,
  tierLabel,
} from '../utils/labels';
import { getSubscriptionView, type SubscriptionView } from '../utils/statusView';
import { BillingSection } from './BillingSection';
import { ChangePlanDialog } from './ChangePlanDialog';
import { ChangeResultNotice } from './ChangeResultNotice';
import { ConfirmChangeDialog } from './ConfirmChangeDialog';
import { StatusBadge } from './StatusBadge';
import { ActionError, BillingError, BillingLoading } from './states';

function Detail({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

function isTier(value: string | null): value is PlanTier {
  return value !== null && (TIER_ORDER as readonly string[]).includes(value);
}

export function SubscriptionOverview() {
  const subQuery = useSubscription();
  const plansQuery = usePlans();

  if (subQuery.isPending || plansQuery.isPending)
    return <BillingLoading label="Carregando assinatura…" />;
  if (subQuery.isError)
    return <BillingError error={subQuery.error} onRetry={() => void subQuery.refetch()} />;
  if (plansQuery.isError)
    return <BillingError error={plansQuery.error} onRetry={() => void plansQuery.refetch()} />;

  return <Overview subscription={subQuery.data} plans={plansQuery.data} />;
}

function Overview({
  subscription: sub,
  plans,
}: Readonly<{ subscription: Subscription; plans: Plan[] }>) {
  const view = getSubscriptionView(sub, formatDate);
  const plan = plans.find((p) => p.tier === sub.planTier);
  const price = planPrice(plan, sub.billingCycle);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedTier = searchParams.get('trocar');
  const requestedCycle = searchParams.get('ciclo');
  const [changeOpen, setChangeOpen] = useState(() => isTier(requestedTier) && view.canChange);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [lastChange, setLastChange] = useState<SubscriptionChange | null>(null);

  function closeChange(open: boolean) {
    setChangeOpen(open);
    // Limpa ?trocar= para não reabrir ao recarregar.
    if (!open && requestedTier) router.replace(pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-6">
      {lastChange ? (
        <ChangeResultNotice change={lastChange} onDismiss={() => setLastChange(null)} />
      ) : null}

      <BillingSection
        title={`Plano ${tierLabel(sub.planTier)}`}
        description={view.headline}
        aside={<StatusBadge tone={view.tone} label={view.label} />}
      >
        <div className="flex flex-col gap-5">
          {view.description ? (
            <p className="text-sm text-muted-foreground">{view.description}</p>
          ) : null}

          {view.isFree ? null : (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Valor">
                {price !== null && sub.billingCycle ? (
                  <span className="tabular-nums">
                    {formatBRL(price)}
                    {CYCLE_UNIT[sub.billingCycle]}
                  </span>
                ) : (
                  '—'
                )}
              </Detail>
              <Detail label="Ciclo">
                {sub.billingCycle ? CYCLE_LABELS[sub.billingCycle] : '—'}
              </Detail>
              <Detail label="Forma de pagamento">
                {sub.paymentMethod ? PAYMENT_METHOD_LABELS[sub.paymentMethod] : '—'}
              </Detail>
              <Detail label="Período atual">
                {sub.currentPeriodStart
                  ? `${formatDate(sub.currentPeriodStart)} a ${formatDate(sub.currentPeriodEnd)}`
                  : '—'}
              </Detail>
              {sub.status === 'active' && !sub.cancelAtPeriodEnd ? (
                <Detail label="Próxima cobrança">{formatDate(sub.currentPeriodEnd)}</Detail>
              ) : null}
              {sub.cancelAtPeriodEnd ? (
                <Detail label="Acesso até">{formatDate(sub.currentPeriodEnd)}</Detail>
              ) : null}
              {sub.gracePeriodEndsAt && sub.status === 'overdue' ? (
                <Detail label="Prazo para regularizar">{formatDate(sub.gracePeriodEndsAt)}</Detail>
              ) : null}
            </dl>
          )}

          {sub.pendingChange ? <PendingChangeNotice sub={sub} onUndone={setLastChange} /> : null}

          <Actions
            view={view}
            sub={sub}
            onChange={() => setChangeOpen(true)}
            onCancel={() => setCancelOpen(true)}
          />
        </div>
      </BillingSection>

      <ChangePlanDialog
        open={changeOpen}
        onOpenChange={closeChange}
        subscription={sub}
        plans={plans}
        initial={
          isTier(requestedTier)
            ? {
                planTier: requestedTier,
                billingCycle: (requestedCycle as BillingCycle | null) ?? undefined,
              }
            : undefined
        }
        onChanged={(next) => setLastChange(next.change)}
      />
      <CancelDialog open={cancelOpen} onOpenChange={setCancelOpen} sub={sub} />
    </div>
  );
}

function PendingChangeNotice({
  sub,
  onUndone,
}: Readonly<{ sub: Subscription; onUndone: (change: SubscriptionChange | null) => void }>) {
  const change = useChangeSubscription();
  const cooldown = useRetryCooldown(change.error);
  const pc = sub.pendingChange!;
  const cycle = pc.billingCycle ? ` (${CYCLE_LABELS[pc.billingCycle].toLowerCase()})` : '';

  function undo() {
    if (change.isPending) return;
    // Pedir o plano/ciclo atuais desfaz a troca agendada (`scheduled_change_removed`).
    change.mutate(
      {
        plan_tier: sub.planTier,
        ...(sub.billingCycle ? { billing_cycle: sub.billingCycle } : {}),
      },
      { onSuccess: (next) => onUndone(next.change) },
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>
          Seu plano muda para <strong>{tierLabel(pc.planTier)}</strong>
          {cycle} em <strong>{formatDate(pc.effectiveAt)}</strong>.
        </p>
        {sub.status === 'active' ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={change.isPending || cooldown > 0}
          >
            {change.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            {cooldown > 0 ? `Tente em ${cooldown} s` : 'Desfazer mudança'}
          </Button>
        ) : null}
      </div>
      <ActionError error={change.error} />
    </div>
  );
}

function Actions({
  view,
  sub,
  onChange,
  onCancel,
}: Readonly<{
  view: SubscriptionView;
  sub: Subscription;
  onChange: () => void;
  onCancel: () => void;
}>) {
  const overdue = useOldestOverdueInvoice(view.primaryAction?.kind === 'pay_oldest_overdue');
  const action = view.primaryAction;

  return (
    <div className="flex flex-wrap gap-2">
      {action?.kind === 'pay' ? (
        <a href={action.url} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
          Pagar agora
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      ) : null}
      {action?.kind === 'pay_oldest_overdue' ? (
        overdue.oldest?.invoiceUrl ? (
          <a
            href={overdue.oldest.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants()}
          >
            Pagar agora
            <ExternalLink aria-hidden="true" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        ) : (
          <Link href="/dashboard/assinatura/faturas?status=overdue" className={buttonVariants()}>
            Ver faturas vencidas
          </Link>
        )
      ) : null}
      {action?.kind === 'invoices' ? (
        <Link
          href="/dashboard/assinatura/faturas"
          className={buttonVariants({ variant: 'destructive' })}
        >
          Regularizar pagamento
        </Link>
      ) : null}
      {action?.kind === 'subscribe' ? (
        <Link href="/dashboard/assinatura/planos" className={buttonVariants()}>
          Ver planos
        </Link>
      ) : null}
      {sub.status === 'pending' ? (
        <Link
          href="/dashboard/assinatura/contratar"
          className={buttonVariants({ variant: 'outline' })}
        >
          Acompanhar pagamento
        </Link>
      ) : null}

      {view.canChange ? (
        <Button type="button" variant="outline" onClick={onChange}>
          Trocar plano ou pagamento
        </Button>
      ) : null}
      {!view.canChange && !view.isFree && sub.status !== 'active' ? (
        <p className="basis-full text-xs text-muted-foreground">
          A troca de plano fica disponível quando a assinatura estiver ativa e sem faturas em
          aberto.
        </p>
      ) : null}
      {view.canCancel ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className={cn('text-red-700 hover:bg-red-50 hover:text-red-800', 'sm:ml-auto')}
        >
          Cancelar assinatura
        </Button>
      ) : null}
    </div>
  );
}

function CancelDialog({
  open,
  onOpenChange,
  sub,
}: Readonly<{ open: boolean; onOpenChange: (open: boolean) => void; sub: Subscription }>) {
  const cancel = useCancelSubscription();
  const cooldown = useRetryCooldown(cancel.error);

  function handleOpenChange(next: boolean) {
    if (!next) cancel.reset();
    onOpenChange(next);
  }

  return (
    <ConfirmChangeDialog
      open={open}
      onOpenChange={handleOpenChange}
      preview={previewCancel(sub, formatDate)}
      pending={cancel.isPending}
      cooldown={cooldown}
      error={cancel.error}
      onConfirm={() => {
        if (cancel.isPending) return;
        cancel.mutate(undefined, { onSuccess: () => handleOpenChange(false) });
      }}
    />
  );
}
