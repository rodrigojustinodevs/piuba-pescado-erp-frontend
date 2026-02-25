'use client';

import { useMemo } from 'react';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useDeleteTransfer, useTransfers } from '@/features/transfer';
import { TransferTable } from '@/features/transfer/components';
import { useBatches } from '@/features/batch';
import { formatBatchShortLabel } from '@/features/batch/utils/format';
import { useTanks } from '@/features/tank';
import { useAlertModal } from '@/shared/components/AlertModal';
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

export default function TransfersPage() {
  const listState = useListPageState({ initialSortBy: 'createdAt' });
  const { page, setPage, search, setSearch, sortBy, setSortBy } = listState;

  const { data, isLoading, error } = useTransfers({
    page,
    per_page: PER_PAGE,
  });

  const { data: batchesData } = useBatches({ page: 1, limit: 500 });
  const { data: tanksData } = useTanks({ page: 1, limit: 1000 });
  const deleteTransfer = useDeleteTransfer();
  const { showError: showAlertError } = useAlertModal();

  const batchMap = useMemo(() => {
    return buildEntityMap(batchesData?.batches, formatBatchShortLabel);
  }, [batchesData?.batches]);

  const tankMap = useMemo(() => {
    return buildEntityMap(tanksData?.tanks, (tank) => tank.name || tank.id.slice(0, 8));
  }, [tanksData?.tanks]);

  const transfers = data?.transfers ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? PER_PAGE;

  const handleDelete = (id: string) => {
    showAlertError(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta transferência? Esta ação não pode ser desfeita.',
      'Sim, Excluir',
      () => deleteTransfer.mutate(id),
    );
  };

  const emptyTitle = search
    ? 'Nenhuma transferência encontrada com os filtros aplicados.'
    : 'Nenhuma transferência cadastrada.';
  const emptySubtitle = search
    ? 'Tente alterar a busca.'
    : 'Clique em Nova Transferência para criar a primeira.';

  return (
    <DashboardLayout user={demoUser}>
      <div className="space-y-6">
        <ListHeader
          icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
          title="Transferências"
          subtitle="Gerencie e acompanhe as transferências entre tanques"
          ctaHref="/company/transfers/create"
          ctaLabel="Nova Transferência"
        />

        <ListSearchAndSortBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar transferência..."
          sortBy={sortBy}
          onSort={setSortBy}
        />

        <ListSummaryBar
          total={total}
          singularLabel="transferência encontrada"
          pluralLabel="transferências encontradas"
        />

        <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading && <ListLoadingState />}

          {error && (
            <ListErrorState
              title="Erro ao carregar transferências"
              message="Não foi possível carregar as transferências. Tente novamente mais tarde."
            />
          )}

          {!isLoading && !error && (
            <>
              {transfers.length === 0 ? (
                <ListEmptyState title={emptyTitle} subtitle={emptySubtitle} />
              ) : (
                <TransferTable
                  transfers={transfers}
                  batchMap={batchMap}
                  tankMap={tankMap}
                  onDelete={handleDelete}
                  isDeleting={deleteTransfer.isPending}
                />
              )}

              {total > limit && (
                <Pagination
                  page={page}
                  limit={limit}
                  total={total}
                  itemLabelPlural="transferências"
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
