import { NextRequest, NextResponse } from 'next/server';
import { backendRequest, HttpResponses } from './backendProxy';
import { extractPagePerPageParams } from './pagination';

/**
 * Log de erro e resposta 500 padronizada para rotas proxy.
 * Remove duplicação entre transfers, settlements e demais rotas de listagem/criação.
 */
export function handleServerError(error: unknown, context: string): NextResponse {
  console.error(`[${context}]:`, {
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  });
  return HttpResponses.serverError();
}

export type ListGetConfig<TApi, TFront> = {
  backendPath: string;
  errorFallback: string;
  mapResponse: (data: TApi) => TFront;
  context: string;
  /** Se não informado, usa page e per_page via extractPagePerPageParams. */
  buildQueryString?: (searchParams: URLSearchParams) => string;
};

/**
 * Cria um handler GET para listagem paginada (proxy para backend).
 */
export function createListGetHandler<TApi, TFront>(config: ListGetConfig<TApi, TFront>) {
  return async function GET(req: NextRequest) {
    try {
      const searchParams = req.nextUrl.searchParams;
      const queryString = config.buildQueryString
        ? config.buildQueryString(searchParams)
        : extractPagePerPageParams(searchParams).toString();
      const endpoint = queryString ? `${config.backendPath}?${queryString}` : config.backendPath;
      const result = await backendRequest<TApi>(endpoint, {
        method: 'GET',
        withAuth: true,
        errorFallback: config.errorFallback,
      });

      if (!result.ok) {
        return HttpResponses.fromApiError(result.error, result.status);
      }

      const response = config.mapResponse(result.data);
      return NextResponse.json(response, { status: result.status });
    } catch (error) {
      return handleServerError(error, config.context);
    }
  };
}

export type CreatePostConfig<TApi, TBody> = {
  backendPath: string;
  errorFallback: string;
  context: string;
  /** Se informado, o corpo da resposta é mapeado antes de enviar (ex.: backend retorna { response }). */
  mapResponse?: (data: TApi) => unknown;
};

/**
 * Cria um handler POST para criação (proxy para backend).
 * O body da requisição é enviado como JSON; a resposta usa mapResponse se informado, senão result.data.
 */
export function createCreatePostHandler<TApi, TBody>(config: CreatePostConfig<TApi, TBody>) {
  return async function POST(req: NextRequest) {
    try {
      const data = (await req.json()) as TBody;

      const result = await backendRequest<TApi>(config.backendPath, {
        method: 'POST',
        withAuth: true,
        body: JSON.stringify(data),
        errorFallback: config.errorFallback,
      });

      if (!result.ok) {
        return HttpResponses.fromApiError(result.error, result.status);
      }

      const body = config.mapResponse ? config.mapResponse(result.data) : result.data;
      return NextResponse.json(body, { status: result.status });
    } catch (error) {
      return handleServerError(error, config.context);
    }
  };
}
