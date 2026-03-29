'use client';

import { useParams } from 'next/navigation';
import { useDeleteSensor, useSensor } from '@/features/sensor';
import { SensorDetailView } from '@/features/sensor/components';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function SensorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: sensor, isLoading, error } = useSensor(id);
  const deleteSensor = useDeleteSensor();
  const { showError } = useAlertModal();

  const handleDelete = (targetId: string, label: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o sensor "${label}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => deleteSensor.mutate(targetId),
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !sensor) {
    return (
      <DashboardLayout>
        <NotFoundState message="Sensor não encontrado." backHref="/company/sensors" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SensorDetailView
        sensor={sensor}
        onDelete={handleDelete}
        isDeleting={deleteSensor.isPending}
      />
    </DashboardLayout>
  );
}
