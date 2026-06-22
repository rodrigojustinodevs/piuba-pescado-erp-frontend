'use client';

import { useMemo } from 'react';
import type {
  StockTransaction,
  StockTransactionCatalogStats,
  StockTransactionListResponse,
  StockTransactionReferenceType,
} from '../types';
import { StockTransactionTable } from './StockTransactionTable';
import { StockTransactionCatalogStatsCards } from './StockTransactionCatalogStats';
import { SearchField } from '@/shared/components/list';
import { Pagination } from '@/shared/components/list/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';

const REFERENCE_TYPE_OPTIONS: Array<{
  value: StockTransactionReferenceType | 'all';
  label: string;
}> = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'purchase_item', label: 'Item de compra' },
  { value: 'feeding', label: 'Alimentação' },
  { value: 'adjustment', label: 'Ajuste' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'stocking', label: 'Povoamento' },
  { value: 'sale', label: 'Venda' },
];

export type StockTransactionsListViewProps = {
  page: number;
  setPage: (next: number) => void;
  referenceType: StockTransactionReferenceType | 'all';
  setReferenceType: (next: StockTransactionReferenceType | 'all') => void;
  referenceId: string;
  setReferenceId: (next: string) => void;
  data: StockTransactionListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  transactions: StockTransaction[];
  stats: StockTransactionCatalogStats;
};

export function StockTransactionsListView({
  page,
  setPage,
  referenceType,
  setReferenceType,
  referenceId,
  setReferenceId,
  data,
  isLoading,
  error,
  transactions,
  stats,
}: Readonly<StockTransactionsListViewProps>) {
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 25;

  const typeOptions = useMemo(() => REFERENCE_TYPE_OPTIONS, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400">Carregando...</div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center py-16 text-red-500 text-sm">
          Erro ao carregar transações.
        </div>
      );
    }
    if (transactions.length === 0) {
      return (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          Nenhuma transação encontrada.
        </div>
      );
    }
    return <StockTransactionTable transactions={transactions} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Movimentações de Estoque</h1>
          <p className="mt-1 text-sm text-slate-500">
            Histórico de entradas e saídas por compra, alimentação, ajuste, transferência e outros.
          </p>
        </div>
      </div>

      <StockTransactionCatalogStatsCards stats={stats} />

      <Card>
        <CardHeader className="flex-row justify-between px-5 py-4">
          <CardTitle className="text-base">Lista de Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchField
                search={referenceId}
                setSearch={setReferenceId}
                setCurrentPage={setPage}
                placeholder="Filtrar por ID da referência..."
              />
            </div>
            <select
              value={referenceType}
              onChange={(e) => {
                setReferenceType(e.target.value as StockTransactionReferenceType | 'all');
                setPage(1);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
            >
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {renderContent()}
          </main>

          {!isLoading && !error && transactions.length > 0 && (
            <Pagination
              page={page}
              limit={limit}
              total={total}
              itemLabelPlural="transações"
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
