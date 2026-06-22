'use client';

import { useState, useCallback } from 'react';
import type {
  Purchase,
  PurchaseListResponse,
  PurchaseDialogMode,
  PurchaseCatalogStats,
} from '../types';
import { PurchaseTable } from './PurchaseTable';
import { PurchaseDialog } from './PurchaseDialog';
import { PurchaseReceiveDialog } from './PurchaseReceiveDialog';
import { PurchasePaymentDialog } from './PurchasePaymentDialog';
import { PurchaseCatalogStatsCards } from './PurchaseCatalogStats';
import { Button } from '@/shared/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { Plus } from 'lucide-react';
import { SearchField } from '@/shared/components/list';
import { Pagination } from '@/shared/components/list/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { getPurchaseStatusLabel } from '../utils/purchaseStatusLabels';

const STATUS_OPTIONS = [
  { value: 'draft', label: getPurchaseStatusLabel('draft') },
  { value: 'submitted', label: getPurchaseStatusLabel('submitted') },
  { value: 'approved', label: getPurchaseStatusLabel('approved') },
  { value: 'partially_received', label: getPurchaseStatusLabel('partially_received') },
  { value: 'received', label: getPurchaseStatusLabel('received') },
  { value: 'cancelled', label: getPurchaseStatusLabel('cancelled') },
];

export type PurchasesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  statusFilter: string;
  setStatusFilter: (next: string) => void;
  tabFilter: 'todas' | 'pendentes' | 'parcial' | 'pagos';
  setTabFilter: (next: 'todas' | 'pendentes' | 'parcial' | 'pagos') => void;
  data: PurchaseListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  purchases: Purchase[];
  stats: PurchaseCatalogStats;
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
  handleReceive: (id: string, label: string) => void;
  isReceiving: boolean;
  handleCancel: (id: string, label: string) => void;
  isCancelling: boolean;
};

export function PurchasesListView({
  page,
  setPage,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  tabFilter,
  setTabFilter,
  data,
  isLoading,
  error,
  purchases,
  stats,
  handleDelete,
  isDeleting,
  handleReceive,
  isReceiving,
  handleCancel,
  isCancelling,
}: Readonly<PurchasesListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<PurchaseDialogMode>('create');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [receiveDialogPurchase, setReceiveDialogPurchase] = useState<Purchase | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDialogPurchase, setPaymentDialogPurchase] = useState<Purchase | null>(null);
  const perPage = 10;

  const openDialog = useCallback((mode: PurchaseDialogMode, purchase: Purchase | null = null) => {
    setDialogMode(mode);
    setSelectedPurchase(purchase);
    setDialogOpen(true);
  }, []);

  const total = data?.total ?? 0;
  const pagedPurchases = purchases.slice((page - 1) * perPage, page * perPage);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400">Carregando...</div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center py-16 text-red-500 text-sm">
          Erro ao carregar compras.
        </div>
      );
    }
    if (purchases.length === 0) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          Nenhuma compra encontrada.
        </div>
      );
    }
    return (
      <PurchaseTable
        purchases={pagedPurchases}
        onView={(purchase) => openDialog('view', purchase)}
        onEdit={(purchase) => openDialog('edit', purchase)}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onReceive={(purchase) => {
          setReceiveDialogPurchase(purchase);
          setReceiveDialogOpen(true);
        }}
        onCancel={handleCancel}
        isCancelling={isCancelling}
        onRegisterPayment={(purchase) => {
          setPaymentDialogPurchase(purchase);
          setPaymentDialogOpen(true);
        }}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compras</h1>
          <p className="mt-1 text-sm text-slate-500">Pedidos de insumos e fornecedores.</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => openDialog('create')}>
          <Plus className="h-4 w-4" />
          Nova Compra
        </Button>
      </div>

      {/* Stats */}
      <PurchaseCatalogStatsCards stats={stats} />

      {/* Table card */}
      <Card>
        <CardHeader className="flex-row justify-between px-5 py-4">
          <CardTitle className="text-base">Lista de Compras</CardTitle>
          <Tabs
            value={tabFilter}
            onValueChange={(v) => {
              setTabFilter(v as 'todas' | 'pagos' | 'parcial' | 'pendentes');
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="parcial">Parcial</TabsTrigger>
              <TabsTrigger value="pagos">Pagos</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={search}
                setSearch={setSearch}
                setCurrentPage={setPage}
                placeholder="Buscar por fornecedor ou documento..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
            >
              <option value="">Todos os status</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>

          {!isLoading && !error && purchases.length > 0 && (
            <Pagination
              page={page}
              limit={perPage}
              total={total}
              itemLabelPlural="compras"
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      <PurchaseDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedPurchase(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        purchase={selectedPurchase}
        onSuccess={() => setDialogOpen(false)}
      />

      <PurchaseReceiveDialog
        open={receiveDialogOpen}
        onOpenChange={(open) => {
          if (!open) setReceiveDialogPurchase(null);
          setReceiveDialogOpen(open);
        }}
        purchase={receiveDialogPurchase}
      />

      <PurchasePaymentDialog
        open={paymentDialogOpen}
        onOpenChange={(open) => {
          if (!open) setPaymentDialogPurchase(null);
          setPaymentDialogOpen(open);
        }}
        purchase={paymentDialogPurchase}
      />
    </div>
  );
}
