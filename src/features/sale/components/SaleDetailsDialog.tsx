'use client';

import {
  Boxes,
  Building2,
  CalendarDays,
  DollarSign,
  FileText,
  Receipt,
  Scale,
  ShoppingCart,
  StickyNote,
  User,
} from 'lucide-react';
import type { Sale } from '../types';
import { formatCalendarDatePtBR } from '@/shared/utils/dateFormat';
import { formatCurrency } from '@/shared/utils/numberFormat';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsStatusBadge,
  DetailsTile,
  DetailsTimestamps,
  getStatusTone,
} from '@/shared/components/detailsDialog';

type SaleDetailsDialogProps = {
  readonly sale: Sale | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const weightFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function SaleDetailsBody({ sale }: Readonly<{ sale: Sale }>) {
  const tone = getStatusTone(sale.status);

  return (
    <DetailsDialogBody>
      <DetailsHero
        icon={ShoppingCart}
        title={sale.clientName || 'Cliente não informado'}
        tone={tone}
      >
        <DetailsStatusBadge tone={tone} label={sale.statusLabel || sale.status} />
        <DetailsCopyId id={sale.id} label="ID da venda" />
        <span className="text-xs text-muted-foreground">
          {sale.isTotalHarvest ? 'Despesca total' : 'Despesca parcial'}
        </span>
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={DollarSign} label="Receita total">
          <span className="text-xl tabular-nums">{formatCurrency(sale.totalRevenue)}</span>
        </DetailsTile>
        <DetailsTile icon={Scale} label="Peso total">
          <span className="text-xl tabular-nums">{weightFmt.format(sale.totalWeight)} kg</span>
        </DetailsTile>
        <DetailsTile icon={Receipt} label="Preço por kg">
          <span className="tabular-nums">{formatCurrency(sale.pricePerKg)}</span>
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Data da venda" emptyLabel="Não informada">
          {sale.saleDate ? formatCalendarDatePtBR(sale.saleDate) : null}
        </DetailsTile>
        <DetailsTile icon={User} label="Cliente">
          {sale.clientName}
        </DetailsTile>
        <DetailsTile icon={Boxes} label="Lote">
          {sale.batchName}
        </DetailsTile>
        <DetailsTile icon={Building2} label="Empresa" emptyLabel="Não informada">
          {sale.companyName}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Nota fiscal">
          {sale.needsInvoice ? 'Solicitada' : 'Não solicitada'}
        </DetailsTile>
        <DetailsTile icon={StickyNote} label="Observações" span={2} emptyLabel="Sem observações">
          {sale.notes?.trim() && <span className="font-normal">{sale.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      <DetailsTimestamps createdAt={sale.createdAt} updatedAt={sale.updatedAt} />
    </DetailsDialogBody>
  );
}

export function SaleDetailsDialog({ sale, open, onOpenChange, onEdit }: SaleDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da venda"
      description="Informações da venda e da despesca."
    >
      {sale ? <SaleDetailsBody sale={sale} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={sale ? onEdit : undefined}
        editLabel="Editar venda"
      />
    </DetailsDialog>
  );
}
