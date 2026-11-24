'use client';

import { useState } from 'react';
import { useChangeSubscription } from '../hooks/queries';
import { useRetryCooldown } from '../hooks/useRetryCooldown';
import type { BillingCycle, PaymentMethod, Plan, PlanTier, Subscription } from '../types';
import { previewChange } from '../utils/changePreview';
import { formatBRL, formatDate, planPrice } from '../utils/format';
import { CYCLE_LABELS, CYCLE_UNIT, PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from '../utils/labels';
import { ConfirmChangeDialog } from './ConfirmChangeDialog';

type Initial = { planTier?: PlanTier; billingCycle?: BillingCycle };

type Props = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription;
  plans: Plan[];
  initial?: Initial;
  onChanged: (sub: Subscription) => void;
}>;

const SELECT_CLASS =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function ChangePlanDialog(props: Props) {
  // Remonta a cada abertura para começar do estado atual da assinatura.
  return props.open ? <ChangePlanDialogBody {...props} /> : null;
}

function ChangePlanDialogBody({
  open,
  onOpenChange,
  subscription,
  plans,
  initial,
  onChanged,
}: Props) {
  const [tier, setTier] = useState<PlanTier>(initial?.planTier ?? subscription.planTier);
  const [cycle, setCycle] = useState<BillingCycle>(
    initial?.billingCycle ?? subscription.billingCycle ?? 'monthly',
  );
  const [method, setMethod] = useState<PaymentMethod>(subscription.paymentMethod ?? 'pix');
  const change = useChangeSubscription();
  const cooldown = useRetryCooldown(change.error);

  const plan = plans.find((p) => p.tier === tier);
  const cycleOptions = (['monthly', 'yearly'] as const).filter((c) => plan?.prices[c]?.available);
  const effectiveCycle = cycleOptions.includes(cycle) ? cycle : cycleOptions[0];
  const preview = previewChange(
    subscription,
    {
      planTier: tier,
      billingCycle: tier === 'free' ? undefined : effectiveCycle,
      paymentMethod: method,
    },
    formatDate,
  );
  const price = planPrice(plan, effectiveCycle ?? null);

  function confirm() {
    if (change.isPending || !preview.requiresConfirmation) return;
    const payload =
      preview.kind === 'cancel'
        ? { plan_tier: 'free' as const }
        : {
            ...(tier !== subscription.planTier ? { plan_tier: tier } : {}),
            ...(effectiveCycle && effectiveCycle !== subscription.billingCycle
              ? { billing_cycle: effectiveCycle }
              : {}),
            ...(method !== subscription.paymentMethod ? { payment_method: method } : {}),
          };
    change.mutate(payload, {
      onSuccess: (sub) => {
        onChanged(sub);
        onOpenChange(false);
      },
    });
  }

  return (
    <ConfirmChangeDialog
      open={open}
      onOpenChange={onOpenChange}
      preview={preview}
      pending={change.isPending}
      cooldown={cooldown}
      error={change.error}
      onConfirm={confirm}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="change-tier" className="text-sm font-medium">
            Plano
          </label>
          <select
            id="change-tier"
            value={tier}
            onChange={(e) => setTier(e.target.value as PlanTier)}
            className={SELECT_CLASS}
          >
            {plans.map((p) => (
              <option key={p.tier} value={p.tier}>
                {p.name}
                {p.tier === subscription.planTier ? ' (atual)' : ''}
              </option>
            ))}
          </select>
        </div>

        {tier === 'free' ? null : (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="change-cycle" className="text-sm font-medium">
                Ciclo
              </label>
              <select
                id="change-cycle"
                value={effectiveCycle ?? ''}
                onChange={(e) => setCycle(e.target.value as BillingCycle)}
                className={SELECT_CLASS}
                disabled={cycleOptions.length === 0}
              >
                {cycleOptions.map((c) => (
                  <option key={c} value={c}>
                    {CYCLE_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="change-method" className="text-sm font-medium">
                Forma de pagamento
              </label>
              <select
                id="change-method"
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className={SELECT_CLASS}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {PAYMENT_METHOD_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
            {price !== null && effectiveCycle ? (
              <p className="text-sm text-muted-foreground sm:col-span-2">
                Valor do plano:{' '}
                <strong className="tabular-nums text-foreground">
                  {formatBRL(price)}
                  {CYCLE_UNIT[effectiveCycle]}
                </strong>
                {preview.kind === 'upgrade'
                  ? '. O valor proporcional é calculado pela cobrança e aparece após a confirmação.'
                  : null}
              </p>
            ) : null}
          </>
        )}
      </div>
    </ConfirmChangeDialog>
  );
}
