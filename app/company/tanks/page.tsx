"use client";

import { useState } from "react";
import Link from "next/link";
import { useTanks, useDeleteTank } from "@/features/tank";
import { TankTable } from "@/features/tank/components";
import { DashboardLayout } from "@/shared/components/Layout";
import { useAlertModal } from "@/shared/components/AlertModal";

export default function TanksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useTanks({ page, limit: 10, search });
  const deleteTank = useDeleteTank();
  const { showError } = useAlertModal();

  const handleDelete = (id: string, name: string) => {
    showError(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o tanque "${name}"? Esta ação não pode ser desfeita.`,
      "Sim, Excluir",
      () => {
        deleteTank.mutate(id);
      }
    );
  };

  return (
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tanques</h1>
            <p className="text-gray-600">Gerencie os tanques cadastrados</p>
          </div>
          <Link
            href="/company/tanks/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Novo Tanque
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500">
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
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Erro ao carregar tanques. Tente novamente.
            </div>
          ) : !data?.tanks || data.tanks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum tanque encontrado.
            </div>
          ) : (
            <>
              <TankTable
                tanks={data.tanks}
                onDelete={handleDelete}
                isDeleting={deleteTank.isPending}
              />

              {/* Pagination */}
              {data.total > data.limit && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando {((page - 1) * data.limit) + 1} a{" "}
                    {Math.min(page * data.limit, data.total)} de {data.total} tanques
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page * data.limit >= data.total}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

