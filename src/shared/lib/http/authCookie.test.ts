import { afterEach, describe, expect, it, vi } from 'vitest';
import { inSeconds } from '@/test/jwt';
import { authCookieOptions, resolveCookieMaxAge } from './authCookie';

const SEVEN_DAYS = 60 * 60 * 24 * 7;

const FOURTEEN_DAYS = 60 * 60 * 24 * 14;

describe('resolveCookieMaxAge', () => {
  it('usa 7 dias quando não há iat', () => {
    expect(resolveCookieMaxAge(null)).toBe(SEVEN_DAYS);
    expect(resolveCookieMaxAge({})).toBe(SEVEN_DAYS);
  });

  it('sobrevive ao exp do token para permitir o refresh', () => {
    const maxAge = resolveCookieMaxAge({ iat: inSeconds(0), exp: inSeconds(3600) });
    expect(maxAge).toBe(SEVEN_DAYS);
  });

  it('não passa da janela de refresh contada do iat e nunca é negativo', () => {
    const maxAge = resolveCookieMaxAge({ iat: inSeconds(-(FOURTEEN_DAYS - 3600)) });
    expect(maxAge).toBeGreaterThan(3590);
    expect(maxAge).toBeLessThanOrEqual(3600);
    expect(resolveCookieMaxAge({ iat: inSeconds(-FOURTEEN_DAYS - 100) })).toBe(0);
  });
});

describe('authCookieOptions', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('é httpOnly e Secure apenas em produção', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(authCookieOptions(10)).toMatchObject({ httpOnly: true, secure: true, sameSite: 'lax' });
    vi.stubEnv('NODE_ENV', 'development');
    expect(authCookieOptions(10).secure).toBe(false);
  });
});
