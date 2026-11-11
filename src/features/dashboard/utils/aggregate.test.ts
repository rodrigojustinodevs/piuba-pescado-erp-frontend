import { describe, expect, it } from 'vitest';
import {
  countBatchesByStatus,
  dailyTemperature,
  feedByBatch,
  filterByWindow,
  latestReadings,
  parseApiDate,
  summarizeReadings,
  toNumber,
} from './aggregate';

const now = new Date('2026-11-10T15:00:00');
type Reading = Parameters<typeof summarizeReadings>[0][number];
const reading = (id: string, measuredAt: string, temperature: string, dissolvedOxygen = '6') =>
  ({
    id,
    measuredAt,
    temperature,
    dissolvedOxygen,
    quality: 'good',
    tank: { id: '1', name: 'T1' },
  }) as unknown as Reading;

describe('toNumber / parseApiDate', () => {
  it('converte vírgula decimal e rejeita inválidos', () => {
    expect(toNumber('27,5')).toBe(27.5);
    expect(toNumber('abc')).toBeNull();
    expect(toNumber('')).toBeNull();
    expect(toNumber(null)).toBeNull();
  });

  it('aceita data-only, "YYYY-MM-DD HH:mm:ss" e ISO', () => {
    expect(parseApiDate('2026-11-10')).toBeInstanceOf(Date);
    expect(parseApiDate('2026-11-10 08:00:00')).toBeInstanceOf(Date);
    expect(parseApiDate('nada')).toBeNull();
    expect(parseApiDate(undefined)).toBeNull();
  });
});

describe('janela, resumo e série', () => {
  const readings = [
    reading('1', '2026-11-10 08:00:00', '27,5', '6.8'),
    reading('2', '2026-11-10T09:00:00', '28.5', '7.0'),
    reading('3', '2026-11-08T10:00:00', '26', '6'),
    reading('4', '2026-10-01T10:00:00', '99', '99'),
    reading('5', '', 'abc', ''),
  ];

  it('filtra pela janela de 7 dias e ignora datas inválidas', () => {
    const ids = filterByWindow(readings, (r) => r.measuredAt, now).map((r) => r.id);
    expect(ids).toEqual(['1', '2', '3']);
  });

  it('calcula médias ignorando valores inválidos', () => {
    const s = summarizeReadings(readings.slice(0, 3));
    expect(s.avgTemperature).toBeCloseTo(27.33, 1);
    expect(s.avgOxygen).toBeCloseTo(6.6, 1);
    expect(s.readings).toBe(3);
  });

  it('retorna nulos e série vazia sem dados', () => {
    expect(summarizeReadings([])).toEqual({ avgTemperature: null, avgOxygen: null, readings: 0 });
    expect(dailyTemperature([], now)).toEqual([]);
  });

  it('agrupa por dia e omite dias sem leitura', () => {
    const series = dailyTemperature(readings.slice(0, 3), now);
    expect(series).toHaveLength(2);
    expect(series.map((p) => p.temp)).toEqual([26, 28]);
  });
});

describe('ração, lotes e leituras recentes', () => {
  it('soma ração por lote e ordena por quantidade', () => {
    const feedings = [
      { batch: { name: 'L1' }, quantityProvided: 10 },
      { batch: { name: 'L1' }, quantityProvided: 5 },
      { batch: { name: 'L2' }, quantityProvided: 20 },
    ] as never;
    expect(feedByBatch(feedings)).toEqual([
      { batch: 'L2', quantity: 20 },
      { batch: 'L1', quantity: 15 },
    ]);
  });

  it('conta lotes por status', () => {
    expect(
      countBatchesByStatus([
        { status: 'active' },
        { status: 'active' },
        { status: 'finished' },
      ] as never),
    ).toEqual([
      { status: 'active', count: 2 },
      { status: 'finished', count: 1 },
    ]);
  });

  it('ordena leituras da mais recente para a mais antiga', () => {
    const list = [
      reading('a', '2026-11-01T10:00:00', '1'),
      reading('b', '2026-11-09T10:00:00', '1'),
    ];
    expect(latestReadings(list, 1).map((r) => r.id)).toEqual(['b']);
  });
});
