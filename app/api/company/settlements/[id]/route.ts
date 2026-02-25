import { NextRequest, NextResponse } from 'next/server';
import type {
  Settlement,
  UpdateSettlementData,
  ApiSettlementResponse,
} from '@/features/settlement';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { serverHttpClient } from '@/shared/lib/http';
import { mapApiSettlement } from '@/features/settlement/utils/apiMapper';

// Tipagem rigorosa para as rotas do App Router
type RouteContext = { params: Promise<{ id: string }> };

const ENDPOINTS = {
  details: (id: string) => `/api/company/settlement/${id}`,
};

/**
 * Utilitário de transformação: API Backend -> Resposta Frontend
 */
function createSettlementResponse(apiData: ApiSettlementResponse, status: number): NextResponse {
  const mappedSettlement: Settlement = mapApiSettlement(apiData);
  return NextResponse.json(mappedSettlement, { status });
}

/**
 * Runner genérico para reduzir boilerplate de Try/Catch e resolução de Params
 */
async function settlementRouteRunner(
  context: RouteContext,
  action: string,
  handler: (id: string) => Promise<NextResponse>,
): Promise<NextResponse> {
  const { id } = await context.params;

  try {
    return await handler(id);
  } catch (error) {
    console.error(`[SETTLEMENT_ROUTE_ERROR] Erro ao ${action} (ID: ${id}):`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

// --- Route Handlers ---

export async function GET(_req: NextRequest, context: RouteContext) {
  return settlementRouteRunner(context, 'buscar', async (id) => {
    const result = await serverHttpClient.request<ApiSettlementResponse>(ENDPOINTS.details(id), {
      method: 'GET',
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return createSettlementResponse(result.data, result.status);
  });
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return settlementRouteRunner(context, 'atualizar', async (id) => {
    const body = (await req.json().catch(() => null)) as UpdateSettlementData | null;

    if (!body) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const result = await serverHttpClient.request<ApiSettlementResponse>(ENDPOINTS.details(id), {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return createSettlementResponse(result.data, result.status);
  });
}
