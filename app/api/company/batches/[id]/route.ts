import { NextRequest, NextResponse } from 'next/server';
import type { Batch, UpdateBatchData, ApiBatchResponse } from '@/features/batch';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { serverHttpClient } from '@/shared/lib/http';
import { mapApiBatch } from '@/features/batch/utils/apiMapper';

type RouteParams = { params: Promise<{ id: string }> };

const backendBatchPath = (id: string) => `/api/company/batche/${id}`;

function toBatchResponse(result: { data: ApiBatchResponse; status: number }) {
  const batch: Batch = mapApiBatch(result.data);
  return NextResponse.json(batch, { status: result.status });
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
    console.error(`Erro ao ${actionLabel} lote:`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

/**
 * GET /api/company/batches/[id] - Busca um lote por ID (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  return withBatchId(params, 'buscar', async (id) => {
    const result = await serverHttpClient.request<ApiBatchResponse>(backendBatchPath(id), {
      method: 'GET',
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return toBatchResponse(result);
  });
}

/**
 * PUT /api/company/batches/[id] - Atualiza um lote (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return withBatchId(params, 'atualizar', async (id) => {
    const data: Omit<UpdateBatchData, 'id'> = await req.json();
    const result = await serverHttpClient.request<ApiBatchResponse>(backendBatchPath(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return toBatchResponse(result);
  });
}

/**
 * DELETE /api/company/batches/[id] - Remove um lote (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/batche (singular).
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  return withBatchId(params, 'deletar', async (id) => {
    const result = await serverHttpClient.request(backendBatchPath(id), {
      method: 'DELETE',
      expectJson: false,
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true }, { status: result.status });
  });
}
