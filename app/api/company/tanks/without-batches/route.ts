import { NextRequest, NextResponse } from 'next/server';
import type { ApiTankListResponse, TankListResponse } from '@/features/tank';
import { mapApiTankList } from '@/features/tank/utils/apiMapper';
import { backendRequest, HttpResponses } from '../../../_utils/backendProxy';

/**
 * GET /api/company/tanks/without-batches - Lista tanques sem lotes (proxy para backend)
 */
export async function GET(req: NextRequest) {
  try {
    const queryParams = extractPaginationParams(req.nextUrl.searchParams);

    const result = await backendRequest<ApiTankListResponse>(
      `/api/company/tanks/without-batches?${queryParams.toString()}`,
      {
        method: 'GET',
        withAuth: true,
        errorFallback: 'Erro ao listar tanques disponíveis',
      },
    );

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    const response: TankListResponse = mapApiTankList(result.data);
    return NextResponse.json(response, { status: result.status });
  } catch (error) {
    console.error('Erro ao listar tanques sem lotes:', error);
    return HttpResponses.serverError();
  }
}

function extractPaginationParams(searchParams: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams();

  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('per_page') ?? '15';

  params.set('page', page);
  params.set('per_page', perPage);

  return params;
}
