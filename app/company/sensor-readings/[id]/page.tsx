'use client';

import { useParams } from 'next/navigation';
import { useDeleteSensorReading, useSensorReading } from '@/features/sensorReading';
import { SensorReadingDetailView } from '@/features/sensorReading/components';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function SensorReadingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: reading, isLoading, error } = useSensorReading(id);
  const deleteReading = useDeleteSensorReading();
  const { showError } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a leitura "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => deleteReading.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !reading) {
    return (
      <DashboardLayout>
        <NotFoundState message="Leitura não encontrada." backHref="/company/sensor-readings" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SensorReadingDetailView
        reading={reading}
        onDelete={handleDelete}
        isDeleting={deleteReading.isPending}
      />
    </DashboardLayout>
  );
}
