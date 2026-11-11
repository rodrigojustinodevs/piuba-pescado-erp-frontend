import { describe, expect, it } from 'vitest';
import { normalizeAuthUser } from './authUser.mapper';

describe('normalizeAuthUser', () => {
  it('prioriza os dados da API sobre o token', () => {
    const user = normalizeAuthUser(
      { id: '1', email: 'api@x.com', name: 'Api', role: 'manager', companyId: 'c-api' },
      { sub: '2', email: 'jwt@x.com', roles: ['operator'], company_id: 'c-jwt' },
    );
    expect(user).toEqual({
      id: '1',
      email: 'api@x.com',
      name: 'Api',
      role: 'manager',
      companyId: 'c-api',
    });
  });

  it('usa o token quando a API não responde', () => {
    const user = normalizeAuthUser(
      {},
      { sub: '2', email: 'jwt@x.com', roles: ['operator'], company_id: 'c-jwt' },
    );
    expect(user).toMatchObject({
      id: '2',
      email: 'jwt@x.com',
      role: 'operator',
      companyId: 'c-jwt',
    });
  });

  it('aceita o usuário aninhado em `user` e campos ausentes viram null', () => {
    expect(normalizeAuthUser({ user: { id: '9', role: 'manager' } }, null)).toEqual({
      id: '9',
      email: null,
      name: null,
      role: 'manager',
      companyId: null,
    });
  });
});
