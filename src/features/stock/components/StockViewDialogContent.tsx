'use client';

import {
  Warehouse,
  MapPin,
  User,
  Package,
  Boxes,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  FileText,
  Calendar,
} from 'lucide-react';
import type { StockLocation } from '../types';
import { STOCK_LOCATION_STATUS_LABELS } from '../types';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Separator } from '@/shared/components/ui/Separator';

type StockViewDialogContentProps = {
  stock: StockLocation | null;
};

function DetailItem({
  icon,
  label,
  value,
}: Readonly<{
  icon: React.ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export function StockViewDialogContent({ stock }: Readonly<StockViewDialogContentProps>) {
  if (!stock) return null;

  const isActive = stock.status === 'active';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Warehouse className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">{stock.code}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {STOCK_LOCATION_STATUS_LABELS[stock.status]}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{stock.name}</h3>
          <p className="text-sm text-slate-500">{stock.typeLabel}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Itens Armazenados</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stock.currentQuantity.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">itens distintos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Capacidade</CardTitle>
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stock.capacity == null ? '—' : stock.capacity.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">capacidade total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Tipo</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stock.typeLabel}</div>
            <p className="text-xs text-muted-foreground">categoria do local</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Detalhes do Local</p>
        <div className="grid grid-cols-2 gap-2">
          <DetailItem icon={<MapPin className="h-4 w-4" />} label="Localização" value={stock.location} />
          <DetailItem
            icon={<User className="h-4 w-4" />}
            label="Responsável"
            value={stock.responsible || '—'}
          />
          {stock.notes ? (
            <div className="col-span-2">
              <DetailItem
                icon={<FileText className="h-4 w-4" />}
                label="Observações"
                value={stock.notes}
              />
            </div>
          ) : null}
          <DetailItem
            icon={<Calendar className="h-4 w-4" />}
            label="Criado em"
            value={formatNullableDatePtBR(stock.createdAt, true)}
          />
          <DetailItem
            icon={<Calendar className="h-4 w-4" />}
            label="Atualizado em"
            value={formatNullableDatePtBR(stock.updatedAt, true)}
          />
        </div>
      </div>
    </div>
  );
}
