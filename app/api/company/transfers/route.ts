import { NextRequest, NextResponse } from 'next/server';
import type {
  ApiTransferListResponse,
  CreateTransferData,
  Transfer,
  TransferListResponse,
} from '@/features/transfer';
import { mapApiTransferList } from '@/features/transfer';
import { backendRequest, HttpResponses } from '../../_utils/backendProxy';

export async function GET(req: NextRequest) {
  try {
    const queryParams = extractPaginationParams(req.nextUrl.searchParams);

    const result = await backendRequest<ApiTransferListResponse>(
      `/api/company/transfers?${queryParams.toString()}`,
      {
        method: 'GET',
        withAuth: true,
        errorFallback: 'Falha na comunicação com o serviço de transferências',
      },
    );

    if (!result.ok) {
      return HttpResponses.fromApiError(result.error, result.status);
    }

    const response: TransferListResponse = mapApiTransferList(result.data);
    return NextResponse.json(response, { status: result.status });
  } catch (error) {
    return handleServerError(error);
  }
}

function extractPaginationParams(searchParams: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams();

  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('per_page') ?? '25';

  params.set('page', page);
  params.set('per_page', perPage);

  return params;
}

export async function POST(req: NextRequest) {
  try {
    const data: CreateTransferData = await req.json();

    const result = await backendRequest<Transfer>(`/api/company/transfer`, {
      method: 'POST',
      withAuth: true,
      body: JSON.stringify(data),
      errorFallback: 'Erro ao criar transferência',
    });

    if (!result.ok) {
      return HttpResponses.fromApiError(result.error, result.status);
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    return handleServerError(error);
  }
}

function handleServerError(error: unknown) {
  console.error('[Transfers API Proxy Error]:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  });

  return HttpResponses.serverError();
}
