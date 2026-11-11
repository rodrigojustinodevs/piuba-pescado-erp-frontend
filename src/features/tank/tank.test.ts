import { describe, expect, it } from 'vitest';
import { createTankSchema } from './schemas';
import { mapApiTankList } from './utils/apiMapper';

describe('createTankSchema', () => {
  const valid = {
    companyId: 'c1',
    tankTypeId: 't1',
    name: 'Viveiro 1',
    capacityLiters: 1000,
    status: 'active' as const,
  };

  it('aceita dados válidos', () => {
    expect(createTankSchema.safeParse(valid).success).toBe(true);
  });

  it('rejeita nome curto e capacidade não positiva', () => {
    const r = createTankSchema.safeParse({ ...valid, name: 'ab', capacityLiters: 0 });
    expect(r.success).toBe(false);
    const messages = r.success ? [] : r.error.issues.map((i) => i.message);
    expect(messages).toContain('Nome deve ter no mínimo 3 caracteres');
    expect(messages).toContain('Capacidade deve ser maior que zero');
  });
});

describe('mapApiTankList', () => {
  it('mapeia a lista e a paginação', () => {
    const result = mapApiTankList({
      response: [{ id: '1', name: 'V1', capacityLiters: 10, status: 'active' }],
      pagination: { total: 40, current_page: 2, per_page: 20 },
    } as never);
    expect(result).toMatchObject({ total: 40, page: 2, limit: 20 });
    expect(result.tanks[0]).toMatchObject({ id: '1', name: 'V1' });
  });

  it('aplica padrões quando a API não envia paginação', () => {
    expect(mapApiTankList({} as never)).toEqual({ tanks: [], total: 0, page: 1, limit: 10 });
  });
});
