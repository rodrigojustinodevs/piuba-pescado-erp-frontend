import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { extractRoleFromJWT } from '@/shared/utils/jwtExtractors';

const AUTH_COOKIE = 'auth_token';
const PROTECTED_PREFIXES = ['/dashboard', '/company', '/admin', '/alerts'];
const ADMIN_PREFIX = '/admin';
const MASTER_ROLES = new Set(['master', 'master_admin']);

type JwtPayload = Record<string, unknown>;

// O middleware roda no Edge runtime: sem Buffer, apenas atob.
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

function redirectToLogin(request: NextRequest, clearCookie: boolean) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  if (clearCookie) response.cookies.delete(AUTH_COOKIE);
  return response;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const payload = token ? decodePayload(token) : null;
  const hasValidSession = !!payload && !isExpired(payload);

  if (isProtectedRoute) {
    if (!token) return redirectToLogin(request, false);
    // Token malformado ou expirado: limpa o cookie para evitar loop com /login.
    if (!payload || !hasValidSession) return redirectToLogin(request, true);

    // /admin é exclusivo de usuários master (mesma regra do menu).
    const isAdminRoute = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
    if (isAdminRoute && !isMasterUser(payload)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // /login com sessão válida vai direto ao dashboard; com cookie inválido, limpa e segue.
  if (pathname.startsWith('/login') && token) {
    if (hasValidSession) return NextResponse.redirect(new URL('/dashboard', request.url));
    const response = NextResponse.next();
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/company/:path*', '/admin/:path*', '/alerts', '/login'],
};
