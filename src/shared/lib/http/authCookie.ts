export const AUTH_COOKIE_NAME = 'auth_token';

const MAX_SESSION_SECONDS = 60 * 60 * 24 * 7;

type JwtPayload = Record<string, unknown> | null;

/** Duração do cookie: no máximo 7 dias e nunca além do `exp` do JWT. */
export function resolveCookieMaxAge(payload: JwtPayload): number {
  const exp = Number(payload?.exp);
  if (!Number.isFinite(exp)) return MAX_SESSION_SECONDS;
  const remaining = Math.floor(exp - Date.now() / 1000);
  return Math.max(0, Math.min(MAX_SESSION_SECONDS, remaining));
}

export function authCookieOptions(maxAge: number) {
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
