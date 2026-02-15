import { NextRequest, NextResponse } from 'next/server';
import type {
  BatchListResponse,
  ApiBatchListResponse,
  CreateBatchData,
  Batch,
} from '@/features/batch';
import { mapApiBatchList } from '@/features/batch/utils/apiMapper';
import { backendRequest, HttpResponses } from '../../_utils/backendProxy';

/**
 * GET /api/company/batches - Lista lotes da empresa (proxy para backend)
 * Usa /api/company/batches (plural) apenas para listagem.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') ?? '';
    const limit = searchParams.get('limit') ?? '';
    const search = searchParams.get('search') ?? '';

    const params = new URLSearchParams();
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
    if (search) params.set('search', search);

    const query = params.toString();
    const endpoint = `/api/company/batches${query ? `?${query}` : ''}`;

    const result = await backendRequest<ApiBatchListResponse>(endpoint, {
      method: 'GET',
      withAuth: true,
      errorFallback: 'Erro ao listar lotes',
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    const response: BatchListResponse = mapApiBatchList(result.data);
    return NextResponse.json(response, { status: result.status });
  } catch (error) {
    console.error('Erro ao listar lotes:', error);
    return HttpResponses.serverError();
  }
}

/**
 * POST /api/company/batches - Cria um novo lote (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export async function POST(req: NextRequest) {
  try {
    const data: CreateBatchData = await req.json();

    const result = await backendRequest<Batch>(`/api/company/batche`, {
      method: 'POST',
      withAuth: true,
      body: JSON.stringify(data),
      errorFallback: 'Erro ao criar lote',
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('Erro ao criar lote:', error);
    return HttpResponses.serverError();
  }
}
