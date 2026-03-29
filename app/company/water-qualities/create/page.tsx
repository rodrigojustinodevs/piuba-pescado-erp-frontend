'use client';

import { WaterQualityForm, useCreateWaterQuality } from '@/features/waterQuality';
import type { CreateWaterQualityData } from '@/features/waterQuality/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function WaterQualityCreatePage() {
  const createQuality = useCreateWaterQuality();

  const onSubmit = (data: CreateWaterQualityData) => {
    createQuality.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Qualidade da água / Nova</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Nova medição</h1>
            <p className="text-sm text-slate-600">Registre parâmetros de qualidade da água</p>
          </div>
        </div>

        <WaterQualityForm
          onSubmit={onSubmit}
          isSubmitting={createQuality.isPending}
          submitLabel="Registrar medição"
          submittingLabel="Registrando..."
        />
      </div>
    </DashboardLayout>
  );
}
