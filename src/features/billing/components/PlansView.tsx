'use client';

import { Check, Minus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { buttonVariants } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/utils';
import { usePlans, useSubscription } from '../hooks/queries';
import type { BillingCycle, Plan, Subscription } from '../types';
import {
  allFeatures,
  availableCycles,
  featureAmount,
  formatBRL,
  isFeatureIncluded,
} from '../utils/format';
import { CYCLE_UNIT, tierLabel } from '../utils/labels';
import { BillingSection } from './BillingSection';
import { CycleToggle } from './CycleToggle';
import { BillingEmpty, BillingError, BillingLoading } from './states';

type CardAction = { label: string; href: string | null };

/** O que o botão do card faz, conforme a assinatura atual. */
function cardAction(plan: Plan, cycle: BillingCycle, sub: Subscription): CardAction {
  const isCurrent = plan.tier === sub.planTier;
  const hasSubscription = sub.status !== null && sub.status !== 'canceled';

  if (!plan.paid) return { label: isCurrent ? 'Plano atual' : 'Incluído', href: null };
  if (!plan.prices[cycle]?.available) return { label: 'Indisponível neste ciclo', href: null };
  if (!hasSubscription) {
    return {
      label: 'Contratar',
      href: `/dashboard/assinatura/contratar?plano=${plan.tier}&ciclo=${cycle}`,
    };
  }
  if (sub.status === 'pending')
    return { label: 'Concluir pagamento', href: '/dashboard/assinatura/contratar' };
  if (isCurrent && sub.billingCycle === cycle) return { label: 'Plano atual', href: null };
  if (sub.status !== 'active' || sub.cancelAtPeriodEnd)
    return { label: 'Mudança indisponível', href: null };
  return {
    label: isCurrent ? 'Mudar ciclo' : 'Mudar para este plano',
    href: `/dashboard/assinatura?trocar=${plan.tier}&ciclo=${cycle}`,
  };
}

function PlanCard({
  plan,
  cycle,
  subscription,
  highlighted,
}: Readonly<{
  plan: Plan;
  cycle: BillingCycle;
  subscription: Subscription;
  highlighted: boolean;
}>) {
  const price = plan.prices[cycle];
  const isCurrent = plan.tier === subscription.planTier;
  const includedFeatures = plan.features.filter(isFeatureIncluded);
  const action = cardAction(plan, cycle, subscription);

  return (
    <article
      aria-label={`Plano ${plan.name}`}
      className={cn(
        'flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm',
        isCurrent ? 'border-primary ring-1 ring-primary' : 'border-border',
        highlighted && !isCurrent && 'ring-2 ring-amber-400',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
        {isCurrent ? (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Plano atual
          </span>
        ) : null}
      </div>

      <p className="min-h-10 text-foreground">
        {!plan.paid ? (
          <span className="text-2xl font-semibold">Grátis</span>
        ) : price?.available && price.amount !== null ? (
          <>
            <span className="text-2xl font-semibold tabular-nums">{formatBRL(price.amount)}</span>
            <span className="text-sm text-muted-foreground">{CYCLE_UNIT[cycle]}</span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Sem preço neste ciclo</span>
        )}
      </p>

      <ul className="flex flex-1 flex-col gap-2 text-sm">
        {includedFeatures.length === 0 ? (
          <li className="text-muted-foreground">Funcionalidades básicas</li>
        ) : (
          includedFeatures.map((f) => {
            const amount = featureAmount(f);
            return (
              <li key={f.key} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>
                  {f.label}
                  {amount && (
                    <span className="text-muted-foreground tabular-nums">: {amount}</span>
                  )}
                </span>
              </li>
            );
          })
        )}
      </ul>

      {action.href ? (
        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: isCurrent ? 'outline' : 'default' }), 'w-full')}
        >
          {action.label}
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'pointer-events-none w-full opacity-60',
          )}
        >
          {action.label}
        </span>
      )}
    </article>
  );
}

function ComparisonTable({ plans }: Readonly<{ plans: Plan[] }>) {
  const features = allFeatures(plans);
  if (features.length === 0) return null;
  return (
    <BillingSection title="Comparação entre planos">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <caption className="sr-only">Funcionalidades incluídas em cada plano</caption>
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="py-2 pr-4 font-medium text-muted-foreground">
                Funcionalidade
              </th>
              {plans.map((p) => (
                <th key={p.tier} scope="col" className="px-2 py-2 text-center font-medium">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.key} className="border-b border-border last:border-0">
                <th scope="row" className="py-2 pr-4 text-left font-normal">
                  {f.label}
                </th>
                {plans.map((p) => {
                  const feature = p.features.find((pf) => pf.key === f.key);
                  const has = isFeatureIncluded(feature);
                  const amount = has && feature ? featureAmount(feature) : null;
                  return (
                    <td key={p.tier} className="px-2 py-2 text-center">
                      {amount ? (
                        <span className="tabular-nums">{amount}</span>
                      ) : has ? (
                        <Check className="mx-auto size-4 text-emerald-600" aria-label="Incluído" />
                      ) : (
                        <Minus
                          className="mx-auto size-4 text-slate-400"
                          aria-label="Não incluído"
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BillingSection>
  );
}

export function PlansView() {
  const plansQuery = usePlans();
  const subQuery = useSubscription();
  const searchParams = useSearchParams();
  const highlightTier = searchParams.get('destaque');
  const [chosenCycle, setChosenCycle] = useState<BillingCycle | null>(null);

  if (plansQuery.isPending || subQuery.isPending)
    return <BillingLoading label="Carregando planos…" />;
  if (plansQuery.isError)
    return <BillingError error={plansQuery.error} onRetry={() => void plansQuery.refetch()} />;
  if (subQuery.isError)
    return <BillingError error={subQuery.error} onRetry={() => void subQuery.refetch()} />;

  const plans = plansQuery.data;
  const subscription = subQuery.data;
  if (plans.length === 0) return <BillingEmpty title="Nenhum plano disponível no momento." />;

  const cycles = availableCycles(plans);
  const preferred = chosenCycle ?? subscription.billingCycle ?? 'monthly';
  const cycle = cycles.includes(preferred) ? preferred : (cycles[0] ?? 'monthly');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Você está no plano{' '}
          <strong className="text-foreground">{tierLabel(subscription.planTier)}</strong>.
        </p>
        <CycleToggle cycles={cycles} value={cycle} onChange={setChosenCycle} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.tier}
            plan={plan}
            cycle={cycle}
            subscription={subscription}
            highlighted={plan.tier === highlightTier}
          />
        ))}
      </div>

      <ComparisonTable plans={plans} />
    </div>
  );
}
