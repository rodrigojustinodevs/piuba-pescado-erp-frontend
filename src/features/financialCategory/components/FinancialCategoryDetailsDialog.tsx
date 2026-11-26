'use client';

import {
  BarChart2,
  Building2,
  FileText,
  Tag,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FinancialCategory } from '../types';
import { displayFinancialCategoryStatus, displayFinancialCategoryType } from '../utils/labels';
import { formatCurrency } from '@/shared/utils/numberFormat';
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
import { cn } from '@/shared/lib/utils';

type FinancialCategoryDetailsDialogProps = {
  readonly category: FinancialCategory | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

type TypeStyle = { tone: DetailTone; icon: LucideIcon; amountClass: string };

const TYPE_STYLE: Record<string, TypeStyle> = {
  revenue: {
    tone: 'success',
    icon: TrendingUp,
    amountClass: 'text-emerald-700 dark:text-emerald-400',
  },
  income: {
    tone: 'success',
    icon: TrendingUp,
    amountClass: 'text-emerald-700 dark:text-emerald-400',
  },
  expense: { tone: 'danger', icon: TrendingDown, amountClass: 'text-rose-700 dark:text-rose-400' },
  investment: { tone: 'info', icon: BarChart2, amountClass: 'text-sky-700 dark:text-sky-400' },
};

const DEFAULT_TYPE_STYLE: TypeStyle = { tone: 'neutral', icon: BarChart2, amountClass: '' };

function FinancialCategoryDetailsBody({ category }: Readonly<{ category: FinancialCategory }>) {
  const style = TYPE_STYLE[category.type] ?? DEFAULT_TYPE_STYLE;
  const typeLabel = displayFinancialCategoryType(category);
  const statusLabel = displayFinancialCategoryStatus(category);
  const statusTone: DetailTone = category.status === 'active' ? 'success' : 'neutral';

  return (
    <DetailsDialogBody>
      <DetailsHero icon={style.icon} title={category.name} tone={style.tone}>
        <DetailsStatusBadge tone={statusTone} label={statusLabel} />
        <DetailsCopyId id={category.id} label="ID da categoria" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Wallet} label="Total movimentado" span={2}>
          <span className={cn('text-xl tabular-nums', style.amountClass)}>
            {formatCurrency(category.totalAmount)}
          </span>
        </DetailsTile>
        <DetailsTile icon={Tag} label="Tipo">
          {typeLabel}
        </DetailsTile>
        <DetailsTile icon={Building2} label="Empresa" emptyLabel="Não informada">
          {category.companyName}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Descrição" span={2} emptyLabel="Sem descrição">
          {category.notes && <span className="font-normal">{category.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={category.createdAt} updatedAt={category.updatedAt} />
    </DetailsDialogBody>
  );
}

export function FinancialCategoryDetailsDialog({
  category,
  open,
  onOpenChange,
  onEdit,
}: FinancialCategoryDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={category ? `Detalhes da categoria ${category.name}` : 'Detalhes da categoria'}
      description="Informações da categoria financeira."
    >
      {category ? <FinancialCategoryDetailsBody category={category} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={category ? onEdit : undefined}
        editLabel="Editar categoria"
      />
    </DetailsDialog>
  );
}
