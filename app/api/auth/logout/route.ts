import { NextResponse } from "next/server";

/**
 * Endpoint para logout
 * Remove o cookie de autenticação
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Remove o cookie de autenticação
  res.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0, // Expira imediatamente
  });

  return res;
}




