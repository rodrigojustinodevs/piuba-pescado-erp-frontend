import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { CreateBatchData, Batch } from "@/features/batch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * POST /api/company/batche - Cria um novo lote (proxy para backend)
 * Usa /api/company/batche (singular) para criação.
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

    const data: CreateBatchData = await req.json();

    // Faz requisição para a API real
    // POST usa /api/company/batche (singular)
    const apiResponse = await fetch(`${API_BASE_URL}/api/company/batche`, {
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
        { error: (errorData as { message?: string }).message || "Erro ao criar lote" },
        { status: apiResponse.status }
      );
    }

    const batch: Batch = await apiResponse.json();
    return NextResponse.json(batch, { status: apiResponse.status });
  } catch (error) {
    console.error("Erro ao criar lote:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}
