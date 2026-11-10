'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/Table';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { formatNumber } from '@/shared/utils/numberFormat';
import { useDashboardData } from '../hooks/useDashboardData';
import { BATCH_STATUS_LABEL, DASHBOARD_WINDOW_DAYS, QUALITY_LABEL } from '../utils/aggregate';

const TemperatureChart = dynamic(() => import('./TemperatureChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[320px] w-full" />,
});

const cardClass = 'rounded-xl border border-border bg-card shadow-none';

const qualityDot: Record<string, string> = {
  excellent: 'bg-primary',
  good: 'bg-primary/60',
  warning: 'bg-chart-4',
  critical: 'bg-destructive',
  unknown: 'bg-muted-foreground/40',
};

const batchTone: Record<string, string> = {
  active: 'bg-primary',
  finished: 'bg-foreground/35',
};

function EmptyHint({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}

function formatMetric(value: number | null, unit: string, digits = 1): string {
  return value === null ? '—' : `${formatNumber(value, { maximumFractionDigits: digits })}\u00A0${unit}`;
}

export function DashboardView() {
  const { data, isLoading, isError, refetch } = useDashboardData();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1600px] space-y-6" aria-busy="true">
        <p role="status" className="sr-only">
          Carregando dashboard…
        </p>
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-[380px]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="mx-auto max-w-md space-y-3 py-16 text-center">
        <h1 className="text-xl font-medium">Não foi possível carregar o dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Verifique sua conexão e tente novamente.
        </p>
        <Button onClick={() => void refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Viveiros',
      value: String(data.tankTotal),
      note: `${data.activeTanks} ativos`,
    },
    {
      title: 'Lotes ativos',
      value: String(data.activeBatches),
      note: `${data.batchTotal} no total`,
    },
    {
      title: 'Temperatura média',
      value: formatMetric(data.readings.avgTemperature, '°C'),
      note: `${data.readings.readings} leituras em ${DASHBOARD_WINDOW_DAYS} dias`,
    },
    {
      title: 'Oxigênio dissolvido',
      value: formatMetric(data.readings.avgOxygen, 'mg/L'),
      note: `${data.readings.readings} leituras em ${DASHBOARD_WINDOW_DAYS} dias`,
    },
  ];

  const temperatureSummary = `Gráfico de linha da temperatura média diária da água: ${data.temperatureSeries
    .map((point) => `${point.day}, ${formatNumber(point.temp, { maximumFractionDigits: 1 })}\u00A0°C`)
    .join('; ')}.`;
  const feedMax = data.feedByBatch[0]?.quantity || 1;
  const batchSampleTotal = data.batchStatus.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-balance">Visão geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Viveiros, lotes e qualidade da água nos últimos {DASHBOARD_WINDOW_DAYS} dias
        </p>
      </div>

      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((card) => (
          <Card key={card.title} className={cardClass}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="mt-2 text-3xl font-medium tabular-nums">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className={`${cardClass} lg:col-span-2`}>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-medium tracking-normal">Temperatura da água</CardTitle>
            <CardDescription>Média diária em °C, a partir das leituras registradas</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            {data.temperatureSeries.length > 0 ? (
              <div role="img" aria-label={temperatureSummary}>
                <TemperatureChart data={data.temperatureSeries} />
              </div>
            ) : (
              <EmptyHint>Nenhuma leitura de temperatura nos últimos {DASHBOARD_WINDOW_DAYS} dias.</EmptyHint>
            )}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-medium tracking-normal">Ração fornecida</CardTitle>
            <CardDescription>Por lote, nos últimos {DASHBOARD_WINDOW_DAYS} dias</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            {data.feedByBatch.length > 0 ? (
              <ul className="space-y-4">
                {data.feedByBatch.map((item, i) => (
                  <li key={item.batch}>
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="min-w-0 truncate text-muted-foreground">{item.batch}</span>
                      <span className="tabular-nums">{formatNumber(item.quantity)}</span>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-muted" aria-hidden="true">
                      <div
                        className={`h-1 rounded-full ${i === 0 ? 'bg-primary' : 'bg-foreground/25'}`}
                        style={{ width: `${(item.quantity / feedMax) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyHint>Nenhum arraçoamento no período.</EmptyHint>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className={cardClass}>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-medium tracking-normal">Status dos lotes</CardTitle>
            <CardDescription>{batchSampleTotal} lotes considerados</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            {batchSampleTotal > 0 ? (
              <>
                <div className="flex h-2 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
                  {data.batchStatus.map((b) => (
                    <div
                      key={b.status}
                      className={batchTone[b.status] ?? 'bg-foreground/15'}
                      style={{ width: `${(b.count / batchSampleTotal) * 100}%` }}
                    />
                  ))}
                </div>
                <ul className="mt-5 space-y-3">
                  {data.batchStatus.map((b) => (
                    <li key={b.status} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${batchTone[b.status] ?? 'bg-foreground/15'}`}
                        />
                        {BATCH_STATUS_LABEL[b.status] ?? b.status}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{b.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <EmptyHint>Nenhum lote cadastrado.</EmptyHint>
            )}
          </CardContent>
        </Card>

        <Card className={`${cardClass} lg:col-span-2`}>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="font-medium tracking-normal">Últimas leituras de qualidade</CardTitle>
            <CardDescription>Registros mais recentes de qualidade da água</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            {data.latestReadings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Viveiro</TableHead>
                    <TableHead>Qualidade</TableHead>
                    <TableHead>Temperatura</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.latestReadings.map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell className="font-medium">{reading.tank?.name ?? '—'}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`h-2 w-2 rounded-full ${qualityDot[reading.quality] ?? qualityDot.unknown}`}
                          />
                          {QUALITY_LABEL[reading.quality] ?? QUALITY_LABEL.unknown}
                        </span>
                      </TableCell>
                      <TableCell className="tabular-nums">{reading.temperature}\u00A0°C</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {formatNullableDatePtBR(reading.measuredAt, true)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyHint>Nenhuma leitura registrada.</EmptyHint>
            )}
          </CardContent>
        </Card>
      </div>

      {data.truncated && (
        <p className="text-xs text-muted-foreground">
          Indicadores calculados sobre os registros mais recentes de cada módulo.
        </p>
      )}
    </div>
  );
}
