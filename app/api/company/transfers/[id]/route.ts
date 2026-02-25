import { NextRequest, NextResponse } from 'next/server';
import type { ApiTransferResponse, Transfer, UpdateTransferData } from '@/features/transfer';
import { mapApiTransfer } from '@/features/transfer';
import { backendRequest, HttpResponses } from '../../../_utils/backendProxy';

type RouteParams = { params: Promise<{ id: string }> };

const backendTransferPath = (id: string) => `/api/company/transfer/${id}`;

function toTransferResponse(result: { data: ApiTransferResponse; status: number }) {
  const transfer: Transfer = mapApiTransfer(result.data);
  return NextResponse.json(transfer, { status: result.status });
}

async function withTransferId(
  params: RouteParams['params'],
  actionLabel: string,
  handler: (id: string) => Promise<NextResponse>,
) {
  try {
    const { id } = await params;
    return await handler(id);
  } catch (error) {
    console.error(`Erro ao ${actionLabel} transferência:`, error);
    return HttpResponses.serverError();
  }
}

/**
 * GET /api/company/transfers/[id] - Busca uma transferência por ID (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/transfer (singular).
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  return withTransferId(params, 'buscar', async (id) => {
    const result = await backendRequest<ApiTransferResponse>(backendTransferPath(id), {
      method: 'GET',
      withAuth: true,
      errorFallback: 'Transferência não encontrada',
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);
    return toTransferResponse(result);
  });
}

/**
 * PUT /api/company/transfers/[id] - Atualiza uma transferência (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/transfer (singular).
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return withTransferId(params, 'atualizar', async (id) => {
    const body = (await req.json().catch(() => null)) as Omit<UpdateTransferData, 'id'> | null;

    if (!body) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const result = await backendRequest<ApiTransferResponse>(backendTransferPath(id), {
      method: 'PUT',
      withAuth: true,
      body: JSON.stringify(body),
      errorFallback: 'Erro ao atualizar transferência',
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);
    return toTransferResponse(result);
  });
}

/**
 * DELETE /api/company/transfers/[id] - Remove uma transferência (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/transfer (singular).
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  return withTransferId(params, 'deletar', async (id) => {
    const result = await backendRequest(backendTransferPath(id), {
      method: 'DELETE',
      withAuth: true,
      expectJson: false,
      errorFallback: 'Erro ao excluir transferência',
    });

    if (!result.ok) return HttpResponses.fromApiError(result.error, result.status);
    return NextResponse.json({ success: true }, { status: result.status });
  });
}
