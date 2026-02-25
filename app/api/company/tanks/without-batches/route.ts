import { NextRequest, NextResponse } from 'next/server';
import type { ApiTankListResponse, TankListResponse } from '@/features/tank';
import { mapApiTankList } from '@/features/tank/utils/apiMapper';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { serverHttpClient } from '@/shared/lib/http';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

/**
 * GET /api/company/tanks/without-batches - Lista tanques sem lotes (proxy para backend)
 */
export async function GET(req: NextRequest) {
  try {
    const queryString = buildPaginationQueryString(req.nextUrl.searchParams, {
      limitParam: 'per_page',
      defaultLimit: 15,
    });

    const result = await serverHttpClient.request<ApiTankListResponse>(
      `/api/company/tanks/without-batches?${queryString}`,
      {
        method: 'GET',
      },
    );

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

    const response: TankListResponse = mapApiTankList(result.data);
    return NextResponse.json(response, { status: result.status });
  } catch (error) {
    console.error('Erro ao listar tanques sem lotes:', error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}
