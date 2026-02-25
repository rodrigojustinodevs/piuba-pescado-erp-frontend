import { NextRequest, NextResponse } from 'next/server';
import type { ApiTransferResponse, Transfer, UpdateTransferData } from '@/features/transfer';
import { mapApiTransfer } from '@/features/transfer';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { serverHttpClient } from '@/shared/lib/http';

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
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

/**
 * GET /api/company/transfers/[id] - Busca uma transferência por ID (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/transfer (singular).
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  return withTransferId(params, 'buscar', async (id) => {
    const result = await serverHttpClient.request<ApiTransferResponse>(backendTransferPath(id), {
      method: 'GET',
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
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

    const result = await serverHttpClient.request<ApiTransferResponse>(backendTransferPath(id), {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return toTransferResponse(result);
  });
}

/**
 * DELETE /api/company/transfers/[id] - Remove uma transferência (proxy para backend)
 * Padronização: expomos plural, mas o backend usa /api/company/transfer (singular).
 */
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  return withTransferId(params, 'deletar', async (id) => {
    const result = await serverHttpClient.request(backendTransferPath(id), {
      method: 'DELETE',
      expectJson: false,
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ success: true }, { status: result.status });
  });
}
