import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { UpdateCompanyData, Company } from "@/features/company";

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
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * GET /api/companies/[id] - Busca uma empresa por ID (proxy para backend)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Faz requisição para a API real
    const apiResponse = await fetch(`${API_BASE_URL}/api/admin/company/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Empresa não encontrada" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiCompanyResponse = await apiResponse.json();
    
    // Retorna apenas o objeto company do response
    return NextResponse.json(apiData.response);
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/companies/[id] - Atualiza uma empresa (proxy para backend)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data: Omit<UpdateCompanyData, "id"> = await req.json();

    // Faz requisição para a API real
    const apiResponse = await fetch(`${API_BASE_URL}/api/admin/company/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Erro ao atualizar empresa" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiCompanyResponse = await apiResponse.json();
    
    // Retorna apenas o objeto company do response
    return NextResponse.json(apiData.response);
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/companies/[id] - Remove uma empresa (proxy para backend)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Faz requisição para a API real
    const apiResponse = await fetch(`${API_BASE_URL}/api/admin/company/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Erro ao deletar empresa" },
        { status: apiResponse.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

