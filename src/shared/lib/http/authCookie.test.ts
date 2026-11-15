import { afterEach, describe, expect, it, vi } from 'vitest';
import { inSeconds } from '@/test/jwt';
import { authCookieOptions, resolveCookieMaxAge } from './authCookie';

const SEVEN_DAYS = 60 * 60 * 24 * 7;

describe('resolveCookieMaxAge', () => {
  it('usa 7 dias quando não há exp', () => {
    expect(resolveCookieMaxAge(null)).toBe(SEVEN_DAYS);
    expect(resolveCookieMaxAge({})).toBe(SEVEN_DAYS);
  });

  it('nunca ultrapassa o exp do token', () => {
    const maxAge = resolveCookieMaxAge({ exp: inSeconds(3600) });
    expect(maxAge).toBeGreaterThan(3590);
    expect(maxAge).toBeLessThanOrEqual(3600);
  });

  it('limita a 7 dias e nunca é negativo', () => {
    expect(resolveCookieMaxAge({ exp: inSeconds(SEVEN_DAYS * 10) })).toBe(SEVEN_DAYS);
    expect(resolveCookieMaxAge({ exp: inSeconds(-100) })).toBe(0);
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
