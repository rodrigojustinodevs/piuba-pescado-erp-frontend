import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * URL da API backend
 * Pode ser configurada via variável de ambiente NEXT_PUBLIC_API_URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * Endpoint de login - faz proxy para a API real
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Faz requisição para a API real
    const apiResponse = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiResponse.json();

    // Verifica se o login foi bem-sucedido
    if (data.status === true && data.response?.token) {
      const token = data.response.token;

      const res = NextResponse.json({
        ok: true,
        message: data.message || "Login realizado com sucesso",
        token,
      });

      // Armazena o token JWT no cookie httpOnly
      res.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        // secure: true, // habilitar em produção HTTPS
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      return res;
    }

    // Login falhou
    return NextResponse.json(
      {
        ok: false,
        message: data.message || "Credenciais inválidas",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Erro ao conectar com o servidor. Tente novamente.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // endpoint /api/auth (GET) -> retorna user baseado no cookie
  // Em produção decodifique/valide token JWT
  // Aqui usamos um token base64 simples para demo
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  return NextResponse.json({ isAuthenticated: true }, { status: 200 });
}
