'use client';

import { StocksListView, useStocksListPage } from '@/features/stock';
import { DashboardLayout } from '@/shared/components/Layout';

export default function StocksPage() {
  const state = useStocksListPage();

  return (
    <DashboardLayout>
      <StocksListView
        {...state}
        isAdjusting={state.adjustStock.isPending}
        onConfirmAdjust={(id, payload) => {
          state.adjustStock.mutate(
            { id, payload },
            {
              onSuccess: () => state.closeAdjust(),
            },
          );
        }}
      />
    </DashboardLayout>
  );
}
