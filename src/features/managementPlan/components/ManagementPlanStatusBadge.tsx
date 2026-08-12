import type { ManagementPlanStatus } from '../types';

const statusConfig: Record<ManagementPlanStatus, { label: string; className: string }> = {
  draft: { label: 'Rascunho', className: 'bg-slate-100 text-slate-700' },
  under_review: { label: 'Em revisão', className: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Aprovado', className: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejeitado', className: 'bg-red-100 text-red-700' },
  superseded: { label: 'Substituído', className: 'bg-slate-100 text-slate-500' },
};

export function ManagementPlanStatusBadge({ status }: Readonly<{ status: ManagementPlanStatus }>) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}
