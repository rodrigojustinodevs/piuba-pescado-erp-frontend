import { describe, expect, it } from 'vitest';
import { createBatchSchema } from './schemas';
import { mapApiBatchList } from './utils/apiMapper';

describe('createBatchSchema', () => {
  const valid = {
    name: 'L1',
    description: 'Lote',
    tankId: 't1',
    entryDate: '2026-11-01',
    initialQuantity: 100,
    species: 'Tilápia',
    cultivation: 'daycare',
  };

  it('aceita dados válidos', () => {
    expect(createBatchSchema.safeParse(valid).success).toBe(true);
  });

  it('exige quantidade inicial maior que zero e campos obrigatórios', () => {
    const r = createBatchSchema.safeParse({ ...valid, initialQuantity: 0, name: '' });
    const messages = r.success ? [] : r.error.issues.map((i) => i.message);
    expect(messages).toContain('Quantidade inicial deve ser maior que zero');
    expect(messages).toContain('Nome do lote é obrigatório');
  });
});

describe('mapApiBatchList', () => {
  it('mapeia lista e paginação, com padrões', () => {
    expect(
      mapApiBatchList({
        response: [{ id: '1' }],
        pagination: { total: 3, current_page: 1, per_page: 10 },
      } as never),
    ).toMatchObject({ total: 3, page: 1, limit: 10 });
    expect(mapApiBatchList({} as never)).toEqual({ batches: [], total: 0, page: 1, limit: 25 });
  });
});
