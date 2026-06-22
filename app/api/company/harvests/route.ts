import { NextRequest, NextResponse } from 'next/server';
import type { ApiHarvestListResponse, CreateHarvestData, HarvestListResponse } from '@/features/harvest';
import { mapApiHarvestList } from '@/features/harvest';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';
import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { HttpError } from '@/shared/lib/http/httpError';
import { serverHttpClient } from '@/shared/lib/http';

const CONTEXT = 'Harvests API Proxy';

export const GET = createListGetHandler<ApiHarvestListResponse, HarvestListResponse>({
  backendPath: '/api/company/harvests',
  mapResponse: mapApiHarvestList,
  context: CONTEXT,
  buildQueryString: buildPaginationQueryString,
});

export const POST = withAuthGuard(async (_auth, req: NextRequest) => {
  try {
    const body = (await req.json().catch(() => null)) as Omit<CreateHarvestData, 'companyId'> | null;
    if (!body) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    const data = await serverHttpClient.request('/api/company/harvest', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(`[${CONTEXT}] Erro ao criar despesca:`, error);
    return NextResponse.json({ error: ErrorMessages.SERVER_CONNECTION }, { status: 500 });
  }
});
