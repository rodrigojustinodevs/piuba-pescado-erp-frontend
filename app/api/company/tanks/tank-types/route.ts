import { NextResponse } from 'next/server';
import type { ApiTankTypeListResponse, TankType } from '@/features/tank/types';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
import { serverHttpClient } from '@/shared/lib/http';

/**
 * GET /api/company/tanks/tank-types - Lista tipos de tanque (proxy para backend)
 */
export const GET = withAuthGuard(async (_auth) => {
  void _auth;
  try {
    const data = await serverHttpClient.request<ApiTankTypeListResponse | TankType[]>(
      `/api/company/tank-types`,
      {
        method: 'GET',
      },
    );

    const tankTypes = Array.isArray(data) ? data : (data?.response ?? []);
    return NextResponse.json(tankTypes, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Erro ao listar tipos de tanque:', error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
});
