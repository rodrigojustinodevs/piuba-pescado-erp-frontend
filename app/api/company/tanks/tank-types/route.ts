import { NextRequest, NextResponse } from 'next/server';
import type { TankType } from '@/features/tank';
import { backendRequest, HttpResponses } from '../../../_utils/backendProxy';

/**
 * GET /api/company/tanks/tank-types - Lista tipos de tanque (proxy para backend)
 */
export async function GET(_req: NextRequest) {
  try {
    const result = await backendRequest<TankType[]>(`/api/company/tank-types`, {
      method: 'GET',
      withAuth: true,
      errorFallback: 'Erro ao listar tipos de tanque',
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Erro ao listar tipos de tanque:', error);
    return HttpResponses.serverError();
  }
}
