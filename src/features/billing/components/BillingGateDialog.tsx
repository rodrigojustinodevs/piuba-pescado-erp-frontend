'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { accessEvents, type PlanDialog } from '@/shared/access/accessEvents';
import {
  ACCESS_MESSAGES,
  featureRequiredMessage,
  limitMessage,
  planName,
  quotaMessage,
} from '@/shared/access/messages';
import { useAccessSnapshot } from '@/shared/access/useEntitlements';
import { Button, buttonVariants } from '@/shared/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Progress } from '@/shared/components/ui/Progress';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { canManageBilling } from '../utils/permissions';
import { formatDate } from '../utils/format';

type Copy = { title: string; body: string };

function copyFor(dialog: PlanDialog, snapshot: ReturnType<typeof useAccessSnapshot>['data']): Copy {
  const { block } = dialog;
  switch (dialog.kind) {
    case 'limitReached':
      return { title: 'Limite do plano atingido', body: limitMessage(block) };
    case 'quotaExhausted':
      return {
        title: 'Cota do plano esgotada',
        body: quotaMessage(block, (iso) => formatDate(iso)),
      };
    case 'featureRequired':
      return {
        title: block.requiredPlan
          ? `Disponível no plano ${planName(block.requiredPlan)}`
          : 'Disponível em planos superiores',
        body: featureRequiredMessage(block, snapshot),
      };
  }
}

function plansHref(requiredPlan: string | null) {
  return requiredPlan
    ? `/dashboard/assinatura/planos?destaque=${requiredPlan}`
    : '/dashboard/assinatura/planos';
}

/**
 * Modal dos 402 de plano: recurso fora do plano, limite atingido e cota esgotada.
 * Alimentado pelo tratamento central (`handleApiError`). Somente leitura não abre
 * modal: vira banner persistente + botões desabilitados.
 */
export function BillingGateDialog() {
  const { planDialog } = useSyncExternalStore(
    accessEvents.subscribe,
    accessEvents.getState,
    accessEvents.getServerState,
  );
  const { user } = useAuthContext();
  const { data: snapshot } = useAccessSnapshot();
  if (!planDialog) return null;

  const canManage = canManageBilling(user?.role);
  const copy = copyFor(planDialog, snapshot);
  const { block } = planDialog;
  const showUsage =
    planDialog.kind !== 'featureRequired' && block.limit !== null && block.limit > 0;

  return (
    <Dialog open onOpenChange={(open) => !open && accessEvents.dismissPlanDialog()}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.body}</DialogDescription>
        </DialogHeader>

        {showUsage ? (
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Uso no plano {planName(block.currentPlan)}
              </span>
              <span className="font-medium tabular-nums">
                {block.used ?? block.limit} de {block.limit}
              </span>
            </div>
            <Progress
              value={Math.min(100, ((block.used ?? block.limit ?? 0) / (block.limit ?? 1)) * 100)}
              aria-label="Uso do limite do plano"
            />
          </div>
        ) : null}

        {canManage ? null : (
          <p className="text-sm text-muted-foreground">{ACCESS_MESSAGES.ASK_ADMIN}</p>
        )}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => accessEvents.dismissPlanDialog()}>
            Agora não
          </Button>
          {canManage ? (
            <Link
              href={plansHref(block.requiredPlan)}
              onClick={() => accessEvents.dismissPlanDialog()}
              className={buttonVariants()}
            >
              {block.requiredPlan ? `Ver plano ${planName(block.requiredPlan)}` : 'Ver planos'}
            </Link>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
