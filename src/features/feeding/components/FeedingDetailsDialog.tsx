'use client';

import { CalendarClock, Fish, Package, PackageMinus, Scale, Sprout, Warehouse } from 'lucide-react';
import type { Feeding } from '../types';
import { formatDateTimeShortPtBR } from '@/shared/utils/dateFormat';
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

type FeedingDetailsDialogProps = {
  readonly feeding: Feeding | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const numberFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function formatQuantity(value: number): string | null {
  return Number.isFinite(value) ? numberFmt.format(value) : null;
}

function FeedingDetailsBody({ feeding }: Readonly<{ feeding: Feeding }>) {
  const title = feeding.batch?.name?.trim() ? `Alimentação · ${feeding.batch.name}` : 'Alimentação';

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Package} title={title} tone="info">
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDateTimeShortPtBR(feeding.feedingDate)}
        </span>
        <DetailsCopyId id={feeding.id} label="ID da alimentação" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Scale} label="Quantidade fornecida">
          {formatQuantity(feeding.quantityProvided) && (
            <span className="text-xl tabular-nums">{formatQuantity(feeding.quantityProvided)}</span>
          )}
        </DetailsTile>
        <DetailsTile icon={PackageMinus} label="Baixa no estoque">
          {formatQuantity(feeding.stockReductionQuantity) && (
            <span className="text-xl tabular-nums">
              {formatQuantity(feeding.stockReductionQuantity)}
            </span>
          )}
        </DetailsTile>
        <DetailsTile icon={Sprout} label="Tipo de ração">
          {feeding.feedType}
        </DetailsTile>
        <DetailsTile icon={CalendarClock} label="Data da alimentação" emptyLabel="Não informada">
          {feeding.feedingDate ? formatDateTimeShortPtBR(feeding.feedingDate) : null}
        </DetailsTile>
        <DetailsTile icon={Fish} label="Lote">
          {feeding.batch?.name}
        </DetailsTile>
        <DetailsTile icon={Warehouse} label="Estoque">
          {feeding.stock?.name}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={feeding.createdAt} updatedAt={feeding.updatedAt} />
    </DetailsDialogBody>
  );
}

export function FeedingDetailsDialog({
  feeding,
  open,
  onOpenChange,
  onEdit,
}: FeedingDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da alimentação"
      description="Registro de alimentação do lote."
    >
      {feeding ? <FeedingDetailsBody feeding={feeding} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={feeding ? onEdit : undefined}
        editLabel="Editar alimentação"
      />
    </DetailsDialog>
  );
}
