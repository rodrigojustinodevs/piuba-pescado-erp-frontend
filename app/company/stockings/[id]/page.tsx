'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useStocking } from '@/features/stocking';
import { StockingDetailView } from '@/features/stocking/components';
import { useBatches } from '@/features/batch';
import { formatBatchShortLabel } from '@/features/batch/utils/format';
import { buildEntityMap } from '@/shared/utils/entityMap';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function trunc8(id: string) {
  return `${id.slice(0, 8)}…`;
}

export default function StockingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: stocking, isLoading, error } = useStocking(id);
  const { data: batchesData } = useBatches({ page: 1, limit: 1000 });

  const batchMap = useMemo(
    () => buildEntityMap(batchesData?.batches, formatBatchShortLabel),
    [batchesData?.batches],
  );

  const batchLabel = useMemo(() => {
    if (!stocking) return '—';
    return batchMap[stocking.batchId] ?? trunc8(stocking.batchId);
  }, [batchMap, stocking]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !stocking) {
    return (
      <DashboardLayout>
        <NotFoundState message="Povoamento não encontrado." backHref="/company/stockings" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <StockingDetailView stocking={stocking} batchLabel={batchLabel} />
    </DashboardLayout>
  );
}
