import { NextRequest, NextResponse } from 'next/server';
import type { UpdateTankData, Tank, ApiTank } from '@/features/tank';
import { mapApiTank } from '@/features/tank/utils/apiMapper';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { serverHttpClient } from '@/shared/lib/http';

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
  params: RouteParams['params'],
  actionLabel: string,
  handler: (id: string) => Promise<NextResponse>,
) {
  try {
    const { id } = await params;
    return await handler(id);
  } catch (error) {
    console.error(`Erro ao ${actionLabel} tanque:`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

/**
 * GET /api/company/tanks/[id] - Busca um tanque por ID (proxy para backend)
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  return withTankId(params, 'buscar', async (id) => {
    const result = await serverHttpClient.request<ApiTankResponse>(backendTankPath(id), {
      method: 'GET',
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return toTankResponse(result);
  });
}

/**
 * PUT /api/company/tanks/[id] - Atualiza um tanque (proxy para backend)
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return withTankId(params, 'atualizar', async (id) => {
    const data: Omit<UpdateTankData, 'id'> = await req.json();

    const result = await serverHttpClient.request<ApiTankResponse>(backendTankPath(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return toTankResponse(result);
  });
}

/**
 * DELETE /api/company/tanks/[id] - Remove um tanque (proxy para backend)
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  return withTankId(params, 'deletar', async (id) => {
    const result = await serverHttpClient.request(backendTankPath(id), {
      method: 'DELETE',
      expectJson: false,
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true }, { status: result.status });
  });
}
