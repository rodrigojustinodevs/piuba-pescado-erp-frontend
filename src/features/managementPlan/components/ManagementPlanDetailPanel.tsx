'use client';

import { useState } from 'react';
import type { ManagementPlan } from '../types';
import { ManagementPlanStatusBadge } from './ManagementPlanStatusBadge';
import { ManagementPlanItemsTable } from './ManagementPlanItemsTable';
import { ReviewManagementPlanModal, useApproveManagementPlan } from './ReviewManagementPlanModal';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { MANAGEMENT_PLAN_REVIEW_ROLES } from '../utils/permissions';
import { formatDateTime } from '@/features/batch/utils/format';

export function ManagementPlanDetailPanel({ plan }: Readonly<{ plan: ManagementPlan }>) {
  const { canAccess } = useAuthContext();
  const canReview = canAccess(MANAGEMENT_PLAN_REVIEW_ROLES);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const { approve, isPending: isApproving } = useApproveManagementPlan(plan.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ManagementPlanStatusBadge status={plan.status} />
          <span className="text-sm text-slate-500">Modelo: {plan.aiModelVersion}</span>
          <span className="text-sm text-slate-500">
            Gerado em {formatDateTime(plan.createdAt)}
          </span>
        </div>

        {canReview && plan.status === 'draft' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isApproving}
              onClick={approve}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Aprovar
            </button>
            <button
              type="button"
              disabled={isApproving}
              onClick={() => setRejectModalOpen(true)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Rejeitar
            </button>
          </div>
        )}
      </div>

      {plan.rejectionReason && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Motivo da rejeição</p>
          <p className="mt-1">{plan.rejectionReason}</p>
        </div>
      )}

      {plan.reviewedAt && (
        <p className="text-sm text-slate-500">Revisado em {formatDateTime(plan.reviewedAt)}</p>
      )}

      <ManagementPlanItemsTable items={plan.items} />

      <ReviewManagementPlanModal
        planId={plan.id}
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
      />
    </div>
  );
}
