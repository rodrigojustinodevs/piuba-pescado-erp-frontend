import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type {
  TankListResponse,
  CreateTankData,
  Tank,
} from "@/features/tank";
import { log } from "console";

/**
 * Formato de resposta da API para operações individuais
 */
interface ApiTankResponse {
  status: boolean;
  response: Tank;
  message: string;
}

/**
 * URL da API backend
 * Pode ser configurada via variável de ambiente NEXT_PUBLIC_API_URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * GET /api/tanks - Lista tanques com paginação (proxy para backend)
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

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";

    // Faz requisição para a API real
    // TODO: Ajustar o endpoint conforme a API real do backend
    // Assumindo /api/admin/tanks (plural) para GET
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    });

    const apiResponse = await fetch(`${API_BASE_URL}/api/company/tanks?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Erro ao listar tanques" },
        { status: apiResponse.status }
      );
    }

    const apiData: TankListResponse = await apiResponse.json();

    // Transforma o formato da API para o formato esperado pelo frontend
    const response: TankListResponse = {
      tanks: apiData.tanks || [],
      total: apiData.total || 0,
      page: apiData.page || 1,
      limit: apiData.limit || 10,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao listar tanques:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tanks - Cria um novo tanque (proxy para backend)
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const data: CreateTankData = await req.json();

    // Faz requisição para a API real
    // TODO: Ajustar o endpoint conforme a API real do backend
    // Assumindo /api/admin/tank (singular) para POST
    console.log(`${API_BASE_URL}/api/company/tank`, data);
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/tank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Erro ao criar tanque" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiTankResponse = await apiResponse.json();
    
    // Retorna apenas o objeto tank do response
    return NextResponse.json(apiData.response, { status: apiResponse.status });
  } catch (error) {
    console.error("Erro ao criar tanque:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}


