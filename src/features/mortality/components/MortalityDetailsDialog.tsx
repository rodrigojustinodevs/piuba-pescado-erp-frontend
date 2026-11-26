'use client';

import { AlertTriangle, CalendarDays, FileText, Fish, Hash, Percent, Skull } from 'lucide-react';
import { CAUSE_LABELS, SEVERITY_LABELS, type Mortality, type MortalitySeverity } from '../types';
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

type MortalityDetailsDialogProps = {
  readonly mortality: Mortality | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const SEVERITY_TONE: Record<MortalitySeverity, DetailTone> = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
};

const numberFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function MortalityDetailsBody({ mortality }: Readonly<{ mortality: Mortality }>) {
  const tone = SEVERITY_TONE[mortality.severity] ?? 'neutral';
  const date = formatNullableDatePtBR(mortality.mortalityDate);
  const title = mortality.batch?.name?.trim() || `Mortalidade ${date}`;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Skull} title={title} tone={tone}>
        <DetailsStatusBadge
          tone={tone}
          label={`Severidade ${(SEVERITY_LABELS[mortality.severity] ?? '—').toLowerCase()}`}
        />
        <DetailsCopyId id={mortality.id} label="ID do registro" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Hash} label="Quantidade">
          {Number.isFinite(mortality.quantity) ? (
            <span className="text-xl tabular-nums">{numberFmt.format(mortality.quantity)}</span>
          ) : null}
        </DetailsTile>
        <DetailsTile icon={Percent} label="% do lote">
          {Number.isFinite(mortality.batchPercentage) ? (
            <span className="text-xl tabular-nums">
              {numberFmt.format(mortality.batchPercentage)}%
            </span>
          ) : null}
        </DetailsTile>
        <DetailsTile icon={AlertTriangle} label="Causa" emptyLabel="Não informada">
          {CAUSE_LABELS[mortality.cause] ?? mortality.cause}
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Data" emptyLabel="Não informada">
          {mortality.mortalityDate ? date : null}
        </DetailsTile>
        <DetailsTile icon={Fish} label="Lote" span={2}>
          {mortality.batch?.name}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Descrição" span={2} emptyLabel="Sem descrição">
          {mortality.description?.trim() && (
            <span className="font-normal">{mortality.description}</span>
          )}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={mortality.createdAt} updatedAt={mortality.updatedAt} />
    </DetailsDialogBody>
  );
}

export function MortalityDetailsDialog({
  mortality,
  open,
  onOpenChange,
  onEdit,
}: MortalityDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da mortalidade"
      description="Registro de mortalidade do lote."
    >
      {mortality ? <MortalityDetailsBody mortality={mortality} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={mortality ? onEdit : undefined}
        editLabel="Editar mortalidade"
      />
    </DetailsDialog>
  );
}
