'use client';

import { useParams } from 'next/navigation';
import { useDeleteWaterQuality, useWaterQuality } from '@/features/waterQuality';
import { WaterQualityDetailView } from '@/features/waterQuality/components';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function WaterQualityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: record, isLoading, error } = useWaterQuality(id);
  const deleteRecord = useDeleteWaterQuality();
  const { showError } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a medição "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => deleteRecord.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !record) {
    return (
      <DashboardLayout>
        <NotFoundState
          message="Registro não encontrado."
          backHref="/company/water-qualities"
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <WaterQualityDetailView
        record={record}
        onDelete={handleDelete}
        isDeleting={deleteRecord.isPending}
      />
    </DashboardLayout>
  );
}
