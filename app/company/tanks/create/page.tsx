"use client";

import { useCreateTank } from "@/features/tank";
import { TankForm } from "@/features/tank/components";
import { DashboardLayout } from "@/shared/components/Layout";
import type { CreateTankFormData } from "@/features/tank";

export default function NewTankPage() {
  const createTank = useCreateTank();

  const handleSubmit = (data: CreateTankFormData) => {
    createTank.mutate(data);
  };

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Tanque</h1>
          <p className="text-gray-600">Cadastre um novo tanque no sistema</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TankForm
            onSubmit={handleSubmit}
            isLoading={createTank.isPending}
            submitLabel="Criar Tanque"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

