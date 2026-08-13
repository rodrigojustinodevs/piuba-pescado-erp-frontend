'use client';

import { useState } from 'react';
import type { ManagementPlan } from '../types';
import { ManagementPlanStatusBadge } from './ManagementPlanStatusBadge';
import { ManagementPlanDetailPanel } from './ManagementPlanDetailPanel';
import { formatDateTime } from '@/features/batch/utils/format';

export function ManagementPlanList({ plans }: Readonly<{ plans: ManagementPlan[] }>) {
  const [expandedId, setExpandedId] = useState<string | null>(plans[0]?.id ?? null);

  if (plans.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Nenhum plano de manejo gerado para este lote ainda.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => {
        const isExpanded = expandedId === plan.id;
        return (
          <div key={plan.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : plan.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                <ManagementPlanStatusBadge status={plan.status} />
                <span className="text-sm text-slate-600">
                  Gerado em {formatDateTime(plan.createdAt)}
                </span>
              </div>
              <span className="text-sm font-medium text-[#0EA5A4]">
                {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
              </span>
            </button>
            {isExpanded && (
              <div className="border-t border-slate-200 p-4">
                <ManagementPlanDetailPanel plan={plan} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
