import { NextRequest, NextResponse } from 'next/server';
import type { ApiTransferResponse, Transfer, UpdateTransferData } from '@/features/transfer';
import { mapApiTransfer } from '@/features/transfer';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
import { serverHttpClient } from '@/shared/lib/http';

type RouteParams = { params: Promise<{ id: string }> };

const backendTransferPath = (id: string) => `/api/company/transfer/${id}`;

function toTransferResponse(data: ApiTransferResponse) {
  const transfer: Transfer = mapApiTransfer(data);
  return NextResponse.json(transfer, { status: 200 });
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
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(`Erro ao ${actionLabel} transferência:`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

/**
 * GET /api/company/transfers/[id] - Busca uma transferência por ID (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/transfer (singular).
 */
export const GET = withAuthGuard(async (_auth, _req: NextRequest, { params }: RouteParams) => {
  return withTransferId(params, 'buscar', async (id) => {
    const data = await serverHttpClient.request<ApiTransferResponse>(backendTransferPath(id), {
      method: 'GET',
    });
    return toTransferResponse(data);
  });
});

/**
 * PUT /api/company/transfers/[id] - Atualiza uma transferência (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/transfer (singular).
 */
export const PUT = withAuthGuard(async (_auth, req: NextRequest, { params }: RouteParams) => {
  return withTransferId(params, 'atualizar', async (id) => {
    const body = (await req.json().catch(() => null)) as Omit<UpdateTransferData, 'id'> | null;

    if (!body) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const responseData = await serverHttpClient.request<ApiTransferResponse>(
      backendTransferPath(id),
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    );
    return toTransferResponse(responseData);
  });
});

/**
 * DELETE /api/company/transfers/[id] - Remove uma transferência (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/transfer (singular).
 */
export const DELETE = withAuthGuard(async (_auth, _req: NextRequest, { params }: RouteParams) => {
  return withTransferId(params, 'deletar', async (id) => {
    await serverHttpClient.request(backendTransferPath(id), {
      method: 'DELETE',
      expectJson: false,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  });
});
