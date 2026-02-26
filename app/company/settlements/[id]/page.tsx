'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useSettlement } from '@/features/settlement';
import { SettlementDetailView } from '@/features/settlement/components';
import { useBatches } from '@/features/batch';
import { formatBatchShortLabel } from '@/features/batch/utils/format';
import { buildEntityMap } from '@/shared/utils/entityMap';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function trunc8(id: string) {
  return `${id.slice(0, 8)}…`;
}

export default function SettlementDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: settlement, isLoading, error } = useSettlement(id);
  const { data: batchesData } = useBatches({ page: 1, limit: 1000 });

  const batchMap = useMemo(
    () => buildEntityMap(batchesData?.batches, formatBatchShortLabel),
    [batchesData?.batches],
  );

  const batchLabel = useMemo(() => {
    if (!settlement) return '—';
    return batchMap[settlement.batcheId] ?? trunc8(settlement.batcheId);
  }, [batchMap, settlement]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !settlement) {
    return (
      <DashboardLayout>
        <NotFoundState message="Povoamento não encontrado." backHref="/company/settlements" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SettlementDetailView settlement={settlement} batchLabel={batchLabel} />
    </DashboardLayout>
  );
}
