'use client';

import { Progress } from '@/src/shared/components/ui/Progress';
import {
  PAYMENT_STATUS_LABELS,
  PurchasePaymentStatus,
  PurchaseStatus,
  STATUS_LABELS,
  type Purchase,
} from '../types';
import { formatPurchaseMoney } from '../utils/formatPurchaseMoney';
import {
  DataTable,
  EditIcon,
  EyeIcon,
  SpinnerIcon,
  TrashIcon,
  type DataTableAction,
  type DataTableColumn,
} from '@/shared/components/Table';
import { Badge } from '@/src/shared/components/ui/Badge';
import { CheckCircle2, CircleX, PackageCheck } from 'lucide-react';

const STATUS_STYLES: Record<PurchaseStatus, string> = {
  draft: 'bg-muted text-muted-foreground border-border',
  submitted: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
  approved: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30',
  partially_received: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  received: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
};

const PAYMENT_STYLES: Record<PurchasePaymentStatus, string> = {
  pending: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
  partial: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  paid: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
};

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

interface PurchaseTableProps {
  purchases: Purchase[];
  onView?: (purchase: Purchase) => void;
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (id: string, label: string) => void;
  isDeleting?: boolean;
  onReceive?: (purchase: Purchase) => void;
  isReceiving?: boolean;
  onCancel?: (id: string, label: string) => void;
  isCancelling?: boolean;
  onRegisterPayment?: (purchase: Purchase) => void;
  isRegisteringPayment?: boolean;
}

function getRowLabel(row: Purchase): string {
  return `${row.supplierName || 'Fornecedor'} · ${formatPurchaseMoney(row.totalPrice)}`;
}

function getViewAction(row: Purchase, onView: PurchaseTableProps['onView']): DataTableAction | null {
  if (!onView) return null;
  return { label: 'Ver detalhes', onClick: () => onView(row), icon: <EyeIcon className="h-4 w-4" /> };
}

function getEditAction(row: Purchase, onEdit: PurchaseTableProps['onEdit']): DataTableAction | null {
  if (!onEdit) return null;
  return { label: 'Editar', onClick: () => onEdit(row), icon: <EditIcon className="h-4 w-4" /> };
}

function getReceiveAction(row: Purchase, onReceive: PurchaseTableProps['onReceive'], isReceiving: boolean): DataTableAction | null {
  if (!onReceive || row.status === 'received' || row.status === 'cancelled') return null;
  return {
    label: isReceiving ? 'Recebendo...' : 'Receber compra',
    onClick: () => onReceive(row),
    disabled: isReceiving,
    icon: isReceiving ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />,
  };
}

function getCancelAction(row: Purchase, onCancel: PurchaseTableProps['onCancel'], isCancelling: boolean): DataTableAction | null {
  if (!onCancel || row.status === 'received' || row.status === 'cancelled') return null;
  return {
    label: isCancelling ? 'Cancelando...' : 'Cancelar compra',
    onClick: () => onCancel(row.id, getRowLabel(row)),
    disabled: isCancelling,
    variant: 'danger',
    icon: isCancelling ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <CircleX className="h-4 w-4" />,
  };
}

function getRegisterPaymentAction(row: Purchase, onRegisterPayment: PurchaseTableProps['onRegisterPayment'], isRegisteringPayment: boolean): DataTableAction | null {
  if (!onRegisterPayment || row.paymentStatus === 'paid' || row.status === 'cancelled') return null;
  return {
    label: isRegisteringPayment ? 'Registrando...' : 'Registrar pagamento',
    onClick: () => onRegisterPayment(row),
    disabled: isRegisteringPayment,
    icon: isRegisteringPayment ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />,
  };
}

function getDeleteAction(row: Purchase, onDelete: PurchaseTableProps['onDelete'], isDeleting: boolean): DataTableAction | null {
  if (!onDelete) return null;
  return {
    label: 'Excluir',
    onClick: () => onDelete(row.id, getRowLabel(row)),
    variant: 'danger',
    disabled: isDeleting,
    icon: isDeleting ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />,
  };
}

function buildRowActions(row: Purchase, props: PurchaseTableProps): DataTableAction[] {
  const {
    onView, onEdit, onDelete, onReceive, onCancel, onRegisterPayment,
    isDeleting = false, isCancelling = false, isReceiving = false, isRegisteringPayment = false,
  } = props;
  return [
    getViewAction(row, onView),
    getEditAction(row, onEdit),
    getReceiveAction(row, onReceive, isReceiving),
    getCancelAction(row, onCancel, isCancelling),
    getRegisterPaymentAction(row, onRegisterPayment, isRegisteringPayment),
    getDeleteAction(row, onDelete, isDeleting),
  ].filter((a): a is DataTableAction => a !== null);
}

function calculateReceivedRatio(purchase: Purchase): number {
  if (purchase.items.length === 0) return 0;
  const totalQuantity = purchase.items.reduce((sum, item) => sum + item.quantity, 0);
  const receivedQuantity = purchase.items.reduce(
    (sum, item) => sum + (item.receivedQuantity || 0),
    0,
  );
  return totalQuantity > 0 ? receivedQuantity / totalQuantity : 0;
}
const columns: Array<DataTableColumn<Purchase>> = [
  {
    id: 'referenceCode  ',
    header: 'Código',
    cell: (row) => <div className="text-sm text-slate-600">{row.referenceCode}</div>,
  },
  {
    id: 'invoiceNumber',
    header: 'NF / Documento',
    cell: (row) => <div className="text-sm text-slate-600">{row.invoiceNumber ?? '—'}</div>,
  },
  {
    id: 'supplierName',
    header: 'Fornecedor',
    cell: (row) => <div className="text-sm text-slate-600">{row.supplierName || '—'}</div>,
  },
  {
    id: 'orderDate',
    header: 'Data',
    cell: (row) => <div className="text-sm">{formatDate(row.orderDate)}</div>,
  },
  {
    id: 'process',
    header: 'Recebimento',
    cell: (row) => (
      <div>
        <Progress value={calculateReceivedRatio(row) * 100} className="h-2" />
        <div className="mt-1 text-xs text-muted-foreground">
          {Math.round(calculateReceivedRatio(row) * 100)}% recebido
        </div>
      </div>
    ),
  },
  {
    id: 'items',
    header: 'Itens',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (row) => <div className="text-sm text-slate-600 tabular-nums">{row.items.length}</div>,
  },
  {
    id: 'totalPrice',
    header: 'Total',
    headerClassName: 'text-right',
    cellClassName: 'text-right font-semibold',
    cell: (row) => (
      <div className="text-sm font-medium text-[#0F172A] tabular-nums">
        {formatPurchaseMoney(row.totalPrice)}
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => {
      const key = (row.status || 'draft') as PurchaseStatus;
      return (
        <Badge variant="outline" className={STATUS_STYLES[key]}>
          {STATUS_LABELS[key]}
        </Badge>
      );
    },
  },
  {
    id: 'paymentStatus',
    header: 'Pagamento',
    cell: (row) => {
      const key = (row.paymentStatus || 'pending') as PurchasePaymentStatus;
      return (
        <Badge variant="outline" className={PAYMENT_STYLES[key]}>
          {PAYMENT_STATUS_LABELS[key]}
        </Badge>
      );
    },
  },
];

export function PurchaseTable({
  purchases,
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
  onReceive,
  isReceiving = false,
  onCancel,
  isCancelling = false,
  onRegisterPayment,
  isRegisteringPayment = false,
}: Readonly<PurchaseTableProps>) {
  return (
    <DataTable
      data={purchases}
      columns={columns}
      getRowId={(row) => row.id}
      rowActions={(row) => buildRowActions(row, { purchases, onView, onEdit, onDelete, isDeleting, onReceive, isReceiving, onCancel, isCancelling, onRegisterPayment, isRegisteringPayment })}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhuma compra encontrada.</div>}
    />
  );
}
