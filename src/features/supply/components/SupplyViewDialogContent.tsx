'use client';

import {
  BarChart2,
  DollarSign,
  Tag,
  TrendingUp,
  Barcode,
  Grid2x2,
  Truck,
  Ruler,
  Boxes,
  Building2,
  Package,
  Calendar,
} from 'lucide-react';
import { STATUS_LABELS, SupplyStatus, type Supply } from '../types';
import { getSupplyDefaultUnitLabel } from '../utils/defaultUnitLabel';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/ui/Card';
import { useMemo } from 'react';
import { Separator } from '@/src/shared/components/ui/Separator';
import { Badge } from '@/src/shared/components/ui/Badge';

type SupplyViewDialogContentProps = {
  supply: Supply | null;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function StatCard({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-slate-400">{icon}</span>
      </div>
      {children}
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
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

const STATUS_STYLES: Record<SupplyStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  inactive: 'bg-muted text-muted-foreground border-border',
  low_stock: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
};

export function SupplyViewDialogContent({ supply }: Readonly<SupplyViewDialogContentProps>) {
  const margin = useMemo(() => {
    if (!supply || !supply.isProduct || supply.salePrice <= 0 || supply.unitCost <= 0) return 0;
    return ((supply.salePrice - supply.unitCost) / supply.salePrice) * 100;
  }, [supply]);

  if (!supply) return null;

  const unitLabel = getSupplyDefaultUnitLabel(supply.defaultUnit);
  const unitShort = supply.defaultUnit === 'unit' ? 'un' : supply.defaultUnit;
  const stockValue = supply.unitCost * supply.currentStock;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Package className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{supply.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              {supply.sku ?? supply.categoryLabel ?? '—'}
            </span>
            <Badge variant="outline" className={STATUS_STYLES[supply.status]}>
              {STATUS_LABELS[supply.status]}
            </Badge>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Estoque Atual</CardTitle>
              <Boxes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {supply.currentStock.toLocaleString('pt-BR')}{' '}
                <span className="text-sm font-normal text-muted-foreground">{unitShort}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                mín. {supply.minStock.toLocaleString('pt-BR')} {unitShort}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Custo Unitário</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{formatCurrency(supply.unitCost)}</div>
              <p className="text-xs text-muted-foreground">por {unitShort}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">
                {supply.isProduct ? 'Preço Venda' : 'Preço Venda'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {supply.isProduct && supply.salePrice > 0 ? formatCurrency(supply.salePrice) : '—'}
              </div>
              <p className="text-xs text-muted-foreground">
                {supply.isProduct ? 'produto comercializado' : 'não vendável'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Valor em Estoque</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{formatCurrency(stockValue)}</div>
              <p className="text-xs text-muted-foreground">a custo de aquisição</p>
            </CardContent>
          </Card>
        </div>

        {/* Margem bruta (apenas produtos) */}
        {supply.isProduct && (
          <Card
            className={
              margin >= 30
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : margin >= 15
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-destructive/30 bg-destructive/5'
            }
          >
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={
                    margin >= 30
                      ? 'h-5 w-5 text-emerald-600'
                      : margin >= 15
                        ? 'h-5 w-5 text-amber-600'
                        : 'h-5 w-5 text-destructive'
                  }
                />
                <span className="text-sm font-medium">Margem Bruta Estimada</span>
              </div>
              <span
                className={
                  margin >= 30
                    ? 'text-lg font-bold text-emerald-600'
                    : margin >= 15
                      ? 'text-lg font-bold text-amber-600'
                      : 'text-lg font-bold text-destructive'
                }
              >
                {margin.toFixed(1)}%
              </span>
            </CardContent>
          </Card>
        )}
        <Separator />
        {/* Detalhes do item */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Detalhes do Item</p>
          <div className="grid grid-cols-2 gap-2">
            <DetailItem
              icon={<Barcode className="h-4 w-4" />}
              label="SKU"
              value={supply.sku ?? '—'}
            />
            <DetailItem
              icon={<Grid2x2 className="h-4 w-4" />}
              label="Categoria"
              value={supply.categoryLabel ?? supply.category ?? '—'}
            />
            <DetailItem
              icon={<Building2 className="h-4 w-4" />}
              label="Fornecedor"
              value={supply.supplierName ?? '—'}
            />
            <DetailItem
              icon={<Boxes className="h-4 w-4" />}
              label="Unidade de Medida"
              value={unitLabel}
            />
          </div>
        </div>
      </div>
      <Separator />

      {/* Timestamps */}
      {/* Footer timestamps */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 ">
        <span>Criado em: {formatNullableDatePtBR(supply.createdAt, true)}</span>
        <span>Atualizado em: {formatNullableDatePtBR(supply.updatedAt, true)}</span>
      </div>
    </div>
  );
}
