import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { BatchListResponse, ApiBatchListResponse } from "@/features/batch";
import { mapApiBatchList } from "@/features/batch/utils/apiMapper";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * GET /api/company/batches - Lista lotes da empresa (proxy para backend)
 * Usa /api/company/batches (plural) apenas para listagem.
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
    const page = searchParams.get("page") ?? "";
    const limit = searchParams.get("limit") ?? "";
    const search = searchParams.get("search") ?? "";

    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);
    if (search) params.set("search", search);

    const query = params.toString();
    const url = `${API_BASE_URL}/api/company/batches${query ? `?${query}` : ""}`;

    const apiResponse = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: (errorData as { message?: string }).message || "Erro ao listar lotes" },
        { status: apiResponse.status }
      );
    }

    const apiData: ApiBatchListResponse = await apiResponse.json();
    const response: BatchListResponse = mapApiBatchList(apiData);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao listar lotes:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 500 }
    );
  }
}
