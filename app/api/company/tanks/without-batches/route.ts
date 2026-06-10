import { NextRequest, NextResponse } from 'next/server';
import type { ApiTankListResponse, TankListResponse } from '@/features/tank';
import { mapApiTankList } from '@/features/tank/utils/apiMapper';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
import { serverHttpClient } from '@/shared/lib/http';
import { buildPaginationQueryStringWithPassthrough } from '@/shared/lib/pagination/paginationQuery';

/**
 * GET /api/company/tanks/without-batches - Lista tanques sem lotes (proxy para backend)
 */
export const GET = withAuthGuard(async (_auth, req: NextRequest) => {
  try {
    const queryString = buildPaginationQueryStringWithPassthrough(req.nextUrl.searchParams, {
      limitParam: 'per_page',
      defaultLimit: 15,
      passthrough: ['companyId'],
    });

    const data = await serverHttpClient.request<ApiTankListResponse>(
      `/api/company/tanks/without-batches?${queryString}`,
      {
        method: 'GET',
      },
    );
    const response: TankListResponse = mapApiTankList(data);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Erro ao listar tanques sem lotes:', error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
});
