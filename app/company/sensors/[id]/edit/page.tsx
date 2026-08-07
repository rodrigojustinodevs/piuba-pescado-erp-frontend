'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSensor, useUpdateSensor } from '@/features/sensor';
import type { CreateSensorFormData } from '@/features/sensor/schemas';
import type { SensorStatus, SensorType } from '@/features/sensor/types';
import { SensorForm, SensorPageShell, toDateInputValue } from '@/features/sensor/components';
import { SensorIcon } from '@/shared/components/Sidebar/menuIcons';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

export default function EditSensorPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: sensor, isLoading } = useSensor(id);
  const updateSensor = useUpdateSensor();

  const onSubmit = (data: {
    sensorType: string;
    installationDate: string;
    status: string;
    tankId: string;
  }) => {
    updateSensor.mutate({
      ...data,
      id,
      sensorType: data.sensorType as SensorType,
      status: data.status as SensorStatus,
    });
  };

  const initialValues = useMemo<CreateSensorFormData | undefined>(() => {
    if (!sensor) return undefined;
    return {
      sensorType: sensor.sensorType,
      installationDate: toDateInputValue(sensor.installationDate),
      status: sensor.status,
      tankId: sensor.tankId,
    };
  }, [sensor]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!sensor) {
    return (
      <DashboardLayout>
        <NotFoundState message="Sensor não encontrado." backHref="/company/sensors" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SensorPageShell
        breadcrumb="Dashboard / Sensores / Editar"
        title="Sensor"
        subtitle="Atualize os dados do sensor"
        icon={
          <span className="inline-block text-[#0EA5A4]">
            <SensorIcon />
          </span>
        }
      >
        <SensorForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateSensor.isPending}
          submitLabel="Atualizar Sensor"
          submittingLabel="Atualizando..."
        />
      </SensorPageShell>
    </DashboardLayout>
  );
}
