import { serverHttpClient } from '@/shared/lib/http';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';
import { failureResponse, successResponse } from './responseEnvelope';
import { withErrorHandling } from './routeMiddleware';

export type ListGetConfig<TApi, TFront> = {
  backendPath: string;
  context: string;
  mapResponse: (data: TApi) => TFront;
  buildQueryString?: (searchParams: URLSearchParams) => string;
};

export function createListGetHandler<TApi, TFront>(config: ListGetConfig<TApi, TFront>) {
  return withErrorHandling(async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const queryString = config.buildQueryString
      ? config.buildQueryString(searchParams)
      : buildPaginationQueryString(searchParams);
    const endpoint = queryString ? `${config.backendPath}?${queryString}` : config.backendPath;
    const result = await serverHttpClient.request<TApi>(endpoint, {
      method: 'GET',
    });

    if (!result.ok) {
      return failureResponse(result.error, result.status);
    }

    return successResponse(config.mapResponse(result.data), result.status);
  }, config.context);
}

type ParamsContext<TParams extends Record<string, string>> = {
  params: Promise<TParams>;
};

export type DetailGetConfig<TApi, TFront, TParams extends Record<string, string>> = {
  backendPathBuilder: (params: TParams) => string;
  context: string;
  mapResponse: (data: TApi) => TFront;
};

export function createDetailGetHandler<
  TApi,
  TFront,
  TParams extends Record<string, string> = Record<string, string>,
>(config: DetailGetConfig<TApi, TFront, TParams>) {
  return withErrorHandling(async function GET(_req: Request, routeContext: ParamsContext<TParams>) {
    const params = await routeContext.params;
    const result = await serverHttpClient.request<TApi>(config.backendPathBuilder(params), {
      method: 'GET',
    });

    if (!result.ok) {
      return failureResponse(result.error, result.status);
    }

    return successResponse(config.mapResponse(result.data), result.status);
  }, config.context);
}

export type PutConfig<TApi, TBody, TParams extends Record<string, string>> = {
  backendPathBuilder: (params: TParams) => string;
  context: string;
  mapBody?: (payload: TBody) => unknown;
  mapResponse?: (data: TApi) => unknown;
};

export function createPutHandler<
  TApi,
  TBody,
  TParams extends Record<string, string> = Record<string, string>,
>(config: PutConfig<TApi, TBody, TParams>) {
  return withErrorHandling(async function PUT(req: Request, routeContext: ParamsContext<TParams>) {
    const params = await routeContext.params;
    const payload = (await req.json()) as TBody;
    const requestBody = config.mapBody ? config.mapBody(payload) : payload;
    const result = await serverHttpClient.request<TApi>(config.backendPathBuilder(params), {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });

    if (!result.ok) {
      return failureResponse(result.error, result.status);
    }

    const responseData = config.mapResponse ? config.mapResponse(result.data) : result.data;
    return successResponse(responseData, result.status);
  }, config.context);
}

export type DeleteConfig<TParams extends Record<string, string>> = {
  backendPathBuilder: (params: TParams) => string;
  context: string;
};

export function createDeleteHandler<
  TParams extends Record<string, string> = Record<string, string>,
>(config: DeleteConfig<TParams>) {
  return withErrorHandling(async function DELETE(
    _req: Request,
    routeContext: ParamsContext<TParams>,
  ) {
    const params = await routeContext.params;
    const result = await serverHttpClient.request(config.backendPathBuilder(params), {
      method: 'DELETE',
      expectJson: false,
    });

    if (!result.ok) {
      return failureResponse(result.error, result.status);
    }

    return successResponse(null, result.status);
  }, config.context);
}

export type UpsertMethod = 'POST' | 'PUT';

export type UpsertConfig<TApi, TBody> = {
  backendPath: string;
  method: UpsertMethod;
  context: string;
  mapBody?: (payload: TBody) => unknown;
  mapResponse?: (data: TApi) => unknown;
};

export function createUpsertHandler<TApi, TBody>(config: UpsertConfig<TApi, TBody>) {
  return withErrorHandling(async function UPSERT(req: Request) {
    const payload = (await req.json()) as TBody;
    const requestBody = config.mapBody ? config.mapBody(payload) : payload;
    const result = await serverHttpClient.request<TApi>(config.backendPath, {
      method: config.method,
      body: JSON.stringify(requestBody),
    });

    if (!result.ok) {
      return failureResponse(result.error, result.status);
    }

    const responseData = config.mapResponse ? config.mapResponse(result.data) : result.data;
    return successResponse(responseData, result.status);
  }, config.context);
}
