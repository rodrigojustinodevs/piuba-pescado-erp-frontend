import { describe, expect, it } from 'vitest';
import { fakeJwt } from '@/test/jwt';
import { decodeJWT } from './jwt';
import {
  extractCompanyIdFromJWT,
  extractEmailFromJWT,
  extractRoleFromJWT,
  extractUserIdFromJWT,
} from './jwtExtractors';

describe('decodeJWT', () => {
  it('decodifica o payload, inclusive com acentos', () => {
    expect(decodeJWT(fakeJwt({ name: 'José', sub: '1' }))).toEqual({ name: 'José', sub: '1' });
  });

  it('retorna null para token malformado', () => {
    expect(decodeJWT('abc')).toBeNull();
    expect(decodeJWT('a.!!!.c')).toBeNull();
  });
});

describe('jwtExtractors', () => {
  it('normaliza papéis master', () => {
    expect(extractRoleFromJWT({ roles: ['master_admin'] })).toBe('master');
    expect(extractRoleFromJWT({ is_master_admin: true })).toBe('master');
  });

  it('remove o sufixo _admin dos demais papéis', () => {
    expect(extractRoleFromJWT({ roles: ['company_admin'] })).toBe('company');
    expect(extractRoleFromJWT({ roles: ['operator'] })).toBe('operator');
  });

  it('usa claims alternativas e tolera payload nulo', () => {
    expect(extractRoleFromJWT({ user_type: 'manager' })).toBe('manager');
    expect(extractRoleFromJWT(null)).toBeNull();
    expect(extractUserIdFromJWT({ sub: '9' })).toBe('9');
    expect(extractCompanyIdFromJWT({ company_id: 'c1' })).toBe('c1');
    expect(extractEmailFromJWT({})).toBeNull();
  });
});
