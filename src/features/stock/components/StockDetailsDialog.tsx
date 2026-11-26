'use client';

import { Boxes, FileText, MapPin, Package, SlidersHorizontal, User, Warehouse } from 'lucide-react';
import {
  STOCK_LOCATION_STATUS_LABELS,
  type StockLocation,
  type StockLocationStatus,
} from '../types';
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

type StockDetailsDialogProps = {
  readonly stock: StockLocation | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const STOCK_STATUS_TONE: Record<StockLocationStatus, DetailTone> = {
  active: 'success',
  inactive: 'neutral',
};

const numberFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function StockDetailsBody({ stock }: Readonly<{ stock: StockLocation }>) {
  const tone = STOCK_STATUS_TONE[stock.status] ?? 'neutral';
  const statusLabel = STOCK_LOCATION_STATUS_LABELS[stock.status] ?? stock.statusLabel;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Warehouse} title={stock.name} tone={tone}>
        <DetailsStatusBadge tone={tone} label={statusLabel} />
        <DetailsCopyId id={stock.id} label="ID do estoque" />
        {stock.code && (
          <span className="font-mono text-xs text-muted-foreground" translate="no">
            {stock.code}
          </span>
        )}
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Boxes} label="Itens armazenados" hint="itens distintos">
          <span className="text-xl tabular-nums">{numberFmt.format(stock.currentQuantity)}</span>
        </DetailsTile>
        <DetailsTile icon={SlidersHorizontal} label="Capacidade" emptyLabel="Não informada">
          {stock.capacity == null ? null : (
            <span className="text-xl tabular-nums">{numberFmt.format(stock.capacity)}</span>
          )}
        </DetailsTile>
        <DetailsTile icon={Package} label="Tipo">
          {stock.typeLabel}
        </DetailsTile>
        <DetailsTile icon={Boxes} label="Valor armazenado">
          <span className="tabular-nums">{formatCurrency(stock.totalValue)}</span>
        </DetailsTile>
        <DetailsTile icon={MapPin} label="Localização" emptyLabel="Não informada">
          {stock.location}
        </DetailsTile>
        <DetailsTile icon={User} label="Responsável">
          {stock.responsible}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Observações" span={2} emptyLabel="Sem observações">
          {stock.notes?.trim() && <span className="font-normal">{stock.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={stock.createdAt} updatedAt={stock.updatedAt} />
    </DetailsDialogBody>
  );
}

export function StockDetailsDialog({ stock, open, onOpenChange, onEdit }: StockDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={stock ? `Detalhes do estoque ${stock.name}` : 'Detalhes do estoque'}
      description="Informações do local de estoque."
    >
      {stock ? <StockDetailsBody stock={stock} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={stock ? onEdit : undefined}
        editLabel="Editar estoque"
      />
    </DetailsDialog>
  );
}
