// Não use a pasta 'app' aqui, o middleware.ts deve estar na raiz.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isPublicRoute = pathname.startsWith("/login");

  // 1. Usuário não tem token e tenta acessar área restrita
  if (isProtectedRoute && !token) {
    // Redireciona para a página de login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Usuário logado e tenta acessar a página de login/home
  if (isPublicRoute && token) {
    // Redireciona para o dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Permite o acesso
  return NextResponse.next();
}

// 4. Define quais rotas o middleware deve rodar
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
