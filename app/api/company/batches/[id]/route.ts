import { NextRequest, NextResponse } from 'next/server';
import type { Batch, UpdateBatchData, ApiBatchResponse } from '@/features/batch';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
import { serverHttpClient } from '@/shared/lib/http';
import { mapApiBatch } from '@/features/batch/utils/apiMapper';

type RouteParams = { params: Promise<{ id: string }> };

const backendBatchPath = (id: string) => `/api/company/batche/${id}`;

function toBatchResponse(data: ApiBatchResponse) {
  const batch: Batch = mapApiBatch(data);
  return NextResponse.json(batch, { status: 200 });
}

async function withBatchId(
  params: RouteParams['params'],
  actionLabel: string,
  handler: (id: string) => Promise<NextResponse>,
) {
  try {
    const { id } = await params;
    return await handler(id);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(`Erro ao ${actionLabel} lote:`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

/**
 * GET /api/company/batches/[id] - Busca um lote por ID (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export const GET = withAuthGuard(async (_auth, _req: NextRequest, { params }: RouteParams) => {
  return withBatchId(params, 'buscar', async (id) => {
    const data = await serverHttpClient.request<ApiBatchResponse>(backendBatchPath(id), {
      method: 'GET',
    });
    return toBatchResponse(data);
  });
});

/**
 * PUT /api/company/batches/[id] - Atualiza um lote (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export const PUT = withAuthGuard(async (_auth, req: NextRequest, { params }: RouteParams) => {
  return withBatchId(params, 'atualizar', async (id) => {
    const data: Omit<UpdateBatchData, 'id'> = await req.json();
    const responseData = await serverHttpClient.request<ApiBatchResponse>(backendBatchPath(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return toBatchResponse(responseData);
  });
});

/**
 * DELETE /api/company/batches/[id] - Remove um lote (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export const DELETE = withAuthGuard(async (_auth, _req: NextRequest, { params }: RouteParams) => {
  return withBatchId(params, 'deletar', async (id) => {
    await serverHttpClient.request(backendBatchPath(id), {
      method: 'DELETE',
      expectJson: false,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  });
});
