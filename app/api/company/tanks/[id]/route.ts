import { NextRequest, NextResponse } from 'next/server';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import type { UpdateTankData, Tank, ApiTank } from '@/features/tank';
import { mapApiTank } from '@/features/tank/utils/apiMapper';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
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

function toTankResponse(data: ApiTankResponse) {
  const tank: Tank = mapApiTank(data.response);
  return NextResponse.json(tank, { status: 200 });
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
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(`Erro ao ${actionLabel} tanque:`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

/**
 * GET /api/company/tanks/[id] - Busca um tanque por ID (proxy para backend)
 */
export const GET = withAuthGuard(async (_auth, _req: NextRequest, { params }: RouteParams) => {
  return withTankId(params, 'buscar', async (id) => {
    const data = await serverHttpClient.request<ApiTankResponse>(backendTankPath(id), {
      method: 'GET',
    });
    return toTankResponse(data);
  });
});

/**
 * PUT /api/company/tanks/[id] - Atualiza um tanque (proxy para backend)
 */
export const PUT = withAuthGuard(async (_auth, req: NextRequest, { params }: RouteParams) => {
  return withTankId(params, 'atualizar', async (id) => {
    const data: Omit<UpdateTankData, 'id'> = await req.json();

    const responseData = await serverHttpClient.request<ApiTankResponse>(backendTankPath(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return toTankResponse(responseData);
  });
});

/**
 * DELETE /api/company/tanks/[id] - Remove um tanque (proxy para backend)
 */
export const DELETE = withAuthGuard(async (_auth, _req: NextRequest, { params }: RouteParams) => {
  return withTankId(params, 'deletar', async (id) => {
    await serverHttpClient.request(backendTankPath(id), {
      method: 'DELETE',
      expectJson: false,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  });
});
