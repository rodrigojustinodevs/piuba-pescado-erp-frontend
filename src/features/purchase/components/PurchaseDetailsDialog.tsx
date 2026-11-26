'use client';

import type { ReactNode } from 'react';
import {
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle,
  DollarSign,
  FileText,
  Hash,
  ListOrdered,
  Package,
  ShoppingCart,
  User,
  XCircle,
} from 'lucide-react';
import type { Purchase } from '../types';
import { getPurchaseStatusLabel } from '../utils/purchaseStatusLabels';
import { formatPurchaseMoney } from '../utils/formatPurchaseMoney';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Button } from '@/shared/components/ui/Button';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsSection,
  DetailsStatusBadge,
  DetailsTile,
  DetailsTimestamps,
  getStatusTone,
  type DetailTone,
} from '@/shared/components/detailsDialog';

type PurchaseDetailsDialogProps = {
  readonly purchase: Purchase | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
  readonly onReceive?: (id: string) => void;
  readonly isReceiving?: boolean;
  readonly onCancel?: (id: string) => void;
  readonly isCancelling?: boolean;
  readonly onOpenPaymentDialog?: () => void;
};

const PURCHASE_STATUS_TONE: Record<string, DetailTone> = {
  draft: 'neutral',
  confirmed: 'info',
  received: 'success',
  cancelled: 'danger',
};

type Item = Purchase['items'][number];

function cell(value: ReactNode, className = 'text-sm tabular-nums') {
  return <div className={className}>{value}</div>;
}

const ITEM_COLUMNS: Array<DataTableColumn<Item>> = [
  { id: 'supplyName', header: 'Insumo', cell: (item) => cell(item.supplyName || '—', 'text-sm') },
  { id: 'quantity', header: 'Qtd', align: 'right', cell: (item) => cell(item.quantity) },
  { id: 'unit', header: 'Un', align: 'center', cell: (item) => cell(item.unit || '—', 'text-sm') },
  {
    id: 'unitPrice',
    header: 'Preço unit.',
    align: 'right',
    cell: (item) => cell(formatPurchaseMoney(item.unitPrice)),
  },
  {
    id: 'totalPrice',
    header: 'Subtotal',
    align: 'right',
    cell: (item) => cell(formatPurchaseMoney(item.totalPrice), 'text-sm font-medium tabular-nums'),
  },
];

function PurchaseDetailsBody({ purchase }: Readonly<{ purchase: Purchase }>) {
  const tone =
    PURCHASE_STATUS_TONE[purchase.status?.toLowerCase()] ?? getStatusTone(purchase.status);
  const itemCount = purchase.items.length;

  return (
    <DetailsDialogBody>
      <DetailsHero
        icon={ShoppingCart}
        title={purchase.supplierName || 'Fornecedor não informado'}
        tone={tone}
      >
        <DetailsStatusBadge tone={tone} label={getPurchaseStatusLabel(purchase.status)} />
        <DetailsCopyId id={purchase.id} label="ID da compra" />
        {purchase.referenceCode && (
          <span className="font-mono text-xs text-muted-foreground" translate="no">
            {purchase.referenceCode}
          </span>
        )}
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile
          icon={DollarSign}
          label="Total da compra"
          hint={`${itemCount} ${itemCount === 1 ? 'insumo' : 'insumos'}`}
        >
          <span className="text-xl tabular-nums">{formatPurchaseMoney(purchase.totalPrice)}</span>
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Data do pedido" emptyLabel="Não informada">
          {purchase.orderDate ? formatNullableDatePtBR(purchase.orderDate) : null}
        </DetailsTile>
        <DetailsTile icon={CalendarClock} label="Entrega prevista" emptyLabel="Não informada">
          {purchase.expectedDeliveryDate
            ? formatNullableDatePtBR(purchase.expectedDeliveryDate)
            : null}
        </DetailsTile>
        <DetailsTile icon={CalendarCheck} label="Recebido em" emptyLabel="Não recebida">
          {purchase.receivedAt ? formatNullableDatePtBR(purchase.receivedAt, true) : null}
        </DetailsTile>
        <DetailsTile icon={FileText} label="NF / Documento">
          {purchase.invoiceNumber}
        </DetailsTile>
        <DetailsTile icon={User} label="Responsável">
          {purchase.responsibleName}
        </DetailsTile>
        <DetailsTile icon={Package} label="Frete">
          <span className="tabular-nums">{formatPurchaseMoney(purchase.freightCost)}</span>
        </DetailsTile>
        <DetailsTile icon={Hash} label="Outros custos">
          <span className="tabular-nums">{formatPurchaseMoney(purchase.otherCosts)}</span>
        </DetailsTile>
        <DetailsTile icon={Building2} label="Observações" span={2} emptyLabel="Sem observações">
          {purchase.notes?.trim() && <span className="font-normal">{purchase.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsSection title="Itens da compra" icon={ListOrdered}>
        <div className="overflow-hidden rounded-lg border">
          <DataTable
            data={purchase.items}
            columns={ITEM_COLUMNS}
            getRowId={(item) => item.id || `${item.supplyId}-${item.unit}`}
            emptyState={
              <div className="p-6 text-center text-sm text-muted-foreground">Nenhum item.</div>
            }
          />
        </div>
      </DetailsSection>

      <DetailsTimestamps createdAt={purchase.createdAt} updatedAt={purchase.updatedAt} />
    </DetailsDialogBody>
  );
}

export function PurchaseDetailsDialog({
  purchase,
  open,
  onOpenChange,
  onEdit,
  onReceive,
  isReceiving = false,
  onCancel,
  isCancelling = false,
  onOpenPaymentDialog,
}: PurchaseDetailsDialogProps) {
  const status = purchase?.status?.toLowerCase();
  const canReceive = !!purchase && status === 'confirmed' && !!onReceive;
  const canCancel = !!purchase && status !== 'received' && status !== 'cancelled' && !!onCancel;
  const canRegisterPayment =
    !!purchase &&
    purchase.paymentStatus !== 'paid' &&
    status !== 'cancelled' &&
    !!onOpenPaymentDialog;

  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Detalhes da compra"
      description="Pedido de compra, itens e situação."
    >
      {purchase ? <PurchaseDetailsBody purchase={purchase} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={purchase ? onEdit : undefined}
        editLabel="Editar compra"
      >
        {canCancel && (
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:text-destructive"
            disabled={isCancelling}
            onClick={() => onCancel?.(purchase.id)}
          >
            <XCircle className="size-4" aria-hidden="true" />
            {isCancelling ? 'Cancelando…' : 'Cancelar compra'}
          </Button>
        )}
        {canRegisterPayment && (
          <Button type="button" variant="outline" onClick={onOpenPaymentDialog}>
            <DollarSign className="size-4" aria-hidden="true" />
            Registrar pagamento
          </Button>
        )}
        {canReceive && (
          <Button
            type="button"
            variant="outline"
            disabled={isReceiving}
            onClick={() => onReceive?.(purchase.id)}
          >
            <CheckCircle className="size-4" aria-hidden="true" />
            {isReceiving ? 'Recebendo…' : 'Receber compra'}
          </Button>
        )}
      </DetailsDialogFooter>
    </DetailsDialog>
  );
}
