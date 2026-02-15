'use client';

import { useListPageState } from '@/shared/hooks/useListPageState';
import { useBatches, useDeleteBatch } from '@/features/batch';
import type { BatchStatus } from '@/features/batch';
import { BatchTable } from '@/features/batch/components';
import { DashboardLayout } from '@/shared/components/Layout';
import { Alert } from '@/shared/components/Alert';
import { useAlertModal } from '@/shared/components/AlertModal';
import { ListHeader, SearchField, SortButton, StatusFilterTabs } from '@/shared/components/list';
import {
  ChevronRightIcon,
  CircleIcon,
  FilterIcon,
  SpinnerIcon,
} from '@/shared/components/icons/AppIcons';

type FilterType = 'all' | BatchStatus;

export default function BatchListPage() {
  const listState = useListPageState<FilterType>({ initialFilter: 'all' });
  const { page, search, setSearch, filter, setFilter, sortBy, setSortBy } = listState;

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
  const finishedCount = data?.batches.filter((b) => b.status === 'finished').length ?? 0;

  return (
    <DashboardLayout
      user={{
        name: 'Usuário Demo',
        email: 'demo@dev.com',
      }}
    >
      <div className="space-y-6">
        <ListHeader
          icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
          title="Lotes"
          subtitle="Gerencie e acompanhe os lotes de cultivo"
          ctaHref="/company/batches/create"
          ctaLabel="Novo Lote"
        />

        <section className="flex flex-wrap items-center gap-3">
          <SearchField
            value={search}
            placeholder="Buscar por espécie, tanque..."
            onChange={setSearch}
          />
          <StatusFilterTabs<FilterType>
            filter={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'active', label: 'Ativos' },
              { value: 'finished', label: 'Finalizados', badgeCount: finishedCount },
            ]}
          />
          <SortButton current={sortBy} onSort={setSortBy} />
        </section>

        {/* Resumo de resultados + Filtros avançados */}
        <section className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {totalFiltered} {totalFiltered === 1 ? 'lote encontrado' : 'lotes encontrados'}
          </p>
          <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <FilterIcon className="h-4 w-4" />
            Filtros avançados
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </section>

        {/* Card container + Tabela */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <SpinnerIcon className="w-5 h-5 animate-spin" />
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
