import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type {
  TankListResponse,
  ApiTankListResponse,
  ApiTank,
  CreateTankData,
  Tank,
} from "@/features/tank";

/**
 * Formato de resposta da API para operações individuais
 */
interface ApiTankResponse {
  status: boolean;
  response: ApiTank;
  message: string;
}

/**
 * URL da API backend
 * Pode ser configurada via variável de ambiente NEXT_PUBLIC_API_URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * GET /api/company/tanks - Lista tanques com paginação (proxy para backend)
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
    // GET usa /api/company/tanks (plural) apenas para listar
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

    const apiData: ApiTankListResponse = await apiResponse.json();
    console.log(apiData);
    // Transforma o formato da API (camelCase com objetos aninhados) para o formato esperado pelo frontend
    const tanks: Tank[] = (apiData.response || []).map((apiTank: ApiTank) => ({
      id: apiTank.id,
      companyId: apiTank.company.id ?? "",
      tankTypeId: apiTank.tankType.id,
      name: apiTank.name,
      capacityLiters: apiTank.capacityLiters,
      location: apiTank.location,
      status: apiTank.status,
      created_at: apiTank.created_at,
      updated_at: apiTank.updated_at,
    }));

    const response: TankListResponse = {
      tanks,
      total: apiData.pagination?.total || 0,
      page: apiData.pagination?.current_page || 1,
      limit: apiData.pagination?.per_page || 10,
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
 * POST /api/company/tanks - Cria um novo tanque (proxy para backend)
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
    // POST usa /api/company/tank (singular)
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
    
    // Transforma o formato da API (camelCase com objetos aninhados) para o formato esperado pelo frontend
    const apiTank = apiData.response;
    const tank: Tank = {
      id: apiTank.id,
      companyId: apiTank.company.id || "",
      tankTypeId: apiTank.tankType.id,
      name: apiTank.name,
      capacityLiters: apiTank.capacityLiters,
      location: apiTank.location,
      status: apiTank.status,
      created_at: apiTank.created_at,
      updated_at: apiTank.updated_at,
    };
    
    return NextResponse.json(tank, { status: apiResponse.status });
  } catch (error) {
    console.error("Erro ao criar tanque:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}



