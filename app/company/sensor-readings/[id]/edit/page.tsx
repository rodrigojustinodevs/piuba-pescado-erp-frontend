'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSensorReading, useUpdateSensorReading } from '@/features/sensorReading';
import type { CreateSensorReadingFormData } from '@/features/sensorReading/schemas';
import type { CreateSensorReadingData } from '@/features/sensorReading/types';
import {
  SensorReadingForm,
  SensorReadingPageShell,
  toDateTimeLocalValue,
} from '@/features/sensorReading/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

const ChartIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export default function EditSensorReadingPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: reading, isLoading } = useSensorReading(id);
  const updateReading = useUpdateSensorReading();

  const onSubmit = (data: CreateSensorReadingData) => {
    updateReading.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateSensorReadingFormData | undefined>(() => {
    if (!reading) return undefined;
    return {
      sensorId: reading.sensorId,
      value: reading.value,
      unit: reading.unit,
      measuredAt: toDateTimeLocalValue(reading.measuredAt),
      notes: reading.notes ?? '',
    };
  }, [reading]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!reading) {
    return (
      <DashboardLayout>
        <NotFoundState message="Leitura não encontrada." backHref="/company/sensor-readings" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SensorReadingPageShell
        breadcrumb="Dashboard / Leituras / Editar"
        title="Leitura"
        subtitle="Atualize os dados da medição"
        icon={<span className="inline-block text-[#0EA5A4]"><ChartIcon /></span>}
      >
        <SensorReadingForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateReading.isPending}
          submitLabel="Atualizar leitura"
          submittingLabel="Atualizando..."
        />
      </SensorReadingPageShell>
    </DashboardLayout>
  );
}
