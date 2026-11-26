'use client';

import { BarChart3, CalendarDays, Fish, Gauge, Hash, Scale } from 'lucide-react';
import type { Biometry } from '../types';
import { formatNumber, formatSampleQuantity, formatSampleWeight } from '../utils/formatters';
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

type BiometryDetailsDialogProps = {
  readonly biometry: Biometry | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

function BiometryDetailsBody({ biometry }: Readonly<{ biometry: Biometry }>) {
  const date = formatDatePtBR(biometry.biometryDate);
  const title = biometry.batchName?.trim() || `Biometria ${date}`;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={BarChart3} title={title} tone="info">
        <span className="text-xs text-muted-foreground">Biometria de {date}</span>
        <DetailsCopyId id={biometry.id} label="ID da biometria" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Scale} label="Peso médio">
          <span className="text-xl tabular-nums">{formatNumber(biometry.averageWeight)}</span>
        </DetailsTile>
        <DetailsTile icon={Gauge} label="FCR">
          <span className="text-xl tabular-nums">{formatNumber(biometry.fcr)}</span>
        </DetailsTile>
        <DetailsTile icon={Scale} label="Peso da amostra">
          <span className="tabular-nums">{formatSampleWeight(biometry.sampleWeight)}</span>
        </DetailsTile>
        <DetailsTile icon={Hash} label="Quantidade na amostra">
          <span className="tabular-nums">{formatSampleQuantity(biometry.sampleQuantity)}</span>
        </DetailsTile>
        <DetailsTile icon={Fish} label="Lote">
          {biometry.batchName}
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Data da biometria" emptyLabel="Não informada">
          {biometry.biometryDate ? date : null}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={biometry.createdAt} updatedAt={biometry.updatedAt} />
    </DetailsDialogBody>
  );
}

export function BiometryDetailsDialog({
  biometry,
  open,
  onOpenChange,
  onEdit,
}: BiometryDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        biometry ? `Detalhes da biometria ${biometry.batchName ?? ''}` : 'Detalhes da biometria'
      }
      description="Medições registradas na biometria."
    >
      {biometry ? <BiometryDetailsBody biometry={biometry} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={biometry ? onEdit : undefined}
        editLabel="Editar biometria"
      />
    </DetailsDialog>
  );
}
