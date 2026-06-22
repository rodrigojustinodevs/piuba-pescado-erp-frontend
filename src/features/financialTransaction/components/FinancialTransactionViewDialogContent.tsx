'use client';

import { TrendingUp, TrendingDown, ArrowLeftRight, Calendar, Tag, CreditCard, FileText, Building2 } from 'lucide-react';
import type { FinancialTransaction } from '../types';
import { formatCalendarDatePtBR, formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Separator } from '@/src/shared/components/ui/Separator';

type Props = { transaction: FinancialTransaction | null };

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function getTypeStyle(type: string) {
  if (type === 'income') return { bg: 'bg-emerald-50', icon: <TrendingUp className="h-5 w-5 text-emerald-600" />, amount: 'text-emerald-600' };
  if (type === 'expense') return { bg: 'bg-rose-50', icon: <TrendingDown className="h-5 w-5 text-rose-600" />, amount: 'text-rose-600' };
  return { bg: 'bg-slate-100', icon: <ArrowLeftRight className="h-5 w-5 text-slate-500" />, amount: 'text-slate-900' };
}

function getStatusBadge(status: string, statusLabel: string) {
  const map: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] ?? 'bg-slate-100 text-slate-700'}`}>
      {statusLabel}
    </span>
  );
}

function DetailItem({ icon, label, value }: Readonly<{ icon: React.ReactNode; label: string; value: string }>) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export function FinancialTransactionViewDialogContent({ transaction }: Readonly<Props>) {
  if (!transaction) return null;

  const style = getTypeStyle(transaction.type);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.bg}`}>
          {style.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {transaction.description || transaction.typeLabel}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            {getStatusBadge(transaction.status, transaction.statusLabel)}
            <span className="text-xs text-slate-400">{transaction.typeLabel}</span>
          </div>
        </div>
      </div>

      {/* Valor */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs text-slate-500 mb-1">Valor</p>
        <p className={`text-3xl font-bold ${style.amount}`}>{formatCurrency(transaction.amount)}</p>
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500 mb-1">Vencimento</p>
          <p className="text-sm font-medium text-slate-800">{formatCalendarDatePtBR(transaction.dueDate)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500 mb-1">Pagamento</p>
          <p className="text-sm font-medium text-slate-800">
            {transaction.paymentDate ? formatCalendarDatePtBR(transaction.paymentDate) : '—'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Detalhes */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Detalhes</p>
        <div className="grid grid-cols-2 gap-2">
          {transaction.categoryName && (
            <DetailItem icon={<Tag className="h-4 w-4" />} label="Categoria" value={transaction.categoryName} />
          )}
          {transaction.methodLabel && (
            <DetailItem icon={<CreditCard className="h-4 w-4" />} label="Forma de Pagamento" value={transaction.methodLabel} />
          )}
          {transaction.companyName && (
            <DetailItem icon={<Building2 className="h-4 w-4" />} label="Empresa" value={transaction.companyName} />
          )}
        </div>
      </div>

      {transaction.notes && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <p className="text-xs text-slate-500">Observações</p>
          </div>
          <p className="text-sm text-slate-700">{transaction.notes}</p>
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>
          <Calendar className="inline h-3 w-3 mr-1" />
          Criado em: {formatNullableDatePtBR(transaction.createdAt, true)}
        </span>
        <span>Atualizado em: {formatNullableDatePtBR(transaction.updatedAt, true)}</span>
      </div>
    </div>
  );
}
