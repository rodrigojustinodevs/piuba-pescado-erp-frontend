import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Batch, ApiBatchResponse } from "@/features/batch";
import { mapApiBatch } from "@/features/batch/utils/apiMapper";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * GET /api/company/batche/[id] - Busca um lote por ID (proxy para backend)
 * Usa /api/company/batche (singular) para operações individuais.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    // GET por ID usa /api/company/batche (singular)
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/batche/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: (errorData as { message?: string }).message || "Lote não encontrado" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiBatchResponse = await apiResponse.json();
    const batch: Batch = mapApiBatch(apiData);
    return NextResponse.json(batch);
  } catch (error) {
    console.error("Erro ao buscar lote:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/company/batche/[id] - Atualiza um lote (proxy para backend)
 * Usa /api/company/batche (singular) para operações individuais.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    const data = await req.json();

    // Faz requisição para a API real
    // PUT usa /api/company/batche (singular)
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/batche/${id}`, {
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
        { error: (errorData as { message?: string }).message || "Erro ao atualizar lote" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiBatchResponse = await apiResponse.json();
    const batch: Batch = mapApiBatch(apiData);
    return NextResponse.json(batch);
  } catch (error) {
    console.error("Erro ao atualizar lote:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/company/batche/[id] - Remove um lote (proxy para backend)
 * Usa /api/company/batche (singular) para operações individuais.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    // DELETE usa /api/company/batche (singular)
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/batche/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: (errorData as { message?: string }).message || "Erro ao deletar lote" },
        { status: apiResponse.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar lote:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}
