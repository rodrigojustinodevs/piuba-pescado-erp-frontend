'use client';

import { Droplets, Layers, MapPin } from 'lucide-react';
import type { Tank, TankStatus } from '../types';
import { TANK_STATUS_CONFIG } from '../utils/tankDisplayLabels';
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

interface TankDetailsDialogProps {
  readonly tank: Tank | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly isLoading?: boolean;
  readonly onEdit?: (tank: Tank) => void;
}

const TANK_STATUS_TONE: Record<TankStatus, DetailTone> = {
  active: 'success',
  inactive: 'neutral',
  maintenance: 'warning',
};

const numberFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function formatCapacity(liters: number) {
  return {
    primary: `${numberFmt.format(liters)} L`,
    secondary: liters >= 1000 ? `${numberFmt.format(liters / 1000)} m³` : null,
  };
}

function TankDetailsBody({ tank }: Readonly<{ tank: Tank }>) {
  const tone = TANK_STATUS_TONE[tank.status] ?? 'neutral';
  const statusLabel = TANK_STATUS_CONFIG[tank.status]?.label ?? 'Desconhecido';
  const capacity = formatCapacity(tank.capacityLiters);

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Droplets} title={tank.name} tone={tone}>
        <DetailsStatusBadge tone={tone} label={statusLabel} />
        <DetailsCopyId id={tank.id} label="ID do tanque" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Droplets} label="Capacidade" hint={capacity.secondary}>
          <span className="text-xl tabular-nums">{capacity.primary}</span>
        </DetailsTile>
        <DetailsTile icon={Layers} label="Tipo">
          {tank.tankType?.name}
        </DetailsTile>
        <DetailsTile icon={MapPin} label="Localização" span={2} emptyLabel="Não informada">
          {tank.location}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={tank.createdAt} updatedAt={tank.updatedAt} />
    </DetailsDialogBody>
  );
}

export function TankDetailsDialog({
  tank,
  open,
  onOpenChange,
  isLoading = false,
  onEdit,
}: TankDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={tank ? `Detalhes do tanque ${tank.name}` : 'Detalhes do tanque'}
      description="Informações cadastrais do tanque."
    >
      {isLoading || !tank ? <DetailsDialogSkeleton /> : <TankDetailsBody tank={tank} />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={onEdit && tank ? () => onEdit(tank) : undefined}
        editLabel="Editar tanque"
        isLoading={isLoading}
      />
    </DetailsDialog>
  );
}
