import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractRoleFromJWT } from '@/shared/utils/jwtExtractors';
import { authCookieOptions, resolveCookieMaxAge } from '@/shared/lib/http/authCookie';
import { refreshSessionToken } from '@/shared/lib/http/sessionRefresh';

const AUTH_COOKIE = 'auth_token';
const PROTECTED_PREFIXES = ['/dashboard', '/company', '/admin', '/alerts'];
const ADMIN_PREFIX = '/admin';
const MASTER_ROLES = new Set(['master', 'master_admin']);

type JwtPayload = Record<string, unknown>;

// Next 16: o "proxy" substitui o middleware. Mantemos atob (sem Buffer) para o decode do JWT.
function decodePayload(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const base64 = part.replaceAll('-', '+').replaceAll('_', '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (c) => c.codePointAt(0) ?? 0);
    return JSON.parse(new TextDecoder().decode(bytes)) as JwtPayload;
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload): boolean {
  const exp = Number(payload.exp);
  return Number.isFinite(exp) && exp * 1000 <= Date.now();
}

function isMasterUser(payload: JwtPayload): boolean {
  const role = extractRoleFromJWT(payload);
  return !!role && MASTER_ROLES.has(role.replaceAll('-', '_'));
}

function redirectToLogin(request: NextRequest, clearCookie: boolean, sessionEnded = false) {
  const url = new URL('/login', request.url);
  if (sessionEnded) url.searchParams.set('reason', 'session_ended');
  const response = NextResponse.redirect(url);
  if (clearCookie) response.cookies.delete(AUTH_COOKIE);
  return response;
}

/**
 * Token vencido numa navegação: tenta renovar no servidor antes de mandar ao login.
 * O cookie novo vai na resposta e no request (para os Server Components já lerem o token novo).
 */
async function continueWithRefresh(
  request: NextRequest,
  token: string,
  onRefreshed: (payload: JwtPayload) => NextResponse,
) {
  const result = await refreshSessionToken(token);
  if (typeof result !== 'object') {
    // API recusou: sessão encerrada. API fora do ar: mesmo destino, sem apagar o cookie.
    return redirectToLogin(request, result === 'rejected', true);
  }
  const payload = decodePayload(result.token);
  if (!payload) return redirectToLogin(request, true, true);

  request.cookies.set(AUTH_COOKIE, result.token);
  const response = onRefreshed(payload);
  response.cookies.set({
    ...authCookieOptions(resolveCookieMaxAge(payload)),
    value: result.token,
  });
  return response;
}

function nextWithRequestCookies(request: NextRequest) {
  return NextResponse.next({ request: { headers: request.headers } });
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const payload = token ? decodePayload(token) : null;
  const hasValidSession = !!payload && !isExpired(payload);

  if (isProtectedRoute) {
    if (!token) return redirectToLogin(request, false);
    // Token malformado: limpa o cookie para evitar loop com /login.
    if (!payload) return redirectToLogin(request, true);

    const authorize = (current: JwtPayload, fallback: () => NextResponse) => {
      // /admin é exclusivo de usuários master (mesma regra do menu).
      const isAdminRoute = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
      if (isAdminRoute && !isMasterUser(current)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return fallback();
    };

    if (!hasValidSession) {
      return continueWithRefresh(request, token, (fresh) =>
        authorize(fresh, () => nextWithRequestCookies(request)),
      );
    }
    return authorize(payload, () => NextResponse.next());
  }

  // /login com sessão válida (ou renovável) vai direto ao dashboard.
  if (pathname.startsWith('/login') && token) {
    if (hasValidSession) return NextResponse.redirect(new URL('/dashboard', request.url));
    if (payload) {
      const result = await refreshSessionToken(token);
      if (typeof result === 'object') {
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        response.cookies.set({
          ...authCookieOptions(resolveCookieMaxAge(decodePayload(result.token))),
          value: result.token,
        });
        return response;
      }
    }
    const response = NextResponse.next();
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/company/:path*', '/admin/:path*', '/alerts', '/login'],
};
