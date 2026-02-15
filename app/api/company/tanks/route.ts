import { NextRequest, NextResponse } from 'next/server';
import type {
  TankListResponse,
  ApiTankListResponse,
  CreateTankData,
  Tank,
  ApiTank,
} from '@/features/tank';
import { mapApiTank, mapApiTankList } from '@/features/tank/utils/apiMapper';
import { backendRequest, HttpResponses } from '../../_utils/backendProxy';

/**
 * Formato de resposta da API para operações individuais
 */
interface ApiTankResponse {
  status: boolean;
  response: ApiTank;
  message: string;
}

/**
 * GET /api/company/tanks - Lista tanques com paginação (proxy para backend)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';

    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    });

    const result = await backendRequest<ApiTankListResponse>(`/api/company/tanks?${params}`, {
      method: 'GET',
      withAuth: true,
      errorFallback: 'Erro ao listar tanques',
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    const response: TankListResponse = mapApiTankList(result.data);
    return NextResponse.json(response, { status: result.status });
  } catch (error) {
    console.error('Erro ao listar tanques:', error);
    return HttpResponses.serverError();
  }
}

/**
 * POST /api/company/tanks - Cria um novo tanque (proxy para backend)
 */
export async function POST(req: NextRequest) {
  try {
    const data: CreateTankData = await req.json();

    const result = await backendRequest<ApiTankResponse>(`/api/company/tank`, {
      method: 'POST',
      withAuth: true,
      body: JSON.stringify(data),
      errorFallback: 'Erro ao criar tanque',
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    const tank: Tank = mapApiTank(result.data.response);
    return NextResponse.json(tank, { status: result.status });
  } catch (error) {
    console.error('Erro ao criar tanque:', error);
    return HttpResponses.serverError();
  }
}
