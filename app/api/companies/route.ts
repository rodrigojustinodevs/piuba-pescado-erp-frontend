import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type {
  CompanyListResponse,
  ApiCompanyListResponse,
  CreateCompanyData,
  Company,
} from "@/features/company";

/**
 * Formato de resposta da API para operações individuais
 */
interface ApiCompanyResponse {
  status: boolean;
  response: Company;
  message: string;
}

/**
 * URL da API backend
 * Pode ser configurada via variável de ambiente NEXT_PUBLIC_API_URL
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

function mapCompanyPayload(data: Partial<CreateCompanyData>) {
  const payload: Record<string, unknown> = {};

  if (data.name !== undefined) payload.name = data.name;
  if (data.cnpj !== undefined) payload.cnpj = data.cnpj;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.active !== undefined) payload.active = data.active;

  if (data.address) {
    if (data.address.street !== undefined) {
      payload.addressStreet = data.address.street;
    }
    if (data.address.number !== undefined) {
      payload.addressNumber = data.address.number;
    }
    if (data.address.complement !== undefined) {
      payload.addressComplement = data.address.complement;
    }
    if (data.address.neighborhood !== undefined) {
      payload.addressNeighborhood = data.address.neighborhood;
    }
    if (data.address.city !== undefined) {
      payload.addressCity = data.address.city;
    }
    if (data.address.state !== undefined) {
      payload.addressState = data.address.state;
    }
    if (data.address.zipCode !== undefined) {
      payload.addressZipCode = data.address.zipCode;
    }
  }

  return payload;
}

/**
 * GET /api/companies - Lista empresas com paginação (proxy para backend)
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
    // GET usa /api/admin/companies (plural)
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    });

    const apiResponse = await fetch(`${API_BASE_URL}/api/admin/companies?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Erro ao listar empresas" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiCompanyListResponse = await apiResponse.json();

    // Transforma o formato da API para o formato esperado pelo frontend
    const response: CompanyListResponse = {
      companies: apiData.response || [],
      total: apiData.pagination?.total || 0,
      page: apiData.pagination?.current_page || 1,
      limit: apiData.pagination?.per_page || 10,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao listar empresas:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/companies - Cria uma nova empresa (proxy para backend)
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

    const data: CreateCompanyData = await req.json();
    const payload = mapCompanyPayload(data);

    // Faz requisição para a API real
    // POST usa /api/admin/company (singular)
    const apiResponse = await fetch(`${API_BASE_URL}/api/admin/company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Erro ao criar empresa" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiCompanyResponse = await apiResponse.json();
    
    // Retorna apenas o objeto company do response
    return NextResponse.json(apiData.response, { status: apiResponse.status });
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

