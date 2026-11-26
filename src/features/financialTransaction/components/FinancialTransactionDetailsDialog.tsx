'use client';

import {
  ArrowLeftRight,
  BarChart2,
  Building2,
  CalendarCheck,
  CalendarClock,
  CreditCard,
  FileText,
  Tag,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type {
  FinancialTransaction,
  FinancialTransactionStatus,
  FinancialTransactionType,
} from '../types';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { cn } from '@/shared/lib/utils';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsStatusBadge,
  DetailsTile,
  DetailsTimestamps,
  type DetailTone,
} from '@/shared/components/detailsDialog';

type FinancialTransactionDetailsDialogProps = {
  readonly transaction: FinancialTransaction | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

type TypeStyle = { tone: DetailTone; icon: LucideIcon; amountClass: string };

const TYPE_STYLE: Record<FinancialTransactionType, TypeStyle> = {
  income: {
    tone: 'success',
    icon: TrendingUp,
    amountClass: 'text-emerald-700 dark:text-emerald-400',
  },
  expense: { tone: 'danger', icon: TrendingDown, amountClass: 'text-rose-700 dark:text-rose-400' },
  transfer: { tone: 'neutral', icon: ArrowLeftRight, amountClass: '' },
  investment: { tone: 'info', icon: BarChart2, amountClass: 'text-sky-700 dark:text-sky-400' },
  other: { tone: 'neutral', icon: ArrowLeftRight, amountClass: '' },
};

const STATUS_TONE: Record<FinancialTransactionStatus, DetailTone> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
  cancelled: 'neutral',
  other: 'neutral',
};

function FinancialTransactionDetailsBody({
  transaction,
}: Readonly<{ transaction: FinancialTransaction }>) {
  const style = TYPE_STYLE[transaction.type] ?? TYPE_STYLE.other;
  const statusTone = STATUS_TONE[transaction.status] ?? 'neutral';

  return (
    <DetailsDialogBody>
      <DetailsHero
        icon={style.icon}
        title={transaction.description?.trim() || transaction.typeLabel}
        tone={style.tone}
      >
        <DetailsStatusBadge tone={statusTone} label={transaction.statusLabel} />
        <DetailsCopyId id={transaction.id} label="ID da transação" />
        <span className="text-xs text-muted-foreground">{transaction.typeLabel}</span>
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Wallet} label="Valor" span={2}>
          <span className={cn('text-2xl tabular-nums', style.amountClass)}>
            {formatCurrency(transaction.amount)}
          </span>
        </DetailsTile>
        <DetailsTile icon={CalendarClock} label="Vencimento" emptyLabel="Não informado">
          {transaction.dueDate ? formatCalendarDatePtBR(transaction.dueDate) : null}
        </DetailsTile>
        <DetailsTile icon={CalendarCheck} label="Pagamento" emptyLabel="Não pago">
          {transaction.paymentDate ? formatCalendarDatePtBR(transaction.paymentDate) : null}
        </DetailsTile>
        <DetailsTile icon={Tag} label="Categoria" emptyLabel="Sem categoria">
          {transaction.categoryName}
        </DetailsTile>
        <DetailsTile icon={CreditCard} label="Forma de pagamento" emptyLabel="Não informada">
          {transaction.methodLabel}
        </DetailsTile>
        <DetailsTile icon={Building2} label="Empresa" span={2} emptyLabel="Não informada">
          {transaction.companyName}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Observações" span={2} emptyLabel="Sem observações">
          {transaction.notes?.trim() && <span className="font-normal">{transaction.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={transaction.createdAt} updatedAt={transaction.updatedAt} />
    </DetailsDialogBody>
  );
}

export function FinancialTransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
  onEdit,
}: FinancialTransactionDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da transação"
      description="Informações da transação financeira."
    >
      {transaction ? (
        <FinancialTransactionDetailsBody transaction={transaction} />
      ) : (
        <DetailsDialogSkeleton />
      )}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={transaction ? onEdit : undefined}
        editLabel="Editar transação"
      />
    </DetailsDialog>
  );
}
