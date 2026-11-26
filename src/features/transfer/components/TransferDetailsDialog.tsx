'use client';

import {
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  FileText,
  Fish,
  Route,
  Scale,
  Tag,
  User,
  Users,
  Weight,
} from 'lucide-react';
import type { Transfer, TransferStatus } from '../types';
import { REASON_LABELS, STATUS_LABELS } from '../types';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
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

type TransferDetailsDialogProps = {
  readonly transfer: Transfer | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const TRANSFER_STATUS_TONE: Record<TransferStatus, DetailTone> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'danger',
};

const intFmt = new Intl.NumberFormat('pt-BR');
const decFmt = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function TankName({ name }: Readonly<{ name?: string | null }>) {
  return name?.trim() ? (
    <span className="truncate">{name}</span>
  ) : (
    <span className="font-normal text-muted-foreground">Não informado</span>
  );
}

function TransferDetailsBody({ transfer }: Readonly<{ transfer: Transfer }>) {
  const tone = transfer.status ? TRANSFER_STATUS_TONE[transfer.status] : 'neutral';
  const totalBiomassKg = (transfer.quantity * (transfer.averageWeight ?? 0)) / 1000;
  const route = [transfer.originTankName, transfer.destinationTankName]
    .map((n) => n?.trim() || '—')
    .join(' → ');

  return (
    <DetailsDialogBody>
      <DetailsHero icon={ArrowLeftRight} title={route} tone={tone}>
        {transfer.status && (
          <DetailsStatusBadge tone={tone} label={STATUS_LABELS[transfer.status]} />
        )}
        <DetailsCopyId id={transfer.id} label="ID da transferência" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Route} label="Origem → destino" span={2}>
          <span className="flex min-w-0 items-center gap-2">
            <TankName name={transfer.originTankName} />
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-label="para" />
            <TankName name={transfer.destinationTankName} />
          </span>
        </DetailsTile>
        <DetailsTile icon={Users} label="Quantidade" hint="indivíduos">
          <span className="text-xl tabular-nums">{intFmt.format(transfer.quantity)}</span>
        </DetailsTile>
        <DetailsTile icon={Weight} label="Biomassa total">
          <span className="text-xl tabular-nums">{decFmt.format(totalBiomassKg)} kg</span>
        </DetailsTile>
        <DetailsTile icon={Scale} label="Peso médio">
          {transfer.averageWeight == null ? null : (
            <span className="tabular-nums">{decFmt.format(transfer.averageWeight)} g</span>
          )}
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Data da transferência" emptyLabel="Não informada">
          {transfer.transferDate ? formatNullableDatePtBR(transfer.transferDate) : null}
        </DetailsTile>
        <DetailsTile icon={Fish} label="Lote">
          {transfer.batchName}
        </DetailsTile>
        <DetailsTile icon={Tag} label="Motivo">
          {transfer.reason ? REASON_LABELS[transfer.reason] : null}
        </DetailsTile>
        <DetailsTile icon={User} label="Responsável" span={2}>
          {transfer.responsible}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Observações" span={2} emptyLabel="Sem observações">
          {transfer.description?.trim() && (
            <span className="font-normal">{transfer.description}</span>
          )}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={transfer.createdAt} updatedAt={transfer.updatedAt} />
    </DetailsDialogBody>
  );
}

export function TransferDetailsDialog({
  transfer,
  open,
  onOpenChange,
  onEdit,
}: TransferDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da transferência"
      description="Movimentação de peixes entre viveiros."
    >
      {transfer ? <TransferDetailsBody transfer={transfer} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={transfer ? onEdit : undefined}
        editLabel="Editar transferência"
      />
    </DetailsDialog>
  );
}
