import { cn } from '@/shared/lib/utils';
import type { InvoiceStatus } from '../types';
import { INVOICE_STATUS_LABELS } from '../utils/labels';
import type { StatusTone } from '../utils/statusView';

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-900 ring-amber-200',
  danger: 'bg-red-50 text-red-800 ring-red-200',
  info: 'bg-sky-50 text-sky-800 ring-sky-200',
};

const DOT_CLASSES: Record<StatusTone, string> = {
  neutral: 'bg-slate-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
};

/** Badge sempre com texto: a cor só reforça. */
export function StatusBadge({ tone, label }: Readonly<{ tone: StatusTone; label: string }>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONE_CLASSES[tone],
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', DOT_CLASSES[tone])} />
      {label}
    </span>
  );
}

const INVOICE_TONES: Record<InvoiceStatus, StatusTone> = {
  pending: 'info',
  overdue: 'danger',
  paid: 'success',
  refunded: 'neutral',
  canceled: 'neutral',
};

export function InvoiceStatusBadge({ status }: Readonly<{ status: InvoiceStatus }>) {
  return (
    <StatusBadge
      tone={INVOICE_TONES[status] ?? 'neutral'}
      label={INVOICE_STATUS_LABELS[status] ?? status}
    />
  );
}
