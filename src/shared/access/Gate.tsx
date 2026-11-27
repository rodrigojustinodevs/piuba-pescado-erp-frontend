'use client';

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/Tooltip';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import type { Permission } from './permissionMatrix';
import { hasPermission, isAtLeast, type CompanyRole } from './roles';
import { useEntitlements } from './useEntitlements';

/**
 * Dois eixos, duas reações:
 *  - papel/permissão → esconde (ou mostra `fallback`): o usuário não tem o que fazer;
 *  - plano (somente leitura, feature, limite) → desabilita e explica no tooltip, porque
 *    há uma saída (upgrade, regularizar pagamento).
 */

type AccessRule = {
  /** Papel mínimo na empresa ativa. */
  role?: CompanyRole;
  permission?: Permission;
};

type PlanRule = {
  /** Ação de escrita: fica desabilitada com a empresa em somente leitura. */
  write?: boolean;
  /** Feature do plano (boolean, limite ou cota). Implica `write`. */
  feature?: string;
};

export function useGate({ role, permission, write, feature }: AccessRule & PlanRule) {
  const { user } = useAuthContext();
  const { blockReason } = useEntitlements();

  const visible =
    (!role || isAtLeast(user?.role, role)) &&
    (!permission || hasPermission(user?.role, permission));
  const planReason = write || feature ? blockReason(feature ?? null) : null;

  return { visible, enabled: visible && !planReason, reason: planReason };
}

type GateProps = AccessRule &
  PlanRule & {
    children: ReactNode;
    /** Renderizado no lugar quando o papel não permite (padrão: nada). */
    fallback?: ReactNode;
  };

export function Gate({ children, fallback = null, ...rules }: Readonly<GateProps>) {
  const { visible, reason } = useGate(rules);
  if (!visible) return <>{fallback}</>;
  if (!reason) return <>{children}</>;
  return <PlanBlocked reason={reason}>{children}</PlanBlocked>;
}

type DisableableProps = {
  disabled?: boolean;
  'aria-disabled'?: boolean;
  onClick?: unknown;
};

/** Desabilita o filho e mostra o motivo. O span recebe o foco porque botão desabilitado não recebe. */
function PlanBlocked({ reason, children }: Readonly<{ reason: string; children: ReactNode }>) {
  const child = isValidElement<DisableableProps>(children)
    ? cloneElement(children as ReactElement<DisableableProps>, {
        disabled: true,
        'aria-disabled': true,
        onClick: undefined,
      })
    : children;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            tabIndex={0}
            aria-label={reason}
            className="inline-flex cursor-not-allowed rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="pointer-events-none inline-flex">{child}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-72 text-pretty leading-relaxed">
          {reason}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
