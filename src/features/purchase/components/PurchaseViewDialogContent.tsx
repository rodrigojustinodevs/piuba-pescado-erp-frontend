'use client';

import {
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { Purchase } from '../types';
import { getPurchaseStatusLabel } from '../utils/purchaseStatusLabels';
import { formatPurchaseMoney } from '../utils/formatPurchaseMoney';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Separator } from '@/shared/components/ui/Separator';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';

type PurchaseViewDialogContentProps = {
  purchase: Purchase | null;
  onReceive?: (id: string) => void;
  isReceiving?: boolean;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
  onOpenPaymentDialog?: () => void;
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-500/15 text-slate-700 border-slate-500/30',
  confirmed: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  received: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-700 border-red-500/30',
};

function formatDate(value: string | null): string {
  const text = formatNullableDatePtBR(value ?? '');
  return text === '—' ? (value ?? '—') : text;
}

export function PurchaseViewDialogContent({
  purchase,
  onReceive,
  isReceiving = false,
  onCancel,
  isCancelling = false,
  onOpenPaymentDialog,
}: Readonly<PurchaseViewDialogContentProps>) {
  if (!purchase) return null;

  const canReceive = purchase.status?.toLowerCase() === 'confirmed';
  const canCancel = purchase.status?.toLowerCase() !== 'received';
  const canRegisterPayment = purchase.paymentStatus !== 'paid' && purchase.status !== 'cancelled';

  const itemColumns: Array<DataTableColumn<Purchase['items'][number]>> = [
    {
      id: 'supplyName',
      header: 'Insumo',
      cell: (item) => <div className="text-sm text-slate-700">{item.supplyName || '—'}</div>,
    },
    {
      id: 'quantity',
      header: 'Qtd',
      align: 'right',
      cell: (item) => <div className="text-sm text-slate-700 tabular-nums">{item.quantity}</div>,
    },
    {
      id: 'unit',
      header: 'Un',
      align: 'center',
      cell: (item) => <div className="text-sm text-slate-700">{item.unit || '—'}</div>,
    },
    {
      id: 'unitPrice',
      header: 'Preço unit.',
      align: 'right',
      cell: (item) => (
        <div className="text-sm text-slate-700 tabular-nums">
          {formatPurchaseMoney(item.unitPrice)}
        </div>
      ),
    },
    {
      id: 'totalPrice',
      header: 'Subtotal',
      align: 'right',
      cell: (item) => (
        <div className="text-sm font-medium text-[#0F172A] tabular-nums">
          {formatPurchaseMoney(item.totalPrice)}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <ShoppingCart className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {purchase.supplierName || 'Fornecedor não informado'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{formatDate(purchase.orderDate)}</span>
            <Badge
              variant="outline"
              className={STATUS_STYLES[purchase.status] ?? STATUS_STYLES.draft}
            >
              {getPurchaseStatusLabel(purchase.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Total da Compra</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatPurchaseMoney(purchase.totalPrice)}</div>
            <p className="text-xs text-muted-foreground">valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{purchase.items.length}</div>
            <p className="text-xs text-muted-foreground">
              {purchase.items.length === 1 ? 'insumo' : 'insumos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Data da Compra</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(purchase.orderDate)}</div>
            <p className="text-xs text-muted-foreground">data do pedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Fornecedor</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold leading-tight">{purchase.supplierName || '—'}</div>
            <p className="text-xs text-muted-foreground">fornecedor</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações de status */}
      {(canReceive || canCancel || canRegisterPayment) && (
        <div className="flex flex-wrap gap-2">
          {canReceive && onReceive && (
            <button
              type="button"
              disabled={isReceiving}
              onClick={() => onReceive(purchase.id)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4" />
              {isReceiving ? 'Recebendo...' : 'Receber compra'}
            </button>
          )}
          {canCancel && onCancel && (
            <button
              type="button"
              disabled={isCancelling}
              onClick={() => onCancel(purchase.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="h-4 w-4" />
              {isCancelling ? 'Cancelando...' : 'Cancelar compra'}
            </button>
          )}
          {canRegisterPayment && onOpenPaymentDialog && (
            <button
              type="button"
              onClick={onOpenPaymentDialog}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition"
            >
              <DollarSign className="h-4 w-4" />
              Registrar pagamento
            </button>
          )}
        </div>
      )}

      <Separator />

      {/* Detalhes */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Detalhes</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <FileText className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">NF / Documento</p>
              <p className="text-sm font-medium text-slate-800">{purchase.invoiceNumber || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Recebido em</p>
              <p className="text-sm font-medium text-slate-800">
                {formatNullableDatePtBR(purchase.receivedAt ?? '', true)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de itens */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Itens da compra</p>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <DataTable
            data={purchase.items}
            columns={itemColumns}
            getRowId={(item) => item.id || `${item.supplyId}-${item.unit}`}
            emptyState={<div className="p-6 text-center text-slate-500 text-sm">Nenhum item.</div>}
          />
        </div>
      </div>

      <Separator />

      {/* Timestamps */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>Criado em: {formatNullableDatePtBR(purchase.createdAt, true)}</span>
        <span>Atualizado em: {formatNullableDatePtBR(purchase.updatedAt, true)}</span>
      </div>
    </div>
  );
}
