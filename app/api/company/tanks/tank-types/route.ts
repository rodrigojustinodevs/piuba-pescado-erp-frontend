import { NextResponse } from 'next/server';
import type { TankType } from '@/features/tank';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { serverHttpClient } from '@/shared/lib/http';

/**
 * GET /api/company/tanks/tank-types - Lista tipos de tanque (proxy para backend)
 */
export async function GET() {
  try {
    const result = await serverHttpClient.request<TankType[]>(`/api/company/tank-types`, {
      method: 'GET',
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Erro ao listar tipos de tanque:', error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}
