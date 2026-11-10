import type { Batch } from '@/features/batch/types';
import type { Feeding } from '@/features/feeding/types';
import type { Quality, WaterQuality } from '@/features/waterQuality/types';

export const DASHBOARD_WINDOW_DAYS = 7;

export function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T00:00:00` : trimmed.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfWindow(now: Date, days: number): Date {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return start;
}

export function filterByWindow<T>(
  items: T[],
  getDate: (item: T) => string | null | undefined,
  now: Date,
  days = DASHBOARD_WINDOW_DAYS,
): T[] {
  const start = startOfWindow(now, days).getTime();
  return items.filter((item) => {
    const date = parseApiDate(getDate(item));
    return !!date && date.getTime() >= start && date.getTime() <= now.getTime() + 86_400_000;
  });
}

function average(values: number[]): number | null {
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null;
}

export type ReadingsSummary = {
  avgTemperature: number | null;
  avgOxygen: number | null;
  readings: number;
};

export function summarizeReadings(readings: WaterQuality[]): ReadingsSummary {
  const temps = readings.map((r) => toNumber(r.temperature)).filter((v): v is number => v !== null);
  const oxygen = readings
    .map((r) => toNumber(r.dissolvedOxygen))
    .filter((v): v is number => v !== null);
  return { avgTemperature: average(temps), avgOxygen: average(oxygen), readings: readings.length };
}

export type DailyTemperature = { day: string; temp: number };

const WEEKDAY = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit' });

/** Média diária de temperatura; dias sem leitura ficam de fora (linha não inventa dados). */
export function dailyTemperature(
  readings: WaterQuality[],
  now: Date,
  days = DASHBOARD_WINDOW_DAYS,
): DailyTemperature[] {
  const buckets = new Map<string, number[]>();
  for (const reading of readings) {
    const date = parseApiDate(reading.measuredAt);
    const temp = toNumber(reading.temperature);
    if (!date || temp === null) continue;
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    buckets.set(key, [...(buckets.get(key) ?? []), temp]);
  }

  const series: DailyTemperature[] = [];
  const cursor = startOfWindow(now, days);
  for (let i = 0; i < days; i += 1) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    const avg = average(buckets.get(key) ?? []);
    if (avg !== null) {
      series.push({ day: WEEKDAY.format(cursor).replace('.', ''), temp: Number(avg.toFixed(1)) });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

export type FeedByBatch = { batch: string; quantity: number };

export function feedByBatch(feedings: Feeding[], limit = 6): FeedByBatch[] {
  const totals = new Map<string, number>();
  for (const feeding of feedings) {
    const name = feeding.batch?.name || 'Sem lote';
    totals.set(name, (totals.get(name) ?? 0) + (toNumber(feeding.quantityProvided) ?? 0));
  }
  return [...totals.entries()]
    .map(([batch, quantity]) => ({ batch, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export type BatchStatusCount = { status: Batch['status']; count: number };

export function countBatchesByStatus(batches: Batch[]): BatchStatusCount[] {
  const counts = new Map<Batch['status'], number>();
  for (const batch of batches) counts.set(batch.status, (counts.get(batch.status) ?? 0) + 1);
  return [...counts.entries()].map(([status, count]) => ({ status, count }));
}

export function latestReadings(readings: WaterQuality[], limit = 5): WaterQuality[] {
  return [...readings]
    .sort(
      (a, b) =>
        (parseApiDate(b.measuredAt)?.getTime() ?? 0) - (parseApiDate(a.measuredAt)?.getTime() ?? 0),
    )
    .slice(0, limit);
}

export const QUALITY_LABEL: Record<Quality, string> = {
  excellent: 'Excelente',
  good: 'Boa',
  warning: 'Atenção',
  critical: 'Crítica',
  unknown: 'Sem classificação',
};

export const BATCH_STATUS_LABEL: Record<Batch['status'], string> = {
  active: 'Ativo',
  finished: 'Finalizado',
};
