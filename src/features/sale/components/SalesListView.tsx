'use client';

import React from 'react';
import { TrendingUp, CheckCircle2, DollarSign, AlertTriangle, Plus } from 'lucide-react';
import type { Sale, SaleDialogMode, SaleListResponse, SaleStatusFilter } from '../types';
import { SaleTable } from './SaleTable';
import { SaleDialog } from './SaleDialog';
import { Pagination } from '@/shared/components/list';
import { SearchField } from '@/shared/components/list';
import { OrdersIcon } from '@/shared/components/Sidebar/menuIcons';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

type SummaryStats = {
  totalRevenue: number;
  activeSalesCount: number;
  received: number;
  toReceive: number;
  overdue: number;
};

function SummaryCard({
  title,
  value,
  sub,
  icon,
  valueColor = 'text-[#0F172A]',
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <span className="text-slate-400">{icon}</span>
      </div>
      <p className={`mt-3 text-2xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export type SalesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  data: SaleListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  sales: Sale[];
  status: SaleStatusFilter;
  setStatus: (next: SaleStatusFilter) => void;
  summaryStats: SummaryStats;
  onDeleteSale?: (id: string, label: string) => void;
  isDeletingSale?: boolean;
  onCancelSale?: (id: string, label: string) => void;
  isCancellingSale?: boolean;
  onNew: () => void;
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  dialogOpen: boolean;
  dialogMode: SaleDialogMode;
  selectedSale: Sale | null;
  onDialogOpenChange: (open: boolean) => void;
  onDialogSuccess: () => void;
};

export function SalesListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  sales,
  status,
  setStatus,
  summaryStats,
  onDeleteSale,
  isDeletingSale = false,
  onCancelSale,
  isCancellingSale = false,
  onNew,
  onView,
  onEdit,
  dialogOpen,
  dialogMode,
  selectedSale,
  onDialogOpenChange,
  onDialogSuccess,
}: Readonly<SalesListViewProps>) {
  function renderContent() {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          Carregando...
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center py-16 text-red-500 text-sm">
          Erro ao carregar vendas.
        </div>
      );
    }
    if (sales.length === 0) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          Nenhuma venda encontrada.
        </div>
      );
    }
    return (
      <>
        <SaleTable
          sales={sales}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDeleteSale}
          isDeleting={isDeletingSale}
          onCancel={onCancelSale}
          isCancelling={isCancellingSale}
        />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="vendas"
            onPageChange={setPage}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center text-[#0EA5A4]">
              <OrdersIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Vendas</h1>
              <p className="mt-1 text-sm text-slate-500">
                Notas fiscais, faturamento e recebimentos.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNew}
            className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Nova Venda
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            title="Faturamento"
            value={formatMoney(summaryStats.totalRevenue)}
            sub={`${summaryStats.activeSalesCount} ${summaryStats.activeSalesCount === 1 ? 'venda' : 'vendas'}`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <SummaryCard
            title="Recebido"
            value={formatMoney(summaryStats.received)}
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            valueColor="text-emerald-600"
          />
          <SummaryCard
            title="A Receber"
            value={formatMoney(summaryStats.toReceive)}
            icon={<DollarSign className="h-5 w-5 text-blue-500" />}
            valueColor="text-blue-600"
          />
          <SummaryCard
            title="Em Atraso"
            value={formatMoney(summaryStats.overdue)}
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            valueColor="text-red-600"
          />
        </div>

        {/* Table card */}
        <Card>
          <CardHeader className="flex-row items-center justify-between px-5 py-4">
            <CardTitle className="text-base">Lista de Vendas</CardTitle>
            <Tabs
              value={status}
              onValueChange={(v) => {
                setStatus(v as SaleStatusFilter);
                setPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendente</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmada</TabsTrigger>
                <TabsTrigger value="paid">Paga</TabsTrigger>
                <TabsTrigger value="delivered">Entregue</TabsTrigger>
                <TabsTrigger value="overdue">Atrasada</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelada</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            <SearchField
              search={search}
              setSearch={setSearch}
              setCurrentPage={setPage}
              placeholder="Buscar por código, NF, cliente..."
            />
            <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {renderContent()}
            </main>
          </CardContent>
        </Card>
      </div>

      <SaleDialog
        open={dialogOpen}
        onOpenChange={onDialogOpenChange}
        mode={dialogMode}
        sale={selectedSale}
        onSuccess={onDialogSuccess}
      />
    </>
  );
}
