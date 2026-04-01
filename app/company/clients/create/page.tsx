'use client';

import { ClientForm, useCreateClient } from '@/features/client';
import type { CreateClientData } from '@/features/client/types';
import { DashboardLayout } from '@/shared/components/Layout';

export default function ClientCreatePage() {
  const createClient = useCreateClient();

  const onSubmit = (data: CreateClientData) => {
    createClient.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <div className="mb-6">
          <p className="text-sm text-slate-600">Dashboard / Clientes / Novo</p>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-[#0F172A]">Novo cliente</h1>
            <p className="text-sm text-slate-600">Cadastre um cliente pessoa física ou jurídica</p>
          </div>
        </div>

        <ClientForm
          onSubmit={onSubmit}
          isSubmitting={createClient.isPending}
          submitLabel="Cadastrar cliente"
          submittingLabel="Cadastrando..."
        />
      </div>
    </DashboardLayout>
  );
}

