/** Rotas acessíveis sem sessão. Não devem disparar redirecionamento por 401. */
export const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password'] as const;

export function isPublicRoute(pathname: string | null | undefined): boolean {
  return !!pathname && PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}
