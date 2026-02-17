import { NextRequest, NextResponse } from 'next/server';
import type {
  ApiSettlementListResponse,
  SettlementListResponse,
  Settlement,
  CreateSettlementData,
} from '@/features/settlement';
import { mapApiSettlementList } from '@/features/settlement/utils/apiMapper';
import { backendRequest, HttpResponses } from '../../_utils/backendProxy';

export async function GET(req: NextRequest) {
  try {
    const queryParams = extractPaginationParams(req.nextUrl.searchParams);

    const result = await backendRequest<ApiSettlementListResponse>(
      `/api/company/settlements?${queryParams.toString()}`,
      {
        method: 'GET',
        withAuth: true,
        errorFallback: 'Falha na comunicação com o serviço de povoamentos',
      },
    );

    if (!result.ok) {
      return HttpResponses.fromApiError(result.error, result.status);
    }

    const response: SettlementListResponse = mapApiSettlementList(result.data);

    return NextResponse.json(response, { status: result.status });
  } catch (error) {
    return handleServerError(error);
  }
}

function extractPaginationParams(searchParams: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams();

  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('per_page') ?? '25';

  params.set('page', page);
  params.set('per_page', perPage);

  return params;
}

export async function POST(req: NextRequest) {
  try {
    const data: CreateSettlementData = await req.json();

    const result = await backendRequest<Settlement>(`/api/company/settlement`, {
      method: 'POST',
      withAuth: true,
      body: JSON.stringify(data),
      errorFallback: 'Erro ao criar povoamento',
    });

    if (!result.ok) {
      return HttpResponses.fromApiError(result.error, result.status);
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    return handleServerError(error);
  }
}

function handleServerError(error: unknown) {
  console.error('[Settlements API Proxy Error]:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  });

  return HttpResponses.serverError();
}
