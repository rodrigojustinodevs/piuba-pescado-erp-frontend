'use client';

import { useMemo } from 'react';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useSettlements } from '@/features/settlement';
import { SettlementTable } from '@/features/settlement/components';
import { useBatches } from '@/features/batch';
import { formatBatchShortLabel } from '@/features/batch/utils/format';
import { DashboardLayout } from '@/shared/components/Layout';
import { demoUser } from '@/shared/constants/demoUser';
import {
  ListHeader,
  ListSearchAndSortBar,
  ListSummaryBar,
  Pagination,
} from '@/shared/components/list';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { CircleIcon } from '@/shared/components/icons/AppIcons';
import { buildEntityMap } from '@/shared/utils/entityMap';

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
    return buildEntityMap(batchesData?.batches, formatBatchShortLabel);
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

        <ListSearchAndSortBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar povoamento..."
          sortBy={sortBy}
          onSort={setSortBy}
        />

        <ListSummaryBar
          total={total}
          singularLabel="povoamento encontrado"
          pluralLabel="povoamentos encontrados"
        />

        <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading && <ListLoadingState />}

          {error && (
            <ListErrorState
              title="Erro ao carregar povoamentos"
              message="Não foi possível carregar os povoamentos. Tente novamente mais tarde."
            />
          )}

          {!isLoading && !error && (
            <>
              {settlements.length === 0 ? (
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
