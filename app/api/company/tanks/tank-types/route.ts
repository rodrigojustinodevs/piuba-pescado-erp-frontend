import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { ApiTankTypeListResponse } from "@/features/tank";

/**
 * URL da API backend
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * GET /api/company/tanks/tank-types - Lista tipos de tanque (proxy para backend)
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Faz requisição para a API real
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/tank-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Erro ao listar tipos de tanque" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiTankTypeListResponse = await apiResponse.json();
    
    // Retorna o formato da API
    return NextResponse.json(apiData);
  } catch (error) {
    console.error("Erro ao listar tipos de tanque:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

