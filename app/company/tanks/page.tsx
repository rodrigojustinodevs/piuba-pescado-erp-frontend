'use client';

import { useMemo } from 'react';
import { useListPageState } from '@/app/_components/useListPageState';
import { useTanks, useDeleteTank, useTankLookups } from '@/features/tank';
import { TankTable } from '@/features/tank/components';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DemoDashboardLayout } from '@/app/_components/DemoDashboardLayout';
import { ListHeader } from '@/app/_components/ListHeader';
import { Pagination } from '@/app/_components/Pagination';
import { SearchField } from '@/app/_components/SearchField';
import { SortButton } from '@/app/_components/SortButton';
import { StatusFilterTabs } from '@/app/_components/StatusFilterTabs';
import { CircleIcon, ChevronRightIcon, FilterIcon, SpinnerIcon } from '@/app/_components/AppIcons';

export default function TanksPage() {
  // 1. Hooks de Estado e Dados
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, filter, setFilter, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useTanks({ page, limit: 10, search });
  const { tankTypeMap, companyMap } = useTankLookups();
  const deleteTank = useDeleteTank();
  const { showError } = useAlertModal();

  // 2. Lógica de Negócio (Memoizada para performance)
  const filteredTanks = useMemo(() => {
    const tanks = data?.tanks ?? [];
    if (filter === 'active') return tanks.filter((t) => t.status === 'active');
    if (filter === 'inactive') return tanks.filter((t) => t.status !== 'active');
    return tanks;
  }, [data?.tanks, filter]);

  const stats = useMemo(
    () => ({
      total: filteredTanks.length,
      inactive: data?.tanks.filter((t) => t.status !== 'active').length ?? 0,
    }),
    [filteredTanks, data?.tanks],
  );

  // 3. Handlers
  const confirmDelete = (id: string, name: string) => {
    showError(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o tanque "${name}"? Esta ação não pode ser desfeita.`,
      'Sim, Excluir',
      () => deleteTank.mutate(id),
    );
  };

  // 4. Fragmentos de UI (Sub-renderizadores para manter o retorno principal limpo)
  const renderEmptyState = () => (
    <div className="p-8 text-center text-slate-500">Nenhum tanque encontrado.</div>
  );

  const renderLoading = () => (
    <div className="p-8 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-500">
        <SpinnerIcon className="w-5 h-5 animate-spin" />
        <span>Carregando...</span>
      </div>
    </div>
  );

  return (
    <DemoDashboardLayout>
      <div className="space-y-6">
        <ListHeader
          icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
          title="Tanques"
          subtitle="Gerencie e acompanhe os tanques cadastrados"
          ctaHref="/company/tanks/create"
          ctaLabel="Novo Tanque"
        />

        {/* Barra de Ferramentas */}
        <section className="flex flex-wrap items-center gap-3">
          <SearchField value={search} placeholder="Buscar tanque..." onChange={setSearch} />

          <StatusFilterTabs
            filter={filter}
            onChange={setFilter}
            inactiveCount={stats.inactive}
            labels={{ all: 'Todas', active: 'Ativos', inactive: 'Inativos' }}
          />

          <SortButton current={sortBy} onSort={setSortBy} />
        </section>

        {/* Resumo de Resultados */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {stats.total} {stats.total === 1 ? 'tanque encontrado' : 'tanques encontrados'}
          </p>
          <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <FilterIcon className="h-4 w-4" />
            Filtros avançados
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading && renderLoading()}

          {error && <div className="p-8 text-center text-red-600">Erro ao carregar tanques.</div>}

          {!isLoading && !error && (
            <>
              {!filteredTanks.length ? (
                renderEmptyState()
              ) : (
                <TankTable
                  tanks={filteredTanks}
                  onDelete={confirmDelete}
                  isDeleting={deleteTank.isPending}
                  tankTypeMap={tankTypeMap}
                  companyMap={companyMap}
                />
              )}

              {data && data.total > data.limit && (
                <Pagination
                  page={page}
                  limit={data.limit}
                  total={data.total}
                  itemLabelPlural="tanques"
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </DemoDashboardLayout>
  );
}
