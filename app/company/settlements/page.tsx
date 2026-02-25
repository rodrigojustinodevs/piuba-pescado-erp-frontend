'use client';

import { useMemo } from 'react';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useSettlements } from '@/features/settlement';
import { SettlementTable } from '@/features/settlement/components';
import { useBatches } from '@/features/batch';
import { DashboardLayout } from '@/shared/components/Layout';
import { Alert } from '@/shared/components/Alert';
import { demoUser } from '@/shared/constants/demoUser';
import { ListHeader, Pagination, SearchField, SortButton } from '@/shared/components/list';
import { ListEmptyState, ListLoadingState } from '@/shared/components/states/ListStates';
import { CircleIcon, ChevronRightIcon, FilterIcon } from '@/shared/components/icons/AppIcons';

const PER_PAGE = 25;

export default function SettlementsPage() {
  const listState = useListPageState({ initialSortBy: 'settlementDate' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useSettlements({
    page,
    per_page: PER_PAGE,
  });
  const { data: batchesData } = useBatches({ page: 1, limit: 500 });

  const batchMap = useMemo(() => {
    const map: Record<string, string> = {};
    batchesData?.batches?.forEach((b) => {
      map[b.id] = b.name || b.species || b.id.slice(0, 8);
    });
    return map;
  }, [batchesData?.batches]);

  const settlements = data?.settlements ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? PER_PAGE;

  const emptyTitle = search
    ? 'Nenhum povoamento encontrado com os filtros aplicados.'
    : 'Nenhum povoamento cadastrado.';
  const emptySubtitle = search
    ? 'Tente alterar a busca.'
    : 'Clique em Novo Povoamento para criar o primeiro.';

  return (
    <DashboardLayout user={demoUser}>
      <div className="space-y-6">
        <ListHeader
          icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
          title="Povoamentos"
          subtitle="Gerencie e acompanhe os povoamentos de lotes"
          ctaHref="/company/settlements/create"
          ctaLabel="Novo Povoamento"
        />

        <section className="flex flex-wrap items-center gap-3">
          <SearchField value={search} placeholder="Buscar povoamento..." onChange={setSearch} />
          <SortButton current={sortBy} onSort={setSortBy} />
        </section>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {total} {total === 1 ? 'povoamento encontrado' : 'povoamentos encontrados'}
          </p>
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <FilterIcon className="h-4 w-4" />
            Filtros avançados
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading && <ListLoadingState />}

          {error && (
            <div className="p-6">
              <Alert
                type="error"
                title="Erro ao carregar povoamentos"
                message="Não foi possível carregar os povoamentos. Tente novamente mais tarde."
              />
            </div>
          )}

          {!isLoading && !error && (
            <>
              {!settlements.length ? (
                <ListEmptyState title={emptyTitle} subtitle={emptySubtitle} />
              ) : (
                <SettlementTable settlements={settlements} batchMap={batchMap} />
              )}

              {total > limit && (
                <Pagination
                  page={page}
                  limit={limit}
                  total={total}
                  itemLabelPlural="povoamentos"
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
