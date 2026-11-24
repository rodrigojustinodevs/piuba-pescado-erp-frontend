'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { Button, buttonVariants } from '@/shared/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { gateStore } from '../gate/gateStore';
import type { GateError } from '../utils/gating';
import { featureLabel, tierLabel } from '../utils/labels';
import { canManageBilling } from '../utils/permissions';

type Copy = { title: string; body: string; cta: { label: string; href: string } | null };

function copyFor(gate: GateError, canManage: boolean): Copy {
  const feature = gate.feature ? featureLabel(gate.feature) : 'Esta funcionalidade';
  const askAdmin = 'Peça a um administrador da empresa para resolver em Assinatura.';
  switch (gate.code) {
    case 'PLAN_UPGRADE_REQUIRED':
      return {
        title: `Disponível no plano ${tierLabel(gate.requiredTier)}`,
        body: `${feature} não faz parte do plano ${tierLabel(gate.currentTier)}.${canManage ? '' : ` ${askAdmin}`}`,
        cta: canManage
          ? {
              label: 'Fazer upgrade',
              href: gate.requiredTier
                ? `/dashboard/assinatura/planos?destaque=${gate.requiredTier}`
                : '/dashboard/assinatura/planos',
            }
          : null,
      };
    case 'SUBSCRIPTION_SUSPENDED':
      return {
        title: 'Assinatura suspensa',
        body: `${feature} está bloqueada porque há pagamento em atraso.${canManage ? '' : ` ${askAdmin}`}`,
        cta: canManage
          ? { label: 'Regularizar pagamento', href: '/dashboard/assinatura/faturas' }
          : null,
      };
    case 'SUBSCRIPTION_PENDING':
      return {
        title: 'Aguardando confirmação do pagamento',
        body: `${feature} será liberada assim que o primeiro pagamento for confirmado.`,
        cta: canManage ? { label: 'Ver assinatura', href: '/dashboard/assinatura' } : null,
      };
  }
}

/** Diálogo global do 403 de feature gating (alimentado pelo interceptor do React Query). */
export function BillingGateDialog() {
  const gate = useSyncExternalStore(gateStore.subscribe, gateStore.get, gateStore.getServer);
  const { user } = useAuthContext();
  if (!gate) return null;

  const copy = copyFor(gate, canManageBilling(user?.role));
  return (
    <Dialog open onOpenChange={(open) => !open && gateStore.dismiss()}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.body}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => gateStore.dismiss()}>
            Agora não
          </Button>
          {copy.cta ? (
            <Link
              href={copy.cta.href}
              onClick={() => gateStore.dismiss()}
              className={buttonVariants()}
            >
              {copy.cta.label}
            </Link>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
