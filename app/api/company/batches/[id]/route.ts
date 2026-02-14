import { NextRequest, NextResponse } from "next/server";
import type { Batch, UpdateBatchData, ApiBatchResponse } from "@/features/batch";
import { mapApiBatch } from "@/features/batch/utils/apiMapper";
import { backendRequest, HttpResponses } from "../../../_utils/backendProxy";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/company/batches/[id] - Busca um lote por ID (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await backendRequest<ApiBatchResponse>(`/api/company/batche/${id}`, {
      method: "GET",
      withAuth: true,
      errorFallback: "Lote não encontrado",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    const batch: Batch = mapApiBatch(result.data);
    return NextResponse.json(batch, { status: result.status });
  } catch (error) {
    console.error("Erro ao buscar lote:", error);
    return HttpResponses.serverError();
  }
}

/**
 * PUT /api/company/batches/[id] - Atualiza um lote (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data: Omit<UpdateBatchData, "id"> = await req.json();

    const result = await backendRequest<ApiBatchResponse>(`/api/company/batche/${id}`, {
      method: "PUT",
      withAuth: true,
      body: JSON.stringify(data),
      errorFallback: "Erro ao atualizar lote",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    const batch: Batch = mapApiBatch(result.data);
    return NextResponse.json(batch, { status: result.status });
  } catch (error) {
    console.error("Erro ao atualizar lote:", error);
    return HttpResponses.serverError();
  }
}

/**
 * DELETE /api/company/batches/[id] - Remove um lote (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await backendRequest(`/api/company/batche/${id}`, {
      method: "DELETE",
      withAuth: true,
      expectJson: false,
      errorFallback: "Erro ao deletar lote",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    return NextResponse.json({ success: true }, { status: result.status });
  } catch (error) {
    console.error("Erro ao deletar lote:", error);
    return HttpResponses.serverError();
  }
}

