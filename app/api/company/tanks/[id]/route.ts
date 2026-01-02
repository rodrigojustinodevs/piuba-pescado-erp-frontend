import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { UpdateTankData, Tank } from "@/features/tank";

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
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * GET /api/company/tanks/[id] - Busca um tanque por ID (proxy para backend)
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
    // GET por ID usa /api/company/tank (singular)
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/tank/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Tanque não encontrado" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiTankResponse = await apiResponse.json();
    
    // Retorna apenas o objeto tank do response
    return NextResponse.json(apiData.response);
  } catch (error) {
    console.error("Erro ao buscar tanque:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/company/tanks/[id] - Atualiza um tanque (proxy para backend)
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
    const data: Omit<UpdateTankData, "id"> = await req.json();

    // Faz requisição para a API real
    // PUT usa /api/company/tank (singular)
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/tank/${id}`, {
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
        { error: errorData.message || "Erro ao atualizar tanque" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiTankResponse = await apiResponse.json();
    
    // Retorna apenas o objeto tank do response
    return NextResponse.json(apiData.response);
  } catch (error) {
    console.error("Erro ao atualizar tanque:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/company/tanks/[id] - Remove um tanque (proxy para backend)
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
    // DELETE usa /api/company/tank (singular)
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/tank/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Erro ao deletar tanque" },
        { status: apiResponse.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar tanque:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}



