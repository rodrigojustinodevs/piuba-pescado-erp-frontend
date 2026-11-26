'use client';

import { CalendarDays, Fish, Package, Scale, Weight } from 'lucide-react';
import type { Stocking } from '../types';
import { formatDatePtBR } from '@/shared/utils/dateFormat';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsTile,
  DetailsTimestamps,
} from '@/shared/components/detailsDialog';

type StockingDetailsDialogProps = {
  readonly stocking: Stocking | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
  /** Mapa batchId → nome, usado quando a API não envia o nome do lote. */
  readonly batchMap?: Record<string, string>;
};

const numberFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 });

function batchLabel(stocking: Stocking, batchMap: Record<string, string>): string | null {
  if (stocking.batchName) return stocking.batchName;
  if (stocking.batchId && batchMap[stocking.batchId]) return batchMap[stocking.batchId];
  return null;
}

function StockingDetailsBody({
  stocking,
  batchMap,
}: Readonly<{ stocking: Stocking; batchMap: Record<string, string> }>) {
  const lot = batchLabel(stocking, batchMap);
  const totalWeightKg = stocking.quantity * stocking.averageWeight;
  const date = formatDatePtBR(stocking.stockingDate);

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Fish} title={lot ? `Povoamento · ${lot}` : 'Povoamento'} tone="info">
        <span className="text-xs text-muted-foreground">Povoado em {date}</span>
        <DetailsCopyId id={stocking.id} label="ID do povoamento" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Package} label="Quantidade">
          <span className="text-xl tabular-nums">{numberFmt.format(stocking.quantity)}</span>
        </DetailsTile>
        <DetailsTile icon={Weight} label="Peso total estimado">
          <span className="text-xl tabular-nums">{numberFmt.format(totalWeightKg)} kg</span>
        </DetailsTile>
        <DetailsTile icon={Scale} label="Peso médio">
          <span className="tabular-nums">{numberFmt.format(stocking.averageWeight)} kg</span>
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Data do povoamento" emptyLabel="Não informada">
          {stocking.stockingDate ? date : null}
        </DetailsTile>
        <DetailsTile icon={Fish} label="Lote" span={2}>
          {lot}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={stocking.createdAt} updatedAt={stocking.updatedAt} />
    </DetailsDialogBody>
  );
}

export function StockingDetailsDialog({
  stocking,
  open,
  onOpenChange,
  onEdit,
  batchMap = {},
}: StockingDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes do povoamento"
      description="Registro de povoamento do lote."
    >
      {stocking ? (
        <StockingDetailsBody stocking={stocking} batchMap={batchMap} />
      ) : (
        <DetailsDialogSkeleton />
      )}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={stocking ? onEdit : undefined}
        editLabel="Editar povoamento"
      />
    </DetailsDialog>
  );
}
