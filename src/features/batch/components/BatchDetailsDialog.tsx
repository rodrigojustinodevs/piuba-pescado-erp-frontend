'use client';

import { useState } from 'react';
import {
  CalendarDays,
  Droplets,
  FileText,
  Fish,
  Leaf,
  Package,
  Sparkles,
  Sprout,
} from 'lucide-react';
import type { Batch, BatchStatus } from '../types';
import { formatDate, formatQuantity, getCultivationLabel } from '../utils/format';
import {
  GenerateManagementPlanDialog,
  MANAGEMENT_PLAN_VIEW_ROLES,
} from '@/features/managementPlan';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { Button } from '@/shared/components/ui/Button';
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

type BatchDetailsDialogProps = {
  readonly batch: Batch | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const BATCH_STATUS: Record<BatchStatus, { label: string; tone: DetailTone }> = {
  active: { label: 'Ativo', tone: 'success' },
  finished: { label: 'Finalizado', tone: 'neutral' },
};

function BatchDetailsBody({ batch }: Readonly<{ batch: Batch }>) {
  const status = BATCH_STATUS[batch.status] ?? { label: batch.status, tone: 'neutral' as const };
  const title = batch.name?.trim() || batch.species;

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Fish} title={title} tone={status.tone}>
        <DetailsStatusBadge tone={status.tone} label={status.label} />
        <DetailsCopyId id={batch.id} label="ID do lote" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Package} label="Quantidade inicial">
          <span className="text-xl tabular-nums">{formatQuantity(batch.initialQuantity)}</span>
        </DetailsTile>
        <DetailsTile icon={Sprout} label="Espécie" emptyLabel="Não informada">
          {batch.species}
        </DetailsTile>
        <DetailsTile icon={Leaf} label="Tipo de cultivo">
          {batch.cultivation ? getCultivationLabel(batch.cultivation) : null}
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Data de entrada" emptyLabel="Não informada">
          {batch.entryDate ? formatDate(batch.entryDate) : null}
        </DetailsTile>
        <DetailsTile icon={Droplets} label="Viveiro" span={2}>
          {batch.tank?.name}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Descrição" span={2} emptyLabel="Sem descrição">
          {batch.description?.trim() && <span className="font-normal">{batch.description}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={batch.createdAt} updatedAt={batch.updatedAt} />
    </DetailsDialogBody>
  );
}

export function BatchDetailsDialog({ batch, open, onOpenChange, onEdit }: BatchDetailsDialogProps) {
  const { canAccess } = useAuthContext();
  const canViewManagementPlan = canAccess(MANAGEMENT_PLAN_VIEW_ROLES);
  const [generatePlanOpen, setGeneratePlanOpen] = useState(false);

  return (
    <>
      <DetailsDialog
        open={open}
        onOpenChange={onOpenChange}
        title={batch ? `Detalhes do lote ${batch.name ?? batch.species}` : 'Detalhes do lote'}
        description="Informações do lote de cultivo."
      >
        {batch ? <BatchDetailsBody batch={batch} /> : <DetailsDialogSkeleton />}
        <DetailsDialogFooter
          onClose={() => onOpenChange(false)}
          onEdit={batch ? onEdit : undefined}
          editLabel="Editar lote"
        >
          {canViewManagementPlan && batch && (
            <Button type="button" variant="outline" onClick={() => setGeneratePlanOpen(true)}>
              <Sparkles className="size-4" aria-hidden="true" />
              Criar Plano de Manejo
            </Button>
          )}
        </DetailsDialogFooter>
      </DetailsDialog>

      {canViewManagementPlan && batch && (
        <GenerateManagementPlanDialog
          open={generatePlanOpen}
          onOpenChange={setGeneratePlanOpen}
          batchId={batch.id}
          hasSpecies={!!batch.species}
        />
      )}
    </>
  );
}
