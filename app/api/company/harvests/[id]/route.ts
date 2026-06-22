import { NextRequest, NextResponse } from 'next/server';
import type { ApiHarvestResponse, Harvest, UpdateHarvestData } from '@/features/harvest';
import { mapApiHarvest } from '@/features/harvest';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
import { serverHttpClient } from '@/shared/lib/http';

type RouteParams = { params: Promise<{ id: string }> };

const backendPath = (id: string) => `/api/company/harvest/${id}`;

function toHarvestResponse(data: ApiHarvestResponse) {
  const harvest: Harvest = mapApiHarvest(data);
  return NextResponse.json(harvest, { status: 200 });
}

async function withHarvestId(
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
    console.error(`Erro ao ${actionLabel} despesca:`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
}

export const GET = withAuthGuard(async (_auth, _req: NextRequest, { params }: RouteParams) => {
  return withHarvestId(params, 'buscar', async (id) => {
    const data = await serverHttpClient.request<ApiHarvestResponse>(backendPath(id), {
      method: 'GET',
    });
    return toHarvestResponse(data);
  });
});

export const PUT = withAuthGuard(async (_auth, req: NextRequest, { params }: RouteParams) => {
  return withHarvestId(params, 'atualizar', async (id) => {
    const body = (await req.json().catch(() => null)) as Omit<UpdateHarvestData, 'id'> | null;
    if (!body) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const responseData = await serverHttpClient.request<ApiHarvestResponse>(backendPath(id), {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return toHarvestResponse(responseData);
  });
});

export const DELETE = withAuthGuard(async (_auth, _req: NextRequest, { params }: RouteParams) => {
  return withHarvestId(params, 'deletar', async (id) => {
    await serverHttpClient.request(backendPath(id), {
      method: 'DELETE',
      expectJson: false,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  });
});
