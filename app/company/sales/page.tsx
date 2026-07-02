'use client';

import { SalesListView, useSalesListPage } from '@/features/sale';
import { DashboardLayout } from '@/shared/components/Layout';

export default function SalesPage() {
  const state = useSalesListPage();

  return (
    <DashboardLayout>
      <SalesListView
        page={state.page}
        setPage={state.setPage}
        search={state.search}
        setSearch={state.setSearch}
        sortBy={state.sortBy}
        setSortBy={state.setSortBy}
        data={state.data}
        isLoading={state.isLoading}
        error={state.error}
        sales={state.sales}
        status={state.status}
        setStatus={state.setStatus}
        summaryStats={state.summaryStats}
        onDeleteSale={state.onDeleteSale}
        isDeletingSale={state.isDeletingSale}
        onCancelSale={state.onCancelSale}
        isCancellingSale={state.isCancellingSale}
        onNew={() => state.openDialog('create')}
        onView={(sale) => state.openDialog('view', sale)}
        onEdit={(sale) => state.openDialog('edit', sale)}
        dialogOpen={state.dialogOpen}
        dialogMode={state.dialogMode}
        selectedSale={state.selectedSale}
        onDialogOpenChange={(open) => { if (!open) state.closeDialog(); }}
        onDialogSuccess={state.closeDialog}
      />
    </DashboardLayout>
  );
}
