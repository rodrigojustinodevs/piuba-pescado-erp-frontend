import { describe, expect, it } from 'vitest';
import { wasUpdatedAfterCreation } from './utils';
import {
  formatDateTimeShortPtBR,
  formatRelativeTimePtBR,
  normalizeServerTimestamp,
} from '@/shared/utils/dateFormat';

describe('wasUpdatedAfterCreation', () => {
  const created = '2026-11-01T10:00:00.000Z';

  it('é falso quando a diferença é menor que 1 s', () => {
    expect(wasUpdatedAfterCreation(created, '2026-11-01T10:00:00.400Z')).toBe(false);
    expect(wasUpdatedAfterCreation(created, created)).toBe(false);
  });

  it('é verdadeiro a partir de 1 s de diferença', () => {
    expect(wasUpdatedAfterCreation(created, '2026-11-01T10:00:01.000Z')).toBe(true);
  });

  it('é falso para datas ausentes ou inválidas', () => {
    expect(wasUpdatedAfterCreation(created, null)).toBe(false);
    expect(wasUpdatedAfterCreation(undefined, created)).toBe(false);
    expect(wasUpdatedAfterCreation('abc', created)).toBe(false);
  });
});

describe('formatRelativeTimePtBR', () => {
  const now = new Date('2026-11-25T12:00:00.000Z').getTime();

  it('formata dias no passado', () => {
    expect(formatRelativeTimePtBR('2026-11-06T12:00:00.000Z', now)).toBe('há 19 dias');
  });

  it('usa "ontem" para 1 dia', () => {
    expect(formatRelativeTimePtBR('2026-11-24T12:00:00.000Z', now)).toBe('ontem');
  });

  it('retorna "agora mesmo" abaixo de 1 minuto', () => {
    expect(formatRelativeTimePtBR('2026-11-25T11:59:30.000Z', now)).toBe('agora mesmo');
  });

  it('retorna "—" para data inválida', () => {
    expect(formatRelativeTimePtBR('abc', now)).toBe('—');
    expect(formatDateTimeShortPtBR('abc')).toBe('—');
  });
});

describe('normalizeServerTimestamp', () => {
  it('trata "YYYY-MM-DD HH:mm:ss" sem fuso como UTC', () => {
    expect(normalizeServerTimestamp('2026-11-25 23:09:43')).toBe('2026-11-25T23:09:43.000Z');
    expect(normalizeServerTimestamp('2026-11-25T23:09:43')).toBe('2026-11-25T23:09:43.000Z');
  });

  it('preserva valores que já indicam o fuso', () => {
    expect(normalizeServerTimestamp('2026-11-25T20:09:43-03:00')).toBe('2026-11-25T23:09:43.000Z');
    expect(normalizeServerTimestamp('2026-11-25T23:09:43.000Z')).toBe('2026-11-25T23:09:43.000Z');
  });

  it('retorna null para vazio ou inválido', () => {
    expect(normalizeServerTimestamp(null)).toBeNull();
    expect(normalizeServerTimestamp('  ')).toBeNull();
    expect(normalizeServerTimestamp('abc')).toBeNull();
  });
});
