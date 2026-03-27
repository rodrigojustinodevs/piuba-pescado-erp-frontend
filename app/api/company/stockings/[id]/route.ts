import { NextRequest, NextResponse } from 'next/server';
import type { Stocking, UpdateStockingData, ApiStockingResponse } from '@/features/stocking';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
import { serverHttpClient } from '@/shared/lib/http';
import { mapApiStocking } from '@/features/stocking/utils/apiMapper';

// Tipagem rigorosa para as rotas do App Router
type RouteContext = { params: Promise<{ id: string }> };

const ENDPOINTS = {
  details: (id: string) => `/api/company/stocking/${id}`,
};

/**
 * Utilitário de transformação: API Backend -> Resposta Frontend
 */
function createStockingResponse(apiData: ApiStockingResponse): NextResponse {
  const mappedStocking: Stocking = mapApiStocking(apiData);
  return NextResponse.json(mappedStocking, { status: 200 });
}

/**
 * Runner genérico para reduzir boilerplate de Try/Catch e resolução de Params
 */
async function stockingRouteRunner(
  context: RouteContext,
  action: string,
  handler: (id: string) => Promise<NextResponse>,
): Promise<NextResponse> {
  const { id } = await context.params;

  try {
    return await handler(id);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(`[STOCKING_ROUTE_ERROR] Erro ao ${action} (ID: ${id}):`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

// --- Route Handlers ---

export const GET = withAuthGuard(async (_auth, _req: NextRequest, context: RouteContext) => {
  return stockingRouteRunner(context, 'buscar', async (id) => {
    const data = await serverHttpClient.request<ApiStockingResponse>(ENDPOINTS.details(id), {
      method: 'GET',
    });
    return createStockingResponse(data);
  });
});

export const PUT = withAuthGuard(async (_auth, req: NextRequest, context: RouteContext) => {
  return stockingRouteRunner(context, 'atualizar', async (id) => {
    const body = (await req.json().catch(() => null)) as UpdateStockingData | null;

    if (!body) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const data = await serverHttpClient.request<ApiStockingResponse>(ENDPOINTS.details(id), {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return createStockingResponse(data);
  });
});

/**
 * DELETE /api/company/stockings/[id] - Remove um povoamento (proxy para backend)
 */
export const DELETE = withAuthGuard(async (_auth, _req: NextRequest, context: RouteContext) => {
  return stockingRouteRunner(context, 'deletar', async (id) => {
    await serverHttpClient.request(ENDPOINTS.details(id), {
      method: 'DELETE',
      expectJson: false,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  });
});
