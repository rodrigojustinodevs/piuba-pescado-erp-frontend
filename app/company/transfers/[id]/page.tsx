'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTransfer } from '@/features/transfer';
import { TransferDetailView } from '@/features/transfer/components';
import { useBatches } from '@/features/batch';
import { useTanks } from '@/features/tank';
import { formatBatchShortLabel } from '@/features/batch/utils/format';
import { buildEntityMap } from '@/shared/utils/entityMap';
import { DashboardLayout } from '@/shared/components/Layout';
import { LoadingState, NotFoundState } from '@/shared/components/states/PageStates';

function trunc8(id: string) {
  return `${id.slice(0, 8)}…`;
}

export default function TransferDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: transfer, isLoading, error } = useTransfer(id);
  const { data: batchesData } = useBatches({ page: 1, limit: 1000 });
  const { data: tanksData } = useTanks({ page: 1, limit: 1000 });

  const batchMap = useMemo(
    () => buildEntityMap(batchesData?.batches, formatBatchShortLabel),
    [batchesData?.batches],
  );

  const tankMap = useMemo(
    () => buildEntityMap(tanksData?.tanks, (tank) => tank.name || tank.id.slice(0, 8)),
    [tanksData?.tanks],
  );

  const batchLabel = useMemo(() => {
    if (!transfer) return '—';
    return batchMap[transfer.batchId] ?? trunc8(transfer.batchId);
  }, [batchMap, transfer]);

  const originTankLabel = useMemo(() => {
    if (!transfer) return '—';
    return tankMap[transfer.originTankId] ?? trunc8(transfer.originTankId);
  }, [tankMap, transfer]);

  const destinationTankLabel = useMemo(() => {
    if (!transfer) return '—';
    return tankMap[transfer.destinationTankId] ?? trunc8(transfer.destinationTankId);
  }, [tankMap, transfer]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error || !transfer) {
    return (
      <DashboardLayout>
        <NotFoundState message="Transferência não encontrada." backHref="/company/transfers" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TransferDetailView
        transfer={transfer}
        batchLabel={batchLabel}
        originTankLabel={originTankLabel}
        destinationTankLabel={destinationTankLabel}
      />
    </DashboardLayout>
  );
}
