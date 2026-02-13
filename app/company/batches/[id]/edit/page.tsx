"use client";

import { useParams } from "next/navigation";
import { useBatch, useUpdateBatch } from "@/features/batch";
import { BatchForm } from "@/features/batch/components";
import { DashboardLayout } from "@/shared/components/Layout";
import { PageHeader } from "@/shared/components/ui";
import type { UpdateBatchFormData } from "@/features/batch/schemas";

export default function BatchEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: batch, isLoading } = useBatch(id);
  const updateBatch = useUpdateBatch();

  const onSubmit = (data: UpdateBatchFormData) => {
    updateBatch.mutate({ ...data, id });
  };

  if (isLoading) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Carregando...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!batch) {
    return (
      <DashboardLayout
        user={{
          name: "Usuário Demo",
          email: "demo@dev.com",
        }}
      >
        <div className="text-center py-8">
          <p className="text-red-600">Lote não encontrado.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="-m-4 lg:-m-8 bg-[#F8FAFC] px-8 py-6 min-h-full">
        <PageHeader
          breadcrumb="Dashboard / Lotes / Editar"
          title="Lote"
          subtitle="Atualize as informações do lote de cultivo"
          icon={
            <svg
              className="h-6 w-6 text-[#0EA5A4]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              />
            </svg>
          }
        />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <BatchForm
            initialData={batch}
            onSubmit={onSubmit}
            isLoading={updateBatch.isPending}
            submitLabel="Atualizar Lote"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
