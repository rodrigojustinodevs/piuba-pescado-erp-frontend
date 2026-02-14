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

const backendTankPath = (id: string) => `/api/company/tank/${id}`;

function toTankResponse(result: { data: ApiTankResponse; status: number }) {
  const tank: Tank = mapApiTank(result.data.response);
  return NextResponse.json(tank, { status: result.status });
}

async function withTankId(
  params: RouteParams["params"],
  actionLabel: string,
  handler: (id: string) => Promise<NextResponse>
) {
  try {
    const { id } = await params;
    return await handler(id);
  } catch (error) {
    console.error(`Erro ao ${actionLabel} tanque:`, error);
    return HttpResponses.serverError();
  }
}

/**
 * GET /api/company/tanks/[id] - Busca um tanque por ID (proxy para backend)
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  return withTankId(params, "buscar", async (id) => {
    const result = await backendRequest<ApiTankResponse>(backendTankPath(id), {
      method: "GET",
      withAuth: true,
      errorFallback: "Tanque não encontrado",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);
    return toTankResponse(result);
  });
}

/**
 * PUT /api/company/tanks/[id] - Atualiza um tanque (proxy para backend)
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return withTankId(params, "atualizar", async (id) => {
    const data: Omit<UpdateTankData, "id"> = await req.json();

    const result = await backendRequest<ApiTankResponse>(backendTankPath(id), {
      method: "PUT",
      withAuth: true,
      body: JSON.stringify(data),
      errorFallback: "Erro ao atualizar tanque",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);
    return toTankResponse(result);
  });
}

/**
 * DELETE /api/company/tanks/[id] - Remove um tanque (proxy para backend)
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  return withTankId(params, "deletar", async (id) => {
    const result = await backendRequest(backendTankPath(id), {
      method: "DELETE",
      withAuth: true,
      expectJson: false,
      errorFallback: "Erro ao deletar tanque",
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);
    return NextResponse.json({ success: true }, { status: result.status });
  });
}



