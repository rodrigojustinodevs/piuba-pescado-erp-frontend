'use client';

import { SensorReadingForm, useCreateSensorReading } from '@/features/sensorReading';
import type { CreateSensorReadingData } from '@/features/sensorReading/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SensorReadingCreatePage() {
  const createReading = useCreateSensorReading();

  const onSubmit = (data: CreateSensorReadingData) => {
    createReading.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Leituras / Nova</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Nova leitura</h1>
            <p className="text-sm text-slate-600">Registre uma medição de sensor</p>
          </div>
        </div>

        <SensorReadingForm
          onSubmit={onSubmit}
          isSubmitting={createReading.isPending}
          submitLabel="Registrar leitura"
          submittingLabel="Registrando..."
        />
      </div>
    </DashboardLayout>
  );
}
