'use client';

import {
  CalendarDays,
  DollarSign,
  Droplets,
  FileText,
  Fish,
  HeartPulse,
  Layers,
  Package,
  Scale,
  Truck,
  User,
  Users,
  Wallet,
  Weight,
} from 'lucide-react';
import type { Harvest, HarvestStatus } from '../types';
import { HARVEST_DESTINATION_LABELS, HARVEST_STATUS_LABELS, HARVEST_TYPE_LABELS } from '../types';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { cn } from '@/shared/lib/utils';
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
  type DetailTone,
} from '@/shared/components/detailsDialog';

type HarvestDetailsDialogProps = {
  readonly harvest: Harvest | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const HARVEST_STATUS_TONE: Record<HarvestStatus, DetailTone> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'danger',
};

const intFmt = new Intl.NumberFormat('pt-BR');
const decFmt = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const currencyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function computeMetrics(harvest: Harvest) {
  const classes = harvest.sizeClassifications;
  const biomassKg =
    classes.length > 0
      ? classes.reduce((acc, c) => acc + (c.quantity * c.averageWeight) / 1000, 0)
      : (harvest.harvestedQuantity * harvest.averageWeight) / 1000;
  const grossRevenue = classes.reduce(
    (acc, c) => acc + ((c.quantity * c.averageWeight) / 1000) * c.pricePerKg,
    0,
  );
  const netProfit = grossRevenue - (harvest.operationalCost ?? 0);
  const initial = harvest.initialPopulation ?? 0;
  const survivalRate =
    initial > 0 ? Math.min(100, (harvest.harvestedQuantity / initial) * 100) : null;
  return { biomassKg, grossRevenue, netProfit, survivalRate };
}

function SizeClassificationTable({ harvest }: Readonly<{ harvest: Harvest }>) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-medium">
              Classe
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Quantidade
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Peso médio (g)
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              R$/kg
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Biomassa (kg)
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Receita
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {harvest.sizeClassifications.map((c, i) => {
            const biomass = (c.quantity * c.averageWeight) / 1000;
            return (
              <tr key={c.class || i} className="border-t">
                <th scope="row" className="px-3 py-2 text-left font-semibold">
                  {c.class}
                </th>
                <td className="px-3 py-2 text-right">{intFmt.format(c.quantity)}</td>
                <td className="px-3 py-2 text-right">{decFmt.format(c.averageWeight)}</td>
                <td className="px-3 py-2 text-right">{currencyFmt.format(c.pricePerKg)}</td>
                <td className="px-3 py-2 text-right">{decFmt.format(biomass)}</td>
                <td className="px-3 py-2 text-right font-medium">
                  {currencyFmt.format(biomass * c.pricePerKg)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function HarvestDetailsBody({ harvest }: Readonly<{ harvest: Harvest }>) {
  const tone = harvest.status ? HARVEST_STATUS_TONE[harvest.status] : 'neutral';
  const { biomassKg, grossRevenue, netProfit, survivalRate } = computeMetrics(harvest);
  const batchName = harvest.batchName ?? harvest.batch?.name;
  const date = formatNullableDatePtBR(harvest.harvestDate);

  return (
    <DetailsDialogBody>
      <DetailsHero
        icon={Fish}
        title={batchName ? `Despesca · ${batchName}` : 'Despesca'}
        tone={tone}
      >
        {harvest.status && (
          <DetailsStatusBadge tone={tone} label={HARVEST_STATUS_LABELS[harvest.status]} />
        )}
        <DetailsCopyId id={harvest.id} label="ID da despesca" />
        <span className="text-xs text-muted-foreground">
          {[harvest.type && HARVEST_TYPE_LABELS[harvest.type], date].filter(Boolean).join(' · ')}
        </span>
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Weight} label="Biomassa">
          <span className="text-xl tabular-nums">{decFmt.format(biomassKg)} kg</span>
        </DetailsTile>
        <DetailsTile icon={DollarSign} label="Receita bruta">
          <span className="text-xl tabular-nums">{currencyFmt.format(grossRevenue)}</span>
        </DetailsTile>
        <DetailsTile icon={Wallet} label="Lucro líquido" hint="receita bruta − custo operacional">
          <span
            className={cn(
              'text-xl tabular-nums',
              netProfit >= 0
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-rose-700 dark:text-rose-400',
            )}
          >
            {currencyFmt.format(netProfit)}
          </span>
        </DetailsTile>
        <DetailsTile icon={HeartPulse} label="Sobrevivência" emptyLabel="Sem população inicial">
          {survivalRate === null ? null : (
            <span className="text-xl tabular-nums">{decFmt.format(survivalRate)}%</span>
          )}
        </DetailsTile>
        <DetailsTile icon={Users} label="População inicial">
          {harvest.initialPopulation == null ? null : (
            <span className="tabular-nums">{intFmt.format(harvest.initialPopulation)}</span>
          )}
        </DetailsTile>
        <DetailsTile icon={Package} label="Quantidade despescada">
          <span className="tabular-nums">{intFmt.format(harvest.harvestedQuantity)}</span>
        </DetailsTile>
        <DetailsTile icon={Scale} label="Peso médio">
          <span className="tabular-nums">{decFmt.format(harvest.averageWeight)} g</span>
        </DetailsTile>
        <DetailsTile icon={DollarSign} label="Custo operacional">
          <span className="tabular-nums">{currencyFmt.format(harvest.operationalCost ?? 0)}</span>
        </DetailsTile>
        <DetailsTile icon={Layers} label="Lote">
          {batchName}
        </DetailsTile>
        <DetailsTile icon={Droplets} label="Viveiro">
          {harvest.tankName}
        </DetailsTile>
        <DetailsTile icon={Truck} label="Destino">
          {harvest.destination ? HARVEST_DESTINATION_LABELS[harvest.destination] : null}
        </DetailsTile>
        <DetailsTile icon={User} label="Cliente / destinatário">
          {harvest.clientDestination}
        </DetailsTile>
        <DetailsTile icon={User} label="Responsável">
          {harvest.responsible}
        </DetailsTile>
        <DetailsTile icon={CalendarDays} label="Data da despesca" emptyLabel="Não informada">
          {harvest.harvestDate ? date : null}
        </DetailsTile>
        <DetailsTile icon={FileText} label="Observações" span={2} emptyLabel="Sem observações">
          {harvest.notes?.trim() && <span className="font-normal">{harvest.notes}</span>}
        </DetailsTile>
      </DetailsGrid>

      {harvest.sizeClassifications.length > 0 && (
        <DetailsSection title="Classificação por tamanho" icon={Layers}>
          <SizeClassificationTable harvest={harvest} />
        </DetailsSection>
      )}

      <DetailsTimestamps createdAt={harvest.createdAt} updatedAt={harvest.updatedAt} />
    </DetailsDialogBody>
  );
}

export function HarvestDetailsDialog({
  harvest,
  open,
  onOpenChange,
  onEdit,
}: HarvestDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Detalhes da despesca"
      description="Resultado da despesca, métricas e classificação."
    >
      {harvest ? <HarvestDetailsBody harvest={harvest} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={harvest ? onEdit : undefined}
        editLabel="Editar despesca"
      />
    </DetailsDialog>
  );
}
