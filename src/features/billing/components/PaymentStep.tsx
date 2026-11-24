'use client';

import { CheckCircle2, Copy, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, buttonVariants } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/utils';
import { usePaymentConfirmation } from '../hooks/usePaymentConfirmation';
import type { Subscription } from '../types';
import { PAYMENT_METHOD_LABELS } from '../utils/labels';
import { BillingSection } from './BillingSection';

const PIX_AUTH_LABELS: Record<string, string> = {
  pending: 'Aguardando autorização no app do banco',
  created: 'Aguardando autorização no app do banco',
  active: 'Autorizado',
  authorized: 'Autorizado',
  denied: 'Autorização recusada',
  refused: 'Autorização recusada',
  canceled: 'Autorização cancelada',
  expired: 'QR Code expirado',
};

function CopyPayload({ payload }: Readonly<{ payload: string }>) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="pix-payload" className="text-sm font-medium text-foreground">
        Pix copia e cola
      </label>
      <div className="flex gap-2">
        <input
          id="pix-payload"
          readOnly
          value={payload}
          autoComplete="off"
          spellCheck={false}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-md border border-input bg-muted px-3 py-2 font-mono text-xs"
        />
        <Button type="button" variant="outline" onClick={() => void copy()}>
          <Copy aria-hidden="true" />
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Código Pix copiado.' : ''}
      </span>
    </div>
  );
}

/**
 * Pagamento + aguardo da confirmação (webhook). O cartão é digitado só na página
 * do Asaas. Payload do Pix e URL ficam só em memória (cache do React Query).
 */
export function PaymentStep() {
  const { data: sub, phase, start } = usePaymentConfirmation();
  const isPixAutomatic = sub?.paymentMethod === 'pix_automatic';

  // Pix Automático: o QR já está na tela, então o aguardo começa na hora.
  useEffect(() => {
    if (isPixAutomatic) start();
  }, [isPixAutomatic, start]);

  if (!sub) return null;

  if (phase === 'confirmed' || sub.status === 'active') {
    return (
      <BillingSection title="Pagamento confirmado">
        <div role="status" className="flex flex-col items-start gap-4">
          <p className="flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle2 className="size-5" aria-hidden="true" />
            Sua assinatura está ativa.
          </p>
          <Link href="/dashboard/assinatura" className={buttonVariants()}>
            Ver minha assinatura
          </Link>
        </div>
      </BillingSection>
    );
  }

  return (
    <BillingSection
      title="Pagamento"
      description={`Forma de pagamento: ${sub.paymentMethod ? PAYMENT_METHOD_LABELS[sub.paymentMethod] : '—'}`}
    >
      <div className="flex flex-col gap-5">
        {isPixAutomatic ? (
          <PixAutomaticBlock sub={sub} />
        ) : (
          <PaymentLinkBlock sub={sub} onOpen={start} />
        )}
        <ConfirmationStatus phase={phase} onCheckAgain={start} />
      </div>
    </BillingSection>
  );
}

function PaymentLinkBlock({ sub, onOpen }: Readonly<{ sub: Subscription; onOpen: () => void }>) {
  const url = sub.payment?.url;
  if (!url) {
    return (
      <p className="text-sm text-muted-foreground">
        O link de pagamento ainda não está disponível. Veja suas faturas ou tente de novo em
        instantes.
      </p>
    );
  }
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-sm text-muted-foreground">
        O pagamento é feito na página segura do <span translate="no">Asaas</span>, que abre em uma
        nova aba.
        {sub.paymentMethod === 'credit_card' ? ' Os dados do cartão são digitados só lá.' : ''}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onOpen}
        className={cn(buttonVariants({ size: 'lg' }))}
      >
        Ir para o pagamento
        <ExternalLink aria-hidden="true" />
        <span className="sr-only">(abre em nova aba)</span>
      </a>
    </div>
  );
}

function PixAutomaticBlock({ sub }: Readonly<{ sub: Subscription }>) {
  const qr = sub.payment?.pixQrCode;
  const auth = sub.payment?.pixAuthorizationStatus;
  if (!qr) {
    return (
      <p className="text-sm text-muted-foreground">
        O QR Code ainda não está disponível. Aguarde alguns segundos.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      {/* eslint-disable-next-line @next/next/no-img-element -- imagem base64 vinda da API */}
      <img
        src={`data:image/png;base64,${qr.imageBase64}`}
        alt="QR Code para autorizar o Pix Automático"
        width={192}
        height={192}
        className="size-48 shrink-0 rounded-lg border border-border bg-white p-2"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Abra o app do seu banco, escaneie o QR Code ou use o copia e cola e autorize o Pix
          Automático.
        </p>
        {auth ? (
          <p className="text-sm">
            Autorização: <strong>{PIX_AUTH_LABELS[auth] ?? auth}</strong>
          </p>
        ) : null}
        <CopyPayload payload={qr.payload} />
      </div>
    </div>
  );
}

function ConfirmationStatus({
  phase,
  onCheckAgain,
}: Readonly<{
  phase: ReturnType<typeof usePaymentConfirmation>['phase'];
  onCheckAgain: () => void;
}>) {
  return (
    <div aria-live="polite" className="rounded-xl border border-border bg-muted/50 p-4 text-sm">
      {phase === 'waiting' ? (
        <p className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Aguardando confirmação do pagamento…
        </p>
      ) : null}
      {phase === 'timed_out' ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            Ainda não recebemos a confirmação. Boleto pode levar até 3 dias úteis; você pode sair
            desta tela e acompanhar em Minha assinatura.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={onCheckAgain}>
            Verificar de novo
          </Button>
        </div>
      ) : null}
      {phase === 'idle' ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>Depois de pagar, volte aqui para confirmarmos.</p>
          <Button type="button" variant="outline" size="sm" onClick={onCheckAgain}>
            Já paguei
          </Button>
        </div>
      ) : null}
    </div>
  );
}
