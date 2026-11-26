'use client';

import {
  Barcode,
  Boxes,
  Building2,
  DollarSign,
  Grid2x2,
  Package,
  Ruler,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { STATUS_LABELS, type Supply, type SupplyStatus } from '../types';
import { getSupplyDefaultUnitLabel } from '../utils/defaultUnitLabel';
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

type SupplyDetailsDialogProps = {
  readonly supply: Supply | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const SUPPLY_STATUS_TONE: Record<SupplyStatus, DetailTone> = {
  active: 'success',
  inactive: 'neutral',
  low_stock: 'warning',
};

const numberFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const percentFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

function getMargin(supply: Supply): number | null {
  if (!supply.isProduct || supply.salePrice <= 0 || supply.unitCost <= 0) return null;
  return ((supply.salePrice - supply.unitCost) / supply.salePrice) * 100;
}

function marginClass(margin: number): string {
  if (margin >= 30) return 'text-emerald-700 dark:text-emerald-400';
  if (margin >= 15) return 'text-amber-700 dark:text-amber-400';
  return 'text-rose-700 dark:text-rose-400';
}

function SupplyDetailsBody({ supply }: Readonly<{ supply: Supply }>) {
  const tone = SUPPLY_STATUS_TONE[supply.status] ?? 'neutral';
  const statusLabel = STATUS_LABELS[supply.status] ?? supply.statusLabel;
  const unitShort = supply.defaultUnit === 'unit' ? 'un' : supply.defaultUnit;
  const margin = getMargin(supply);

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Package} title={supply.name} tone={tone}>
        <DetailsStatusBadge tone={tone} label={statusLabel} />
        <DetailsCopyId id={supply.id} label="ID do insumo" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile
          icon={Boxes}
          label="Estoque atual"
          hint={`mín. ${numberFmt.format(supply.minStock)} ${unitShort}`}
        >
          <span className="text-xl tabular-nums">
            {numberFmt.format(supply.currentStock)}{' '}
            <span className="text-sm font-normal text-muted-foreground">{unitShort}</span>
          </span>
        </DetailsTile>
        <DetailsTile icon={TrendingUp} label="Valor em estoque" hint="a custo de aquisição">
          <span className="text-xl tabular-nums">
            {formatCurrency(supply.unitCost * supply.currentStock)}
          </span>
        </DetailsTile>
        <DetailsTile icon={DollarSign} label="Custo unitário" hint={`por ${unitShort}`}>
          <span className="tabular-nums">{formatCurrency(supply.unitCost)}</span>
        </DetailsTile>
        <DetailsTile
          icon={Tag}
          label="Preço de venda"
          emptyLabel={supply.isProduct ? 'Não informado' : 'Não vendável'}
          hint={
            margin === null ? undefined : (
              <span className={cn('font-medium', marginClass(margin))}>
                Margem bruta de {percentFmt.format(margin)}%
              </span>
            )
          }
        >
          {supply.isProduct && supply.salePrice > 0 ? (
            <span className="tabular-nums">{formatCurrency(supply.salePrice)}</span>
          ) : null}
        </DetailsTile>
        <DetailsTile icon={Barcode} label="SKU">
          {supply.sku && (
            <span className="font-mono" translate="no">
              {supply.sku}
            </span>
          )}
        </DetailsTile>
        <DetailsTile icon={Grid2x2} label="Categoria" emptyLabel="Não informada">
          {supply.categoryLabel ?? supply.category}
        </DetailsTile>
        <DetailsTile icon={Building2} label="Fornecedor">
          {supply.supplierName}
        </DetailsTile>
        <DetailsTile icon={Ruler} label="Unidade de medida" emptyLabel="Não informada">
          {getSupplyDefaultUnitLabel(supply.defaultUnit)}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={supply.createdAt} updatedAt={supply.updatedAt} />
    </DetailsDialogBody>
  );
}

export function SupplyDetailsDialog({
  supply,
  open,
  onOpenChange,
  onEdit,
}: SupplyDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={supply ? `Detalhes do insumo ${supply.name}` : 'Detalhes do insumo'}
      description="Informações do insumo e do estoque."
    >
      {supply ? <SupplyDetailsBody supply={supply} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={supply ? onEdit : undefined}
        editLabel="Editar insumo"
      />
    </DetailsDialog>
  );
}
