'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { Button, buttonVariants } from '@/shared/components/ui/Button';
import { HttpError, extractHttpStatus } from '@/shared/lib/http/httpError';
import { cn } from '@/shared/lib/utils';
import { maskCpfCnpj } from '@/shared/utils/documentMask';
import { usePlans, useSubscribe, useSubscription } from '../hooks/queries';
import { useRetryCooldown } from '../hooks/useRetryCooldown';
import type { BillingCycle, PaidPlanTier, PaymentMethod, Plan } from '../types';
import { onlyDigits, validateDocument } from '../utils/document';
import { billingErrorMessage, isUncertainFailure } from '../utils/errors';
import { availableCycles, formatBRL } from '../utils/format';
import {
  CYCLE_LABELS,
  CYCLE_UNIT,
  PAYMENT_METHOD_HINTS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
} from '../utils/labels';
import { BillingSection } from './BillingSection';
import { CycleToggle } from './CycleToggle';
import { PaymentStep } from './PaymentStep';
import { BillingError, BillingLoading } from './states';

const DOCUMENT_ERROR = /cpf|cnpj|document/i;

/** Erro do documento vindo do 422 (campo `document` ou mensagem do gateway). */
function documentServerError(error: unknown): string | null {
  if (!(error instanceof HttpError) || error.status !== 422) return null;
  const field = error.fieldErrors?.document?.[0];
  if (field) return field;
  return DOCUMENT_ERROR.test(error.message) ? error.message : null;
}

export function SubscribeView() {
  const plansQuery = usePlans();
  const subQuery = useSubscription();

  if (plansQuery.isPending || subQuery.isPending) return <BillingLoading />;
  if (plansQuery.isError)
    return <BillingError error={plansQuery.error} onRetry={() => void plansQuery.refetch()} />;
  if (subQuery.isError)
    return <BillingError error={subQuery.error} onRetry={() => void subQuery.refetch()} />;

  const sub = subQuery.data;
  // Já existe assinatura aguardando pagamento: retoma o pagamento em vez de contratar de novo.
  if (sub.status === 'pending') return <PaymentStep />;
  if (sub.status !== null && sub.status !== 'canceled') {
    return (
      <BillingSection title="Você já tem uma assinatura">
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted-foreground">
            Para mudar de plano, ciclo ou forma de pagamento, use Minha assinatura.
          </p>
          <Link href="/dashboard/assinatura" className={buttonVariants()}>
            Ir para Minha assinatura
          </Link>
        </div>
      </BillingSection>
    );
  }

  return <SubscribeForm plans={plansQuery.data} />;
}

function SubscribeForm({ plans }: Readonly<{ plans: Plan[] }>) {
  const searchParams = useSearchParams();
  const paidPlans = plans.filter((p) => p.paid);
  const cycles = availableCycles(plans);

  const [tier, setTier] = useState<string>(
    () => searchParams.get('plano') ?? paidPlans[0]?.tier ?? '',
  );
  const [cycleChoice, setCycleChoice] = useState<string>(
    () => searchParams.get('ciclo') ?? 'monthly',
  );
  const [method, setMethod] = useState<PaymentMethod>('pix_automatic');
  const [document, setDocument] = useState('');
  const documentRef = useRef<HTMLInputElement>(null);
  const [documentTouched, setDocumentTouched] = useState(false);
  /** Resultado da consulta feita depois de um timeout do POST. */
  const [timeoutCheck, setTimeoutCheck] = useState<'idle' | 'checking' | 'not_created' | 'unknown'>(
    'idle',
  );

  const subscribe = useSubscribe();
  const subQuery = useSubscription();
  const cooldown = useRetryCooldown(subscribe.error);

  const plan = paidPlans.find((p) => p.tier === tier);
  const cycle = (cycles.includes(cycleChoice as BillingCycle) ? cycleChoice : cycles[0]) as
    | BillingCycle
    | undefined;
  const price = plan && cycle ? plan.prices[cycle] : undefined;
  const priceAvailable = Boolean(price?.available && price.amount !== null);

  const localDocError = documentTouched ? validateDocument(document) : null;
  const serverDocError = documentServerError(subscribe.error);
  const documentError = localDocError ?? serverDocError;
  const busy = subscribe.isPending || timeoutCheck === 'checking';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setDocumentTouched(true);
    if (busy || cooldown > 0 || !plan || !cycle || !priceAvailable) return;
    if (validateDocument(document)) {
      documentRef.current?.focus();
      return;
    }

    const digits = onlyDigits(document);
    setTimeoutCheck('idle');
    try {
      await subscribe.mutateAsync({
        plan_tier: plan.tier as PaidPlanTier,
        billing_cycle: cycle,
        payment_method: method,
        ...(digits ? { document: digits } : {}),
      });
    } catch (error) {
      // Timeout/rede: a assinatura pode ter sido criada. Consulta antes de deixar repetir.
      // Se ela existir, o cache muda para `pending` e a tela vai para o pagamento.
      if (isUncertainFailure(error)) {
        setTimeoutCheck('checking');
        const result = await subQuery.refetch();
        setTimeoutCheck(result.isError ? 'unknown' : 'not_created');
      }
    }
  }

  if (!plan) {
    return (
      <BillingSection title="Escolha um plano">
        <p className="text-sm text-muted-foreground">
          Plano não encontrado.{' '}
          <Link
            href="/dashboard/assinatura/planos"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Ver planos
          </Link>
        </p>
      </BillingSection>
    );
  }

  const uncertain = Boolean(subscribe.error) && isUncertainFailure(subscribe.error);
  const genericError =
    subscribe.error && !serverDocError && !uncertain ? billingErrorMessage(subscribe.error) : null;

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      noValidate
      className="grid gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="flex flex-col gap-6">
        <BillingSection title="Plano">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="plan-tier" className="text-sm font-medium">
                Plano
              </label>
              <select
                id="plan-tier"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {paidPlans.map((p) => (
                  <option key={p.tier} value={p.tier}>
                    {p.name}
                  </option>
                ))}
              </select>
              {cycle ? (
                <CycleToggle cycles={cycles} value={cycle} onChange={setCycleChoice} />
              ) : null}
            </div>
            {!priceAvailable ? (
              <p role="alert" className="text-sm text-amber-900">
                Este plano não está disponível no ciclo{' '}
                {cycle ? CYCLE_LABELS[cycle].toLowerCase() : ''}. Escolha outro ciclo ou plano.
              </p>
            ) : null}
          </div>
        </BillingSection>

        <BillingSection title="Forma de pagamento">
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Forma de pagamento</legend>
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m}
                className={cn(
                  'flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  method === m ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    name="payment-method"
                    value={m}
                    checked={method === m}
                    onChange={() => setMethod(m)}
                    className="accent-primary"
                  />
                  {PAYMENT_METHOD_LABELS[m]}
                </span>
                <span className="text-xs text-muted-foreground">{PAYMENT_METHOD_HINTS[m]}</span>
              </label>
            ))}
          </fieldset>
        </BillingSection>

        <BillingSection
          title="Documento para a cobrança"
          description="Opcional. Se ficar em branco, usamos o CNPJ da empresa."
        >
          <div className="flex max-w-sm flex-col gap-1">
            <label htmlFor="billing-document" className="text-sm font-medium">
              CPF ou CNPJ
            </label>
            <input
              ref={documentRef}
              id="billing-document"
              name="document"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00 ou 00.000.000/0000-00…"
              value={document}
              onChange={(e) => setDocument(maskCpfCnpj(e.target.value))}
              onBlur={() => setDocumentTouched(true)}
              aria-invalid={documentError ? true : undefined}
              aria-describedby={documentError ? 'billing-document-error' : undefined}
              className={cn(
                'h-9 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                documentError ? 'border-red-500' : 'border-input',
              )}
            />
            {documentError ? (
              <p id="billing-document-error" className="text-sm text-red-700">
                {documentError}
              </p>
            ) : null}
          </div>
        </BillingSection>
      </div>

      <aside className="flex flex-col gap-4 self-start rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-4">
        <h2 className="text-base font-semibold">Resumo</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Plano</dt>
            <dd className="font-medium">{plan.name}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Ciclo</dt>
            <dd>{cycle ? CYCLE_LABELS[cycle] : '—'}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Pagamento</dt>
            <dd>{PAYMENT_METHOD_LABELS[method]}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-2 border-t border-border pt-3">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="text-lg font-semibold tabular-nums">
              {priceAvailable && cycle ? `${formatBRL(price!.amount!)}${CYCLE_UNIT[cycle]}` : '—'}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-muted-foreground">
          A assinatura é ativada quando o pagamento for confirmado.
        </p>

        {genericError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {genericError}
            {extractHttpStatus(subscribe.error) === 409 ? (
              <>
                {' '}
                <Link href="/dashboard/assinatura" className="font-medium underline">
                  Ver minha assinatura
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
        {uncertain && timeoutCheck === 'not_created' ? (
          <p
            role="alert"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          >
            O servidor demorou para responder. Conferimos e a assinatura não foi criada: você pode
            tentar de novo.
          </p>
        ) : null}
        {uncertain && timeoutCheck === 'unknown' ? (
          <p
            role="alert"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          >
            Não conseguimos confirmar se a assinatura foi criada.{' '}
            <Link href="/dashboard/assinatura" className="font-medium underline">
              Confira em Minha assinatura
            </Link>{' '}
            antes de tentar de novo.
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={
            busy || cooldown > 0 || !priceAvailable || (uncertain && timeoutCheck === 'unknown')
          }
        >
          {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
          {busy ? 'Contratando…' : cooldown > 0 ? `Tente em ${cooldown} s` : 'Contratar e pagar'}
        </Button>
      </aside>
    </form>
  );
}
