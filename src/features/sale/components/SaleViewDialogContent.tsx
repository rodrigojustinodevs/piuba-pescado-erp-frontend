'use client';

import {
  ShoppingCart,
  Scale,
  DollarSign,
  CalendarDays,
  Building2,
  Boxes,
  FileText,
  User,
} from 'lucide-react';
import type { Sale } from '../types';
import { formatCalendarDatePtBR, formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Separator } from '@/shared/components/ui/Separator';
import { getStatusBadgeClassNames } from '@/shared/utils/statusBadgeClassNames';
import { formatCurrency } from '@/shared/utils/numberFormat';
import { DetailItem } from '@/shared/components/ui/DetailItem';

type SaleViewDialogContentProps = {
  sale: Sale | null;
};

export function SaleViewDialogContent({ sale }: Readonly<SaleViewDialogContentProps>) {
  if (!sale) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <ShoppingCart className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{sale.clientName || '—'}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{sale.batchName || '—'}</span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClassNames(sale.status)}`}
            >
              {sale.statusLabel || sale.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(sale.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">valor da venda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Peso Total</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {sale.totalWeight.toLocaleString('pt-BR')}{' '}
              <span className="text-sm font-normal text-muted-foreground">kg</span>
            </div>
            <p className="text-xs text-muted-foreground">peso da despesca</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Preço / kg</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(sale.pricePerKg)}</div>
            <p className="text-xs text-muted-foreground">por quilograma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Data da Venda</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCalendarDatePtBR(sale.saleDate)}</div>
            <p className="text-xs text-muted-foreground">
              {sale.isTotalHarvest ? 'despesca total' : 'despesca parcial'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Detalhes da Venda</p>
        <div className="grid grid-cols-2 gap-2">
          <DetailItem
            icon={<User className="h-4 w-4" />}
            label="Cliente"
            value={sale.clientName || '—'}
          />
          <DetailItem
            icon={<Boxes className="h-4 w-4" />}
            label="Lote"
            value={sale.batchName || '—'}
          />
          <DetailItem
            icon={<Building2 className="h-4 w-4" />}
            label="Empresa"
            value={sale.companyName || '—'}
          />
          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Nota Fiscal"
            value={sale.needsInvoice ? 'Solicitada' : 'Não solicitada'}
          />
        </div>
        {sale.notes && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500 mb-1">Observações</p>
            <p className="text-sm text-slate-800">{sale.notes}</p>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>Criado em: {formatNullableDatePtBR(sale.createdAt, true)}</span>
        <span>Atualizado em: {formatNullableDatePtBR(sale.updatedAt, true)}</span>
      </div>
    </div>
  );
}
