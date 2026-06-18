'use client';

import { useState, useCallback } from 'react';
import type {
  FinancialTransaction,
  FinancialTransactionListResponse,
  FinancialTransactionDialogMode,
  FinancialTransactionCatalogStats,
  FinancialTransactionStatus,
  FinancialTransactionType,
} from '../types';
import { FinancialTransactionTable } from './FinancialTransactionTable';
import { FinancialTransactionDialog } from './FinancialTransactionDialog';
import { FinancialTransactionCatalogStatsCards } from './FinancialTransactionCatalogStats';
import { Button } from '@/shared/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { Eye, Pencil, Plus, Trash } from 'lucide-react';
import { SearchField } from '@/shared/components/list';
import { Pagination } from '@/shared/components/list/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';

type StatusTab = FinancialTransactionStatus | 'all';
type TypeFilter = Exclude<FinancialTransactionType, 'other'> | 'all';

export type FinancialTransactionsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  sortBy: string;
  setSortBy: (next: string) => void;
  statusTab: StatusTab;
  setStatusTab: (next: StatusTab) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (next: TypeFilter) => void;
  data: FinancialTransactionListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  financialTransactions: FinancialTransaction[];
  stats: FinancialTransactionCatalogStats;
  handleDelete: (id: string, label: string) => void;
  isDeleting: boolean;
};

const PER_PAGE = 25;

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendente' },
  { value: 'paid', label: 'Pago' },
  { value: 'overdue', label: 'Atrasado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export function FinancialTransactionsListView({
  page,
  setPage,
  search,
  setSearch,
  statusTab,
  setStatusTab,
  typeFilter,
  setTypeFilter,
  data,
  isLoading,
  error,
  financialTransactions,
  stats,
  handleDelete,
  isDeleting,
}: Readonly<FinancialTransactionsListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<FinancialTransactionDialogMode>('create');
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

  const openDialog = useCallback(
    (mode: FinancialTransactionDialogMode, transaction: FinancialTransaction | null = null) => {
      setDialogMode(mode);
      setSelectedTransaction(transaction);
      setDialogOpen(true);
    },
    [],
  );

  const getRowActions = useCallback(
    (row: FinancialTransaction) => [
      {
        label: 'Ver detalhes',
        onClick: () => openDialog('view', row),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openDialog('edit', row),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleDelete(row.id, row.description || row.typeLabel),
        icon: <Trash className="h-4 w-4" />,
        variant: 'danger' as const,
        disabled: isDeleting,
      },
    ],
    [openDialog, handleDelete, isDeleting],
  );

  const total = data?.total ?? 0;
  const pagedTransactions = financialTransactions.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400">Carregando...</div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center py-16 text-red-500 text-sm">
          Erro ao carregar transações financeiras.
        </div>
      );
    }
    if (financialTransactions.length === 0) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          Nenhuma transação financeira encontrada.
        </div>
      );
    }
    return (
      <>
        <FinancialTransactionTable
          financialTransactions={pagedTransactions}
          getRowActions={getRowActions}
        />
        <Pagination
          page={page}
          limit={PER_PAGE}
          total={total}
          itemLabelPlural="transações"
          onPageChange={setPage}
        />
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transações Financeiras</h1>
          <p className="mt-1 text-sm text-slate-500">
            Contas a pagar e a receber da empresa.
          </p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => openDialog('create')}>
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Stats */}
      <FinancialTransactionCatalogStatsCards stats={stats} />

      {/* Table card */}
      <Card>
        <CardHeader className="flex-row justify-between items-center px-5 py-4">
          <CardTitle className="text-base">Lista de Transações</CardTitle>
          <Tabs
            value={statusTab}
            onValueChange={(v) => {
              setStatusTab(v as StatusTab);
              setPage(1);
            }}
          >
            <TabsList>
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
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
                placeholder="Buscar por descrição, categoria..."
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as TypeFilter);
                setPage(1);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
            >
              <option value="all">Todos os tipos</option>
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
              <option value="transfer">Transferência</option>
            </select>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>
        </CardContent>
      </Card>

      <FinancialTransactionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null);
          setDialogOpen(open);
        }}
        mode={dialogMode}
        transaction={selectedTransaction}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
}
