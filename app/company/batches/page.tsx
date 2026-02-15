'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBatches, useDeleteBatch } from '@/features/batch';
import type { BatchStatus } from '@/features/batch';
import { BatchTable } from '@/features/batch/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { Alert } from '@/shared/components/Alert';
import { useAlertModal } from '@/shared/components/AlertModal';

type FilterType = 'all' | BatchStatus;

export default function BatchListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const { data, isLoading, error, isError } = useBatches({
    page,
    limit: 10,
    search: search.trim() || undefined,
  });
  const deleteBatch = useDeleteBatch();
  const { showError: showAlertError } = useAlertModal();

  const handleDelete = (id: string, species: string) => {
    showAlertError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o lote de "${species}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => {
        deleteBatch.mutate(id);
      },
    );
  };

  const searchTerm = search.trim().toLowerCase();

  const filteredBatches =
    data?.batches.filter((batch) => {
      const matchesSearch =
        !searchTerm ||
        batch.species.toLowerCase().includes(searchTerm) ||
        batch.tank?.name?.toLowerCase().includes(searchTerm);
      const matchesStatus = filter === 'all' || batch.status === filter;
      return matchesSearch && matchesStatus;
    }) ?? [];

  const totalFiltered = filteredBatches.length;
  const activeCount = data?.batches.filter((b) => b.status === 'active').length ?? 0;
  const finishedCount = data?.batches.filter((b) => b.status === 'finished').length ?? 0;

  return (
    <DashboardLayout
      user={{
        name: 'Usuário Demo',
        email: 'demo@dev.com',
      }}
    >
      <div className="space-y-6">
        {/* Header - mesmo padrão do módulo Tanks */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <svg className="h-8 w-8 text-[#0EA5A4]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">Lotes</h1>
              <p className="mt-1 text-base text-slate-500">
                Gerencie e acompanhe os lotes de cultivo
              </p>
            </div>
          </div>
          <Link
            href="/company/batches/create"
            className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Novo Lote
          </Link>
        </div>

        {/* Search e Filtros - mesmo padrão do módulo Tanks */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-[#0EA5A4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por espécie, tanque..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-[#0EA5A4] bg-white pl-10 pr-4 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0EA5A4] focus:outline-none focus:ring-1 focus:ring-[#0EA5A4]"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-[#0EA5A4] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'active'
                  ? 'bg-[#0EA5A4] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setFilter('finished')}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'finished'
                  ? 'bg-[#0EA5A4] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Finalizados
            </button>
          </div>
        </div>

        {/* Contagem de resultados */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {totalFiltered} {totalFiltered === 1 ? 'lote encontrado' : 'lotes encontrados'}
          </p>
        </div>

        {/* Card container + Tabela */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
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
          ) : isError && error ? (
            <div className="p-6">
              <Alert
                type="error"
                title="Erro ao carregar lotes"
                message="Não foi possível carregar os lotes. Tente novamente mais tarde."
              />
            </div>
          ) : !filteredBatches.length ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-base">
                {search || filter !== 'all'
                  ? 'Nenhum lote encontrado com os filtros aplicados.'
                  : 'Nenhum lote cadastrado.'}
              </p>
              <p className="mt-1 text-sm">
                {search || filter !== 'all'
                  ? 'Tente alterar a busca ou os filtros.'
                  : 'Clique em Novo Lote para criar o primeiro.'}
              </p>
            </div>
          ) : (
            <>
              <BatchTable
                batches={filteredBatches}
                onDelete={handleDelete}
                isDeleting={deleteBatch.isPending}
              />
              {/* Estrutura de paginação - preparada para futura implementação */}
              {/* {pagination && total > limit && ( ... )} */}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
