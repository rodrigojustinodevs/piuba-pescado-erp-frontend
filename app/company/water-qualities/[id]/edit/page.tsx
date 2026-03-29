'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useUpdateWaterQuality, useWaterQuality } from '@/features/waterQuality';
import type { CreateWaterQualityFormData } from '@/features/waterQuality/schemas';
import type { CreateWaterQualityData, WaterQuality } from '@/features/waterQuality/types';
import {
  WaterQualityForm,
  WaterQualityPageShell,
  toDateTimeLocalValue,
} from '@/features/waterQuality/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function parseMetric(value: string): number {
  const n = parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function waterQualityToFormValues(record: WaterQuality): CreateWaterQualityFormData {
  return {
    tankId: record.tankId,
    measuredAt: toDateTimeLocalValue(record.measuredAt),
    ph: parseMetric(record.ph),
    dissolvedOxygen: parseMetric(record.dissolvedOxygen),
    temperature: parseMetric(record.temperature),
    ammonia: parseMetric(record.ammonia),
    salinity: parseMetric(record.salinity),
    turbidity: parseMetric(record.turbidity),
    notes: record.notes ?? '',
  };
}

const DropletIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3c-4.5 5.5-8 9.5-8 13a8 8 0 1016 0c0-3.5-3.5-7.5-8-13z"
    />
  </svg>
);

export default function EditWaterQualityPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: record, isLoading } = useWaterQuality(id);
  const updateRecord = useUpdateWaterQuality();

  const onSubmit = (data: CreateWaterQualityData) => {
    updateRecord.mutate({ ...data, id });
  };

  const initialValues = useMemo<CreateWaterQualityFormData | undefined>(() => {
    if (!record) return undefined;
    return waterQualityToFormValues(record);
  }, [record]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (!record) {
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
      <WaterQualityPageShell
        breadcrumb="Dashboard / Qualidade da água / Editar"
        title="Medição"
        subtitle="Atualize os parâmetros registrados"
        icon={<span className="inline-block text-[#0EA5A4]"><DropletIcon /></span>}
      >
        <WaterQualityForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={updateRecord.isPending}
          submitLabel="Atualizar medição"
          submittingLabel="Atualizando..."
        />
      </WaterQualityPageShell>
    </DashboardLayout>
  );
}
