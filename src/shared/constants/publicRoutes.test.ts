import { describe, expect, it } from 'vitest';
import { isPublicRoute } from './publicRoutes';

describe('isPublicRoute', () => {
  it('reconhece rotas públicas', () => {
    for (const p of ['/login', '/forgot-password', '/reset-password'])
      expect(isPublicRoute(p)).toBe(true);
  });
  it('não confunde prefixos parecidos nem rotas privadas', () => {
    for (const p of ['/loginx', '/dashboard', '/company/tanks', '', null, undefined])
      expect(isPublicRoute(p)).toBe(false);
  });
});
