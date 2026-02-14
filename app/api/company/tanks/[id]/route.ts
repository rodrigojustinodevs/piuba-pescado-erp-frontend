import { NextRequest, NextResponse } from "next/server";
import type { UpdateTankData, Tank, ApiTank } from "@/features/tank";
import { mapApiTank } from "@/features/tank/utils/apiMapper";
import { backendRequest, HttpResponses } from "../../../_utils/backendProxy";

/**
 * Formato de resposta da API para operações individuais
 */
interface ApiTankResponse {
  status: boolean;
  response: ApiTank;
  message: string;
}

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/company/tanks/[id] - Busca um tanque por ID (proxy para backend)
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await backendRequest<ApiTankResponse>(`/api/company/tank/${id}`, {
      method: "GET",
      withAuth: true,
      errorFallback: "Tanque não encontrado",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    const tank: Tank = mapApiTank(result.data.response);
    return NextResponse.json(tank, { status: result.status });
  } catch (error) {
    console.error("Erro ao buscar tanque:", error);
    return HttpResponses.serverError();
  }
}

/**
 * PUT /api/company/tanks/[id] - Atualiza um tanque (proxy para backend)
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data: Omit<UpdateTankData, "id"> = await req.json();

    const result = await backendRequest<ApiTankResponse>(`/api/company/tank/${id}`, {
      method: "PUT",
      withAuth: true,
      body: JSON.stringify(data),
      errorFallback: "Erro ao atualizar tanque",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    const tank: Tank = mapApiTank(result.data.response);
    return NextResponse.json(tank, { status: result.status });
  } catch (error) {
    console.error("Erro ao atualizar tanque:", error);
    return HttpResponses.serverError();
  }
}

/**
 * DELETE /api/company/tanks/[id] - Remove um tanque (proxy para backend)
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await backendRequest(`/api/company/tank/${id}`, {
      method: "DELETE",
      withAuth: true,
      expectJson: false,
      errorFallback: "Erro ao deletar tanque",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    return NextResponse.json({ success: true }, { status: result.status });
  } catch (error) {
    console.error("Erro ao deletar tanque:", error);
    return HttpResponses.serverError();
  }
}



