export const AUTH_COOKIE_NAME = 'auth_token';

const MAX_SESSION_SECONDS = 60 * 60 * 24 * 7;

/** `jwt.refresh_ttl` da API (20160 min = 14 dias): até lá um token vencido ainda pode ser renovado. */
const REFRESH_WINDOW_SECONDS = Number(process.env.JWT_REFRESH_TTL_MINUTES ?? 20160) * 60;

type JwtPayload = Record<string, unknown> | null;

/**
 * Duração do cookie. Ele precisa sobreviver ao `exp` do JWT para que o BFF consiga
 * renovar a sessão; o limite é a janela de refresh (contada do `iat`), com teto de 7 dias.
 */
export function resolveCookieMaxAge(payload: JwtPayload): number {
  const iat = Number(payload?.iat);
  if (!Number.isFinite(iat)) return MAX_SESSION_SECONDS;
  const remaining = Math.floor(iat + REFRESH_WINDOW_SECONDS - Date.now() / 1000);
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
