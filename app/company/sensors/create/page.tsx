'use client';

import { SensorForm, useCreateSensor } from '@/features/sensor';
import type { CreateSensorData } from '@/features/sensor/types';
import { SensorIcon } from '@/shared/components/Sidebar/menuIcons';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SensorCreatePage() {
  const createSensor = useCreateSensor();

  const onSubmit = (data: CreateSensorData) => {
    createSensor.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Sensores / Novo</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0EA5A4]/10 text-[#0EA5A4]">
              <SensorIcon />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">Sensor</h1>
              <p className="text-sm text-slate-600">Cadastro de sensor para monitoramento de tanque</p>
            </div>
          </div>
        </div>

        <SensorForm
          onSubmit={onSubmit}
          isSubmitting={createSensor.isPending}
          submitLabel="Criar Sensor"
          submittingLabel="Criando..."
        />
      </div>
    </DashboardLayout>
  );
}
